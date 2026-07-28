"""Transactional email for Cozy Box — booking confirmations, reminders, orders.

Provider priority:
  1. Resend HTTP API   — when RESEND_API_KEY is set. Preferred: it also supports
     scheduled sends (`scheduled_at`), which powers booking *reminder* emails
     with no cron/worker needed.
  2. SMTP              — when SMTP_HOST/USER/PASS are set (any provider). No
     native scheduling, so reminders are only sent when Resend is configured.
  3. No-op             — nothing configured: every send is logged and skipped so
     the booking/order flow never breaks in dev or before credentials exist.

Square still emails its own card receipt for online orders and, when Square
Appointments notifications are enabled, its own booking confirmation — these
cozybox.au emails are the branded, on-brand layer on top.

Enable Resend (recommended) — add to backend/.env:
  RESEND_API_KEY=re_xxxxxxxx
  MAIL_FROM=hello@cozybox.au            # must be on a domain verified in Resend
  MAIL_FROM_NAME=Cozy Box by Fossey's
  MAIL_BCC=hello@cozybox.au            # venue copy of every confirmation
  BOOKING_REMINDER_HOURS=3            # send the reminder this many hours before
"""
import asyncio
import base64
import logging
import os
import smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from zoneinfo import ZoneInfo

import httpx

log = logging.getLogger("cozybox.mailer")

# ── Config ─────────────────────────────────────────────────
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
RESEND_API_URL = os.environ.get("RESEND_API_URL", "https://api.resend.com/emails")
# Resend can schedule up to ~72h ahead; anything further is handled by the
# daily sweep (server /api/tasks/schedule-reminders).
RESEND_SCHEDULE_MAX_HOURS = float(os.environ.get("RESEND_SCHEDULE_MAX_HOURS", "72"))

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")

MAIL_FROM = os.environ.get("MAIL_FROM", SMTP_USER or "hello@cozybox.au")
MAIL_FROM_NAME = os.environ.get("MAIL_FROM_NAME", "Cozy Box by Fossey's")
MAIL_BCC = os.environ.get("MAIL_BCC")           # venue copy of every email (tracking)
MAIL_REPLY_TO = os.environ.get("MAIL_REPLY_TO")  # where customer replies land
# Absolute URL of the hero image shown at the top of emails. Defaults to the
# production site; loads once the frontend is live at cozybox.au.
MAIL_HERO_IMAGE = os.environ.get("MAIL_HERO_IMAGE", "https://cozybox.au/img/real_cocktail.jpg")
# Logo shown in the email header (falls back to a text wordmark if unset).
MAIL_LOGO_IMAGE = os.environ.get("MAIL_LOGO_IMAGE", "https://cozybox.au/img/cozybox-logo.png")
SITE_URL = os.environ.get("SITE_URL", "https://cozybox.au")
MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + \
    "209+Lygon+St,+Carlton+VIC+3053"
# Staging guard: when set, EVERY email (confirmations, reminders, orders) is
# redirected to this address and the venue BCC is dropped — so testing a live
# deploy can never email a real customer. Unset it to go truly live.
MAIL_OVERRIDE_TO = os.environ.get("MAIL_OVERRIDE_TO")

VENUE_TZ = ZoneInfo(os.environ.get("VENUE_TZ", "Australia/Melbourne"))
VENUE_ADDRESS = "209 Lygon St, Carlton VIC 3053"
BOOKING_REMINDER_HOURS = float(os.environ.get("BOOKING_REMINDER_HOURS", "3"))
BOOKING_DURATION_MIN = int(os.environ.get("BOOKING_DURATION_MIN", "90"))

if RESEND_API_KEY:
    provider = "resend"
elif SMTP_HOST and SMTP_USER and SMTP_PASS and MAIL_FROM:
    provider = "smtp"
else:
    provider = None

enabled = provider is not None
can_schedule = provider == "resend"


def _fmt_aud(cents):
    return f"${(cents or 0) / 100:,.2f}"


