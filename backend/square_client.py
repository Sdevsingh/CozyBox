"""Thin async Square REST client for Cozy Box.

Covers the three flows we need for POS tracking:
  • Bookings   — availability search + create booking (Square Appointments)
  • Orders     — create an order (ad-hoc line items) for the liquor cart
  • Payments   — take a card payment (source_id from Web Payments SDK)

Reads config from env. If SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID are absent,
`enabled` is False and callers fall back to the local mock. No SDK dependency —
just httpx against the Square Connect v2 REST API, so it's version-proof.
"""
import asyncio
import os
import uuid
from datetime import datetime, timedelta

import httpx
from dotenv import load_dotenv

# Load .env before reading any Square vars (this module is imported before
# server.py calls load_dotenv, so we ensure it here too).
load_dotenv()

try:
    from zoneinfo import ZoneInfo
    TZ = ZoneInfo(os.environ.get("SQUARE_TIMEZONE", "Australia/Melbourne"))
except Exception:  # pragma: no cover
    from datetime import timezone as _tz
    TZ = _tz.utc

ACCESS_TOKEN = os.environ.get("SQUARE_ACCESS_TOKEN")
LOCATION_ID = os.environ.get("SQUARE_LOCATION_ID")
APPLICATION_ID = os.environ.get("SQUARE_APPLICATION_ID")
ENVIRONMENT = os.environ.get("SQUARE_ENVIRONMENT", "sandbox")
CURRENCY = os.environ.get("SQUARE_CURRENCY", "AUD")
SQUARE_VERSION = os.environ.get("SQUARE_VERSION", "2025-01-23")

# Which Square category NAMES count as shop/retail items for the Cellar.
# In production the catalog is the whole POS menu, so we NEVER show everything —
# only items in these categories. Leave blank in sandbox (seeded catalog is all retail).
RETAIL_CATEGORIES = {c.strip() for c in os.environ.get("SQUARE_RETAIL_CATEGORIES", "").split(",") if c.strip()}

# Bookings need a bookable Service Variation + a Team Member (from Square Appointments).
SERVICE_VARIATION_ID = os.environ.get("SQUARE_SERVICE_VARIATION_ID")
SERVICE_VARIATION_VERSION = os.environ.get("SQUARE_SERVICE_VARIATION_VERSION")
TEAM_MEMBER_ID = os.environ.get("SQUARE_TEAM_MEMBER_ID")

BASE = (
    "https://connect.squareup.com"
    if ENVIRONMENT == "production"
    else "https://connect.squareupsandbox.com"
)

# Feature flags derived from what config is present
enabled = bool(ACCESS_TOKEN and LOCATION_ID)
bookings_enabled = bool(enabled and SERVICE_VARIATION_ID and TEAM_MEMBER_ID)


class SquareError(Exception):
    def __init__(self, status, payload):
        self.status = status
        self.payload = payload
        detail = payload.get("errors", [{}])[0].get("detail") if isinstance(payload, dict) else str(payload)
        super().__init__(detail or f"Square error {status}")


def _headers():
    return {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Square-Version": SQUARE_VERSION,
        "Content-Type": "application/json",
    }


async def _request(method, path, body=None, _retries=3):
    """Call Square. Retries on 429 (rate limited) and 5xx with backoff."""
    async with httpx.AsyncClient(timeout=25) as client:
        for attempt in range(_retries + 1):
            r = await client.request(method, f"{BASE}{path}", headers=_headers(), json=body)
            if r.status_code in (429, 500, 502, 503) and attempt < _retries:
                # honour Retry-After if present, else exponential backoff
                delay = float(r.headers.get("Retry-After", 0)) or (0.5 * 2 ** attempt)
                await asyncio.sleep(delay)
                continue
            try:
                data = r.json()
            except Exception:
                data = {"raw": r.text}
            if r.status_code >= 400:
                raise SquareError(r.status_code, data)
            return data


def public_config():
    """Non-secret config the frontend needs for the Web Payments SDK."""
    return {
        "enabled": enabled,
        "bookingsEnabled": bookings_enabled,
        "applicationId": APPLICATION_ID,
        "locationId": LOCATION_ID,
        "environment": ENVIRONMENT,
        "currency": CURRENCY,
    }


# ── Catalog ────────────────────────────────────────────────
async def list_catalog():
    """Return retail spirits from Square Catalog, mapped to the site shape:
    {id, name, description, price(cents), section(category), category, image}.
    Prices come from the first variation; images from the first image_id.
    """
    data = await _request("GET", "/v2/catalog/list?types=ITEM,IMAGE,CATEGORY")
    objects = data.get("objects", []) or []
    images = {o["id"]: o.get("image_data", {}).get("url") for o in objects if o.get("type") == "IMAGE"}
    categories = {o["id"]: o.get("category_data", {}).get("name") for o in objects if o.get("type") == "CATEGORY"}

    items = []
    for o in objects:
        if o.get("type") != "ITEM":
            continue
        d = o.get("item_data", {})
        # price from first priced variation
        price = 0
        for v in d.get("variations", []):
            pm = v.get("item_variation_data", {}).get("price_money")
            if pm and pm.get("amount"):
                price = pm["amount"]
                break
        # category (handle old + new schema)
        cat_id = None
        if d.get("categories"):
            cat_id = d["categories"][0].get("id")
        elif d.get("category_id"):
            cat_id = d["category_id"]
        elif d.get("reporting_category"):
            cat_id = d["reporting_category"].get("id")
        # image
        image = None
        for iid in d.get("image_ids", []):
            if images.get(iid):
                image = images[iid]
                break
        items.append({
            "id": o["id"],
            "name": d.get("name", ""),
            "description": d.get("description", ""),
            "price": price,
            "section": categories.get(cat_id) or "Spirits",
            "category": "retail",
            "image": image,
        })

    # Only surface designated retail categories. If none are configured, never
    # dump a full production menu into the shop — return nothing so the caller
    # falls back to the curated static list.
    if RETAIL_CATEGORIES:
        items = [i for i in items if i["section"] in RETAIL_CATEGORIES]
    elif ENVIRONMENT == "production":
        items = []
    return items