# ── Branded HTML shell ─────────────────────────────────────
def _shell(preheader: str, inner_html: str, hero: bool = True) -> str:
    hero_band = ""
    if hero and MAIL_HERO_IMAGE:
        hero_band = f"""
  <tr><td style="padding:0">
    <img src="{MAIL_HERO_IMAGE}" width="560" alt="Cozy Box by Fossey's Distillery"
      style="display:block;width:100%;max-height:190px;object-fit:cover;border:0" />
  </td></tr>"""
    logo_html = (
        f'<img src="{MAIL_LOGO_IMAGE}" alt="Cozy Box" height="46" '
        f'style="height:46px;display:block;margin:0 auto 6px;border:0" />'
        if MAIL_LOGO_IMAGE else
        '<div style="font:600 15px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial;'
        'letter-spacing:.34em;text-transform:uppercase;color:#e8b755">COZY BOX</div>'
    )
    return f"""\
<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0d0b09;">
<span style="display:none;opacity:0;color:#0d0b09;font-size:1px">{preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d0b09;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#141210;border:1px solid #2a2621;border-radius:18px;overflow:hidden">
  <tr><td style="height:3px;background:linear-gradient(90deg,#8a5f1c,#e8b755,#8a5f1c);font-size:0;line-height:0">&nbsp;</td></tr>
  <tr><td style="padding:28px 40px 18px;text-align:center">
    {logo_html}
    <div style="font:400 11px/1 -apple-system,Segoe UI,Roboto,Helvetica,Arial;letter-spacing:.24em;text-transform:uppercase;color:#7d766c;margin-top:8px">by Fossey's Distillery</div>
  </td></tr>{hero_band}
  <tr><td style="padding:30px 40px 34px;color:#d9d2c7;font:400 15px/1.66 -apple-system,Segoe UI,Roboto,Helvetica,Arial">
    {inner_html}
  </td></tr>
  <tr><td style="padding:20px 40px 26px;border-top:1px solid #2a2621;color:#7d766c;font:400 12px/1.7 -apple-system,Segoe UI,Roboto,Helvetica,Arial;text-align:center">
    <a href="{MAPS_URL}" style="color:#c99a4b;text-decoration:none">{VENUE_ADDRESS}</a> · Open Wednesday to Sunday<br>
    <a href="{SITE_URL}" style="color:#c99a4b;text-decoration:none">cozybox.au</a> ·
    <a href="https://instagram.com/cozybox_au" style="color:#c99a4b;text-decoration:none">@cozybox_au</a> ·
    <a href="mailto:hello@cozybox.au" style="color:#c99a4b;text-decoration:none">hello@cozybox.au</a>
    <div style="margin-top:10px;color:#5f594f">Please enjoy responsibly · 18+</div>
  </td></tr>
</table>
</td></tr></table></body></html>"""


def _detail_rows(rows):
    out = ""
    for label, val in rows:
        out += (f'<tr><td style="padding:6px 0;color:#7d766c;width:96px">{label}</td>'
                f'<td style="padding:6px 0;color:#f2ede4;font-weight:600">{val}</td></tr>')
    return f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0">{out}</table>'


# ── .ics calendar invite ───────────────────────────────────
def _parse_local(date_str, time_str, start_at=None):
    """Return a tz-aware Melbourne datetime for the booking start."""
    if start_at:
        try:
            s = start_at.replace("Z", "+00:00")
            dt = datetime.fromisoformat(s)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=VENUE_TZ)
            return dt.astimezone(VENUE_TZ)
        except ValueError:
            pass
    try:
        naive = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        return naive.replace(tzinfo=VENUE_TZ)
    except (ValueError, TypeError):
        return None


def _ics(*, start_local, guests, booking_id):
    """A floating-time VEVENT the guest can add to their calendar."""
    end_local = start_local + timedelta(minutes=BOOKING_DURATION_MIN)
    fmt = "%Y%m%dT%H%M%S"
    uid = f"{(booking_id or 'booking')}@cozybox.au"
    stamp = datetime.now(VENUE_TZ).strftime(fmt)
    return "\r\n".join([
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Cozy Box//Bookings//EN",
        "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "BEGIN:VEVENT",
        f"UID:{uid}", f"DTSTAMP:{stamp}",
        f"DTSTART:{start_local.strftime(fmt)}", f"DTEND:{end_local.strftime(fmt)}",
        "SUMMARY:Table at Cozy Box by Fossey's",
        f"DESCRIPTION:Reservation for {guests} guest(s). {VENUE_ADDRESS}",
        f"LOCATION:{VENUE_ADDRESS}", "END:VEVENT", "END:VCALENDAR",
    ])


# ── Transport ──────────────────────────────────────────────
async def _send_resend(to, subject, html, text, ics=None, scheduled_at=None):
    payload = {
        "from": f"{MAIL_FROM_NAME} <{MAIL_FROM}>",
        "to": [to],
        "subject": subject,
        "html": html,
        "text": text,
    }
    if MAIL_BCC:
        payload["bcc"] = [MAIL_BCC]
    if MAIL_REPLY_TO:
        payload["reply_to"] = MAIL_REPLY_TO
    if ics:
        payload["attachments"] = [{
            "filename": "cozy-box-booking.ics",
            "content": base64.b64encode(ics.encode()).decode(),
            "content_type": "text/calendar",
        }]
    if scheduled_at:
        payload["scheduled_at"] = scheduled_at
    async with httpx.AsyncClient(timeout=20) as c:
        r = await c.post(RESEND_API_URL, json=payload,
                         headers={"Authorization": f"Bearer {RESEND_API_KEY}"})
        r.raise_for_status()
        return r.json().get("id")


def _send_smtp_sync(to, subject, html, text, ics=None):
    msg = EmailMessage()
    msg["From"] = f"{MAIL_FROM_NAME} <{MAIL_FROM}>"
    msg["To"] = to
    msg["Subject"] = subject
    if MAIL_BCC:
        msg["Bcc"] = MAIL_BCC
    if MAIL_REPLY_TO:
        msg["Reply-To"] = MAIL_REPLY_TO
    msg.set_content(text)
    msg.add_alternative(html, subtype="html")
    if ics:
        msg.add_attachment(ics.encode(), maintype="text", subtype="calendar",
                           filename="cozy-box-booking.ics")
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
        s.starttls()
        s.login(SMTP_USER, SMTP_PASS)
        s.send_message(msg)


async def _send(to, subject, html, text, *, ics=None, scheduled_at=None):
    """Never raises — a failed email must not fail the booking/order.

    Returns the provider message id (Resend) or True (SMTP) on success, else None.
    """
    if not enabled:
        log.info("mailer disabled (no provider); skipped '%s' to %s", subject, to)
        return None
    if not to:
        return None
    try:
        if provider == "resend":
            return await _send_resend(to, subject, html, text, ics=ics, scheduled_at=scheduled_at)
        if scheduled_at:
            log.warning("SMTP cannot schedule; skipping scheduled send '%s' to %s", subject, to)
            return None
        await asyncio.to_thread(_send_smtp_sync, to, subject, html, text, ics=ics)
        return True
    except Exception as e:  # pragma: no cover
        log.warning("email '%s' to %s failed: %s", subject, to, e)
        return None


# ── Templates + public API ─────────────────────────────────
def _booking_when(start_local, date, time):
    if start_local:
        return start_local.strftime("%A %-d %B %Y"), start_local.strftime("%-I:%M %p")
    return date, time