# ── Bookings ───────────────────────────────────────────────
async def search_availability(start_at_utc_iso, end_at_utc_iso):
    body = {
        "query": {
            "filter": {
                "start_at_range": {"start_at": start_at_utc_iso, "end_at": end_at_utc_iso},
                "location_id": LOCATION_ID,
                "segment_filters": [
                    {
                        "service_variation_id": SERVICE_VARIATION_ID,
                        "team_member_id_filter": {"any": [TEAM_MEMBER_ID]},
                    }
                ],
            }
        }
    }
    data = await _request("POST", "/v2/bookings/availability/search", body)
    return data.get("availabilities", [])


async def _upsert_customer(name, email, phone):
    given, *rest = (name or "Guest").split(" ", 1)
    family = rest[0] if rest else ""
    # We deliberately DON'T store the guest's email on the Square customer, so
    # Square never emails them — our branded Resend email is the only guest-facing
    # confirmation. The email is still kept in the booking note (below) for staff
    # and in our own database.
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "given_name": given,
        "family_name": family,
        "phone_number": phone,
    }
    data = await _request("POST", "/v2/customers", body)
    return data.get("customer", {}).get("id")


async def create_booking(*, start_at, name, email, phone, guests, notes):
    customer_id = await _upsert_customer(name, email, phone)
    segment = {
        "team_member_id": TEAM_MEMBER_ID,
        "service_variation_id": SERVICE_VARIATION_ID,
    }
    if SERVICE_VARIATION_VERSION:
        segment["service_variation_version"] = int(SERVICE_VARIATION_VERSION)
    note = f"Party of {guests}. Booked online · guest email: {email}." + (f" Notes: {notes}" if notes else "")
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "booking": {
            "location_id": LOCATION_ID,
            "start_at": start_at,
            "customer_id": customer_id,
            "customer_note": note,
            "appointment_segments": [segment],
        },
    }
    data = await _request("POST", "/v2/bookings", body)
    return data.get("booking", {})


# ── Orders + Payments ──────────────────────────────────────
async def create_order(line_items, shipping=None):
    """line_items: [{name, price(cents), qty}].

    When `shipping` is given (a dict with line1/suburb/state/postcode plus
    recipient name/email/phone), attach a SHIPMENT fulfillment so the delivery
    address is recorded on the Square order and visible in the POS/Dashboard.
    """
    order = {
        "location_id": LOCATION_ID,
        "line_items": [
            {
                "name": li["name"],
                "quantity": str(li["qty"]),
                "base_price_money": {"amount": int(li["price"]), "currency": CURRENCY},
            }
            for li in line_items
        ],
    }

    if shipping:
        recipient = {
            "display_name": shipping.get("name") or "Guest",
            "address": {
                "address_line_1": shipping.get("line1", ""),
                "address_line_2": shipping.get("line2") or "",
                "locality": shipping.get("suburb", ""),
                "administrative_district_level_1": shipping.get("state", ""),
                "postal_code": shipping.get("postcode", ""),
                "country": shipping.get("country", "AU"),
            },
        }
        if shipping.get("email"):
            recipient["email_address"] = shipping["email"]
        if shipping.get("phone"):
            recipient["phone_number"] = shipping["phone"]
        order["fulfillments"] = [{
            "type": "SHIPMENT",
            "state": "PROPOSED",
            "shipment_details": {"recipient": recipient},
        }]

    data = await _request("POST", "/v2/orders", {"idempotency_key": str(uuid.uuid4()), "order": order})
    return data.get("order", {})


async def create_payment(*, source_id, amount, order_id, buyer_email=None):
    body = {
        "idempotency_key": str(uuid.uuid4()),
        "source_id": source_id,
        "amount_money": {"amount": int(amount), "currency": CURRENCY},
        "location_id": LOCATION_ID,
        "order_id": order_id,
        "autocomplete": True,
    }
    if buyer_email:
        body["buyer_email_address"] = buyer_email
    data = await _request("POST", "/v2/payments", body)
    return data.get("payment", {})


# ── helpers for time handling ──────────────────────────────
def local_day_range_utc(date_str):
    """Return (start_utc_iso, end_utc_iso) covering the given local day,
    clamped so start is never in the past (Square rejects past ranges)."""
    start_local = datetime.fromisoformat(date_str + "T00:00:00").replace(tzinfo=TZ)
    end_local = start_local + timedelta(days=1)
    now_local = datetime.now(TZ)
    if start_local < now_local:
        start_local = now_local + timedelta(minutes=5)
    to_utc = lambda d: d.astimezone(ZoneInfo("UTC")).isoformat().replace("+00:00", "Z")
    return to_utc(start_local), to_utc(end_local)


def to_local_hhmm(iso_str):
    """RFC3339/ISO → local 'HH:MM' for display."""
    d = datetime.fromisoformat(iso_str.replace("Z", "+00:00"))
    return d.astimezone(TZ).strftime("%H:%M")