async def send_booking_confirmation(*, to, name, date, time, guests, notes=None,
                                    booking_id=None, source="mock", start_at=None):
    start_local = _parse_local(date, time, start_at)
    day_str, time_str = _booking_when(start_local, date, time)
    confirmed = source == "square"
    lead = ("Your table is confirmed. We can't wait to host you."
            if confirmed else
            "We've received your booking request and will confirm shortly.")
    rows = [("Date", day_str), ("Time", time_str), ("Guests", str(guests))]
    if booking_id:
        rows.append(("Reference", str(booking_id)[:8].upper()))
    card_rows = "".join(
        f'<tr><td style="padding:9px 0;color:#8f8779;font:400 11px/1.4 -apple-system,Arial;'
        f'letter-spacing:.16em;text-transform:uppercase;width:110px;vertical-align:top">{label}</td>'
        f'<td style="padding:9px 0;color:#f4efe6;font:600 16px/1.4 -apple-system,Arial">{val}</td></tr>'
        + ('' if i == len(rows) - 1 else '<tr><td colspan="2" style="border-top:1px solid #26221c;font-size:0;line-height:0">&nbsp;</td></tr>')
        for i, (label, val) in enumerate(rows))
    notes_html = (f'<p style="margin:16px 0 0;color:#a89f92;font-size:14px"><span style="color:#c99a4b">Notes:</span> {notes}</p>'
                  if notes else "")
    inner = f"""\
<p style="font:400 12px/1 -apple-system,Arial;letter-spacing:.28em;text-transform:uppercase;color:#c99a4b;margin:0 0 12px">✦ {'Reservation confirmed' if confirmed else 'Booking received'} ✦</p>
<h1 style="font:600 27px/1.2 Georgia,'Times New Roman',serif;color:#f4efe6;margin:0 0 10px">Hi {name or 'there'},</h1>
<p style="margin:0 0 22px;color:#cfc7ba">{lead}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#100e0b;border:1px solid #2a2621;border-radius:12px">
  <tr><td style="padding:8px 24px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">{card_rows}</table>
  </td></tr>
</table>
{notes_html}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 6px"><tr>
  <td style="border-radius:999px;background:#e8b755">
    <a href="{MAPS_URL}" style="display:inline-block;padding:12px 26px;font:600 12px/1 -apple-system,Arial;letter-spacing:.16em;text-transform:uppercase;color:#161009;text-decoration:none">Get directions →</a>
  </td>
</tr></table>
<p style="margin:16px 0 0;color:#8f8779;font-size:13px">📎 A calendar invite is attached. Add it so the night's locked in. If anything changes, just reply to this email and we'll sort it.</p>
<p style="margin:22px 0 0;font:400 18px/1.3 Georgia,serif;color:#c99a4b">See you soon,<br><span style="color:#f4efe6">The Cozy Box team</span></p>"""
    subject = ("Your Cozy Box table is confirmed" if confirmed
               else "We've got your Cozy Box booking request")
    text = (f"Hi {name or 'there'},\n\n{lead}\n\n"
            f"Date: {day_str}\nTime: {time_str}\nGuests: {guests}\n"
            f"{'Ref: ' + str(booking_id)[:8] + chr(10) if booking_id else ''}"
            f"{'Notes: ' + notes + chr(10) if notes else ''}\n{VENUE_ADDRESS}\n")
    ics = _ics(start_local=start_local, guests=guests, booking_id=booking_id) if start_local else None
    return await _send(to, subject, _shell(subject, inner), text, ics=ics)


async def schedule_booking_reminder(*, to, name, date, time, guests, booking_id=None,
                                    start_at=None, now=None):
    """Schedule the pre-visit reminder via Resend `scheduled_at`.

    Returns a dict describing the outcome so the caller can persist state:
      {"scheduled": bool, "emailId": str|None, "at": iso|None, "reason": str}
    """
    now = now or datetime.now(VENUE_TZ)
    start_local = _parse_local(date, time, start_at)
    if not start_local:
        return {"scheduled": False, "reason": "no-start-time"}
    remind_at = start_local - timedelta(hours=BOOKING_REMINDER_HOURS)
    if remind_at <= now:
        return {"scheduled": False, "reason": "too-soon"}  # confirmation already covers it
    if not can_schedule:
        return {"scheduled": False, "reason": "provider-cannot-schedule"}
    hours_out = (remind_at - now).total_seconds() / 3600
    if hours_out > RESEND_SCHEDULE_MAX_HOURS:
        return {"scheduled": False, "reason": "beyond-window", "at": remind_at.isoformat()}

    day_str = start_local.strftime("%A %-d %B")
    
    time_str = start_local.strftime("%-I:%M %p")
    inner = f"""\
<h1 style="font:600 22px/1.25 Georgia,serif;color:#f2ede4;margin:0 0 6px">See you soon, {name or 'there'}.</h1>
<p style="margin:0 0 16px">A quick reminder of your table at Cozy Box.</p>
{_detail_rows([("Date", day_str), ("Time", time_str), ("Guests", guests)])}
<p style="margin:0 0 6px">Running late or need to change plans? Just reply and we'll sort it.</p>
<p style="margin:18px 0 0;color:#c99a4b">Cozy Box by Fossey's</p>"""
    text = (f"See you soon, {name or 'there'}.\n\nReminder of your table at Cozy Box.\n"
            f"Date: {day_str}\nTime: {time_str}\nGuests: {guests}\n\n{VENUE_ADDRESS}\n")
    subject = "Reminder: your table at Cozy Box"
    scheduled_iso = remind_at.astimezone(ZoneInfo("UTC")).isoformat()
    email_id = await _send(to, subject, _shell(subject, inner), text, scheduled_at=scheduled_iso)
    if email_id:
        return {"scheduled": True, "emailId": email_id, "at": remind_at.isoformat()}
    return {"scheduled": False, "reason": "send-failed", "at": remind_at.isoformat()}


async def send_order_confirmation(*, to, name, lines, total, order_id, receipt_url=None, shipping=None):
    items = "".join(
        f'<tr><td style="padding:4px 0;color:#d9d2c7">{l["qty"]} × {l["name"]}</td>'
        f'<td style="padding:4px 0;color:#f2ede4;text-align:right">{_fmt_aud(l["price"] * l["qty"])}</td></tr>'
        for l in lines)
    ship_html = ""
    if shipping:
        addr = ", ".join(x for x in [shipping.get("line1"), shipping.get("line2"),
                                     shipping.get("suburb"), shipping.get("state"),
                                     shipping.get("postcode")] if x)
        ship_html = f'<p style="margin:14px 0 0;color:#a89f92">Shipping to: {shipping.get("name") or name or ""}, {addr}</p>'
    receipt_html = (f'<p style="margin:18px 0 0"><a href="{receipt_url}" style="color:#c99a4b">View your receipt →</a></p>'
                    if receipt_url else "")
    inner = f"""\
<h1 style="font:600 22px/1.25 Georgia,serif;color:#f2ede4;margin:0 0 6px">Thanks, {name or 'there'}!</h1>
<p style="margin:0 0 16px">Your order from The Cellar is confirmed. Order #{str(order_id)[:8]}.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0;border-top:1px solid #2a2621;border-bottom:1px solid #2a2621">{items}
<tr><td style="padding:10px 0;color:#c99a4b;font-weight:600">Total</td><td style="padding:10px 0;color:#c99a4b;font-weight:600;text-align:right">{_fmt_aud(total)}</td></tr></table>
{ship_html}{receipt_html}
<p style="margin:18px 0 0;color:#c99a4b">Cheers,<br>Cozy Box by Fossey's</p>"""
    text = (f"Hi {name or 'there'},\n\nYour Cellar order #{str(order_id)[:8]} is confirmed.\n"
            + "\n".join(f"  {l['qty']} x {l['name']}  {_fmt_aud(l['price']*l['qty'])}" for l in lines)
            + f"\n\nTotal: {_fmt_aud(total)}\n"
            + (f"Receipt: {receipt_url}\n" if receipt_url else ""))
    return await _send(to, "Your Fossey's order is confirmed", _shell("Order confirmed", inner), text)
