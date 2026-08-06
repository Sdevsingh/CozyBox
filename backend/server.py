import os
import time
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import re
from pydantic import BaseModel, EmailStr, Field, field_validator

_AU_PHONE = re.compile(r"^(?:\+?61|0)[2-478]\d{8}$")
_AU_STATES = {"VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"}


def _clean_au_phone(v: str) -> str:
    s = re.sub(r"[\s()\-.]", "", v or "")
    if not _AU_PHONE.match(s):
        raise ValueError("Enter a valid Australian phone number")
    return s

import content as C
import square_client as sq
import mailer

load_dotenv()

# ── Persistence (optional) ─────────────────────────────────
# Mongo is optional in dev. If MONGO_URL is not set we fall back to an
# in-memory store so the API runs standalone. Square (Phase 2) replaces
# this for orders/bookings; submissions can also be forwarded to Square.
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "cozybox")

db = None
if MONGO_URL:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]

# In-memory fallback collections (used only when db is None)
_mem = {}

app = FastAPI(title="Cozy Box API")
api = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ── Content (static; Square swaps catalog later) ──
BUILD = "2026-07-31-noemail"  # bump on each deploy to verify what's live


@api.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "cozybox",
        "build": BUILD,
        "square": "live" if sq.enabled else "mock",
        "bookings": "square" if sq.bookings_enabled else "mock",
    }


@api.get("/config")
async def config():
    """Public config for the frontend (Web Payments SDK ids, feature flags)."""
    return sq.public_config()


@api.get("/location")
async def get_location():
    return C.LOCATION


_catalog_cache = {"at": 0.0, "items": None}


async def _square_retail():
    """Square retail catalog, cached 5 min to keep it fast + low on API calls."""
    now = time.time()
    if _catalog_cache["items"] is not None and now - _catalog_cache["at"] < 300:
        return _catalog_cache["items"]
    items = await sq.list_catalog()
    _catalog_cache["items"] = items
    _catalog_cache["at"] = now
    return items


@api.get("/catalog")
async def get_catalog(category: str | None = None):
    # Retail spirits come from Square Catalog when configured (cached),
    # falling back to static content if Square is empty or unreachable.
    if category == "retail" and sq.enabled:
        try:
            items = await _square_retail()
            if items:
                return {"items": items, "source": "square"}
        except sq.SquareError:
            pass
    items = C.CATALOG
    if category:
        items = [i for i in items if i["category"] == category]
    return {"items": items, "source": "static"}


@api.get("/events")
async def get_events():
    return {"events": C.EVENTS}


@api.get("/events/{event_id}")
async def get_event(event_id: str):
    for e in C.EVENTS:
        if e["id"] == event_id:
            return e
    raise HTTPException(404, "Event not found")


@api.get("/packages")
async def get_packages():
    return {"packages": C.PACKAGES}


@api.get("/passport/plans")
async def get_plans():
    return {"plans": C.PASSPORT_PLANS}


@api.get("/reviews")
async def get_reviews():
    return {"reviews": C.REVIEWS}


# ── Submissions (stored in Mongo) ──
class ContactIn(BaseModel):
    name: str = Field(max_length=120)
    email: EmailStr
    message: str = Field(max_length=4000)
    phone: str | None = Field(default=None, max_length=24)


class BookingIn(BaseModel):
    name: str = Field(max_length=120)
    email: EmailStr
    phone: str = Field(max_length=24)
    date: str = Field(max_length=10)
    time: str = Field(max_length=8)
    startAt: str | None = Field(default=None, max_length=40)  # RFC3339 slot start
    guests: int = Field(ge=1, le=40)
    notes: str | None = Field(default=None, max_length=1000)

    @field_validator("name")
    @classmethod
    def _name(cls, v):
        if len((v or "").strip()) < 2:
            raise ValueError("Please enter your full name")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def _phone(cls, v):
        return _clean_au_phone(v)


class OrderLine(BaseModel):
    id: str = Field(max_length=80)
    name: str = Field(max_length=200)
    price: int  # cents — informational only; server re-prices from the catalog
    qty: int = Field(ge=1, le=99)


class ShippingIn(BaseModel):
    name: str | None = Field(default=None, max_length=120)
    phone: str | None = Field(default=None, max_length=24)
    line1: str = Field(max_length=200)
    line2: str | None = Field(default=None, max_length=200)
    suburb: str = Field(max_length=100)
    state: str = Field(max_length=10)
    postcode: str = Field(max_length=4)
    country: str = "AU"

    @field_validator("postcode")
    @classmethod
    def _postcode(cls, v):
        if not re.fullmatch(r"\d{4}", (v or "").strip()):
            raise ValueError("Enter a valid 4-digit Australian postcode")
        return v.strip()

    @field_validator("state")
    @classmethod
    def _state(cls, v):
        s = (v or "").strip().upper()
        if s not in _AU_STATES:
            raise ValueError("Enter a valid Australian state")
        return s

    @field_validator("phone")
    @classmethod
    def _ship_phone(cls, v):
        return _clean_au_phone(v) if v else v


class OrderIn(BaseModel):
    sourceId: str | None = None  # card token from Square Web Payments SDK
    lines: list[OrderLine]
    name: str | None = None
    email: EmailStr | None = None
    shipping: ShippingIn | None = None  # delivery address for shipped bottles


class EnquiryIn(BaseModel):
    name: str = Field(max_length=120)
    email: EmailStr
    phone: str = Field(max_length=24)
    packageId: str | None = Field(default=None, max_length=80)
    date: str | None = Field(default=None, max_length=10)
    guests: int | None = Field(default=None, ge=1, le=500)
    message: str | None = Field(default=None, max_length=4000)


async def _save(collection: str, payload: dict):
    doc = {"id": str(uuid.uuid4()), "createdAt": now_iso(), **payload}
    if db is not None:
        await db[collection].insert_one(dict(doc))
        doc.pop("_id", None)
    else:
        _mem.setdefault(collection, []).append(doc)
    return doc


async def _update(collection: str, doc_id: str, fields: dict):
    """Patch a stored doc by id (Mongo or in-memory)."""
    if db is not None:
        await db[collection].update_one({"id": doc_id}, {"$set": fields})
    else:
        for d in _mem.get(collection, []):
            if d.get("id") == doc_id:
                d.update(fields)
                break


async def _confirm_and_remind(doc: dict, source: str):
    """Send the booking confirmation + schedule the reminder, and persist
    the reminder outcome onto the stored booking so the sweep can find it."""
    await mailer.send_booking_confirmation(
        to=doc["email"], name=doc["name"], date=doc["date"], time=doc["time"],
        guests=doc["guests"], notes=doc.get("notes"), booking_id=doc["id"],
        source=source, start_at=doc.get("startAt"),
    )
    reminder = await mailer.schedule_booking_reminder(
        to=doc["email"], name=doc["name"], date=doc["date"], time=doc["time"],
        guests=doc["guests"], booking_id=doc["id"], start_at=doc.get("startAt"),
    )
    await _update("bookings", doc["id"], {"reminder": reminder})
    return reminder


@api.post("/contact")
async def contact(body: ContactIn):
    doc = await _save("contact_messages", body.model_dump())
    return {"ok": True, "id": doc["id"]}


@api.post("/bookings")
async def create_booking(body: BookingIn):
    # Real Square Appointments booking when configured
    if sq.bookings_enabled and body.startAt:
        try:
            booking = await sq.create_booking(
                start_at=body.startAt, name=body.name, email=body.email,
                phone=body.phone, guests=body.guests, notes=body.notes,
            )
            doc = await _save("bookings", {**body.model_dump(), "squareBookingId": booking.get("id")})
            reminder = await _confirm_and_remind(doc, source="square")
            return {"ok": True, "id": booking.get("id"), "status": booking.get("status", "PENDING"),
                    "source": "square", "reminder": reminder,
                    "message": "Booking confirmed with Square. See you at the Cozy Box!"}
        except sq.SquareError as e:
            raise HTTPException(502, f"Square booking failed: {e}")

    # Fallback: store locally
    doc = await _save("bookings", body.model_dump())
    reminder = await _confirm_and_remind(doc, source="mock")
    return {"ok": True, "id": doc["id"], "status": "received", "source": "mock",
            "reminder": reminder,
            "message": "Booking request received. We'll confirm by email shortly."}


# Authoritative retail prices (cents), keyed by id and lowercased name. Orders
# are ALWAYS re-priced from this — a tampered client price can never be charged.
# RETAIL_PRICES (the full spirit catalog) is authoritative; fall back to any
# other priced content items by name for safety.
_PRICE_BY_ID = {**{i["id"]: i["price"] for i in C.CATALOG if i.get("price")}, **C.RETAIL_PRICES}
_PRICE_BY_NAME = {i["name"].strip().lower(): i["price"] for i in C.CATALOG if i.get("price")}


async def _trusted_price(line: OrderLine):
    """Trusted unit price (cents) for a cart line: live Square catalog first,
    then the static catalog. None when the item is unknown/unpurchasable."""
    if sq.enabled:
        try:
            for it in await _square_retail():
                same = it.get("id") == line.id or it.get("name", "").strip().lower() == line.name.strip().lower()
                if same and it.get("price"):
                    return int(it["price"])
        except sq.SquareError:
            pass
    return _PRICE_BY_ID.get(line.id) or _PRICE_BY_NAME.get(line.name.strip().lower())


@api.post("/orders")
async def create_order(body: OrderIn):
    """Create a Square Order for the liquor cart and take card payment."""
    if not body.lines:
        raise HTTPException(400, "Your cart is empty.")
    # Re-price every line server-side — never trust the price sent by the client.
    lines = []
    for l in body.lines:
        price = await _trusted_price(l)
        if not price:
            raise HTTPException(400, f"Item unavailable for online purchase: {l.name}")
        lines.append({"id": l.id, "name": l.name, "price": int(price), "qty": l.qty})
    total = sum(x["price"] * x["qty"] for x in lines)
    shipping = body.shipping.model_dump() if body.shipping else None
    if shipping:
        shipping["email"] = body.email  # recipient email for the shipment record

    if sq.enabled:
        if not body.sourceId:
            raise HTTPException(400, "Missing card token (sourceId).")
        try:
            order = await sq.create_order(lines, shipping=shipping)
            payment = await sq.create_payment(
                source_id=body.sourceId, amount=total,
                order_id=order.get("id"), buyer_email=body.email,
            )
            await _save("orders", {
                "orderId": order.get("id"), "paymentId": payment.get("id"),
                "total": total, "lines": lines, "email": body.email, "name": body.name,
                "shipping": shipping,
            })
            await mailer.send_order_confirmation(
                to=body.email, name=body.name, lines=lines, total=total,
                order_id=order.get("id"), receipt_url=payment.get("receipt_url"), shipping=shipping,
            )
            return {"ok": True, "source": "square", "orderId": order.get("id"),
                    "paymentId": payment.get("id"), "status": payment.get("status"),
                    "receiptUrl": payment.get("receipt_url"), "total": total,
                    "message": "Payment received — your Fossey's order is on its way."}
        except sq.SquareError as e:
            raise HTTPException(502, f"Square order failed: {e}")

    # Fallback: record the order without taking payment
    doc = await _save("orders", {"total": total, "lines": lines, "email": body.email,
                                 "name": body.name, "shipping": shipping})
    await mailer.send_order_confirmation(
        to=body.email, name=body.name, lines=lines, total=total,
        order_id=doc["id"], receipt_url=None, shipping=shipping,
    )
    return {"ok": True, "source": "mock", "orderId": doc["id"], "total": total,
            "message": "Order recorded. Connect Square to take live card payments."}


# Opening hours by weekday (Mon=0 … Sun=6): (open_hour, last_seating_hour)
# None = closed. Mirrors LOCATION hours: Wed–Sun, closed Mon/Tue.
_HOURS = {
    0: None,          # Mon closed
    1: None,          # Tue closed
    2: (16.5, 21.5),  # Wed 4:30pm–10pm (last seating 9:30pm)
    3: (16.5, 23.5),  # Thu 4:30pm–1am (last seating 11:30pm)
    4: (11, 23.5),    # Fri 11am–1am
    5: (11, 23.5),    # Sat 11am–1am
    6: (11, 21.5),    # Sun 11am–10pm
}


def _fmt_slot(h: float) -> str:
    hour = int(h)
    minute = "30" if h % 1 == 0.5 else "00"
    return f"{hour:02d}:{minute}"


@api.get("/bookings/availability")
async def availability(date: str):
    """Bookable time slots for a date, as [{time, startAt}].

    Uses Square Bookings `search_availability` when Appointments is configured,
    otherwise derives slots from venue opening hours (closed Mon/Tue).
    """
    try:
        day_start = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(400, "date must be YYYY-MM-DD")

    # Live Square availability
    if sq.bookings_enabled:
        try:
            start_iso, end_iso = sq.local_day_range_utc(date)
            avails = await sq.search_availability(start_iso, end_iso)
            slots = [{"time": sq.to_local_hhmm(a["start_at"]), "startAt": a["start_at"]}
                     for a in avails if a.get("start_at")]
            return {"date": date, "open": len(slots) > 0, "source": "square", "slots": slots}
        except sq.SquareError as e:
            raise HTTPException(502, f"Square availability failed: {e}")

    # Fallback: venue hours
    window = _HOURS.get(day_start.weekday())
    if not window:
        return {"date": date, "open": False, "source": "mock", "slots": []}
    open_h, last_h = window
    slots = []
    h = open_h
    while h <= last_h:
        hhmm = _fmt_slot(h)
        slots.append({"time": hhmm, "startAt": f"{date}T{hhmm}:00"})
        h += 0.5
    return {"date": date, "open": True, "source": "mock", "slots": slots}


async def _list_bookings():
    if db is not None:
        return [dict(d, _id=None) async for d in db["bookings"].find({})]
    return list(_mem.get("bookings", []))


@api.post("/tasks/schedule-reminders")
async def schedule_reminders(key: str | None = None):
    """Daily sweep: schedule reminders for bookings that have now entered the
    Resend scheduling window (or were never scheduled). Idempotent — a booking
    whose reminder is already scheduled is skipped. Drive this once a day from
    Railway Cron / cron-job.org with ?key=TASKS_SECRET.
    """
    secret = os.environ.get("TASKS_SECRET")
    if secret and key != secret:
        raise HTTPException(403, "bad or missing key")

    scheduled, skipped = 0, 0
    for b in await _list_bookings():
        r = b.get("reminder") or {}
        # Skip anything already scheduled or permanently past.
        if r.get("scheduled") or r.get("reason") in ("too-soon", "no-start-time"):
            skipped += 1
            continue
        result = await mailer.schedule_booking_reminder(
            to=b.get("email"), name=b.get("name"), date=b.get("date"),
            time=b.get("time"), guests=b.get("guests"), booking_id=b.get("id"),
            start_at=b.get("startAt"),
        )
        await _update("bookings", b["id"], {"reminder": result})
        if result.get("scheduled"):
            scheduled += 1
        else:
            skipped += 1
    return {"ok": True, "scheduled": scheduled, "skipped": skipped}


@api.post("/packages/enquiries")
async def enquiry(body: EnquiryIn):
    doc = await _save("package_enquiries", body.model_dump())
    return {"ok": True, "id": doc["id"],
            "message": "Enquiry received. Our events team will be in touch."}


app.include_router(api)

# In production set ALLOWED_ORIGINS to a comma-separated list, e.g.
# "https://cozybox.au,https://www.cozybox.au". Defaults to "*" for local dev.
_origins_env = os.environ.get("ALLOWED_ORIGINS", "*").strip()
_allowed_origins = ["*"] if _origins_env in ("", "*") else [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Basic abuse protection + security headers ──────────────
# Per-IP sliding-window rate limits on the public write endpoints, a request
# body cap, and hardening headers on every response. Keeps a spammer from
# email-bombing bookings or hammering the payment endpoint.
import time as _time
from collections import defaultdict
from fastapi import Request
from fastapi.responses import JSONResponse

_RL_WINDOW = 60.0
_RL_MAX = {"/api/bookings": 6, "/api/contact": 5, "/api/orders": 12, "/api/packages/enquiries": 5}
_RL_HITS: dict = defaultdict(list)
_MAX_BODY = 64 * 1024  # 64 KB is plenty for our JSON payloads


@app.middleware("http")
async def _guard(request: Request, call_next):
    path = request.url.path
    if request.method == "POST" and path in _RL_MAX:
        cl = request.headers.get("content-length")
        if cl and cl.isdigit() and int(cl) > _MAX_BODY:
            return JSONResponse({"detail": "Payload too large."}, status_code=413)
        fwd = request.headers.get("x-forwarded-for", "")
        ip = fwd.split(",")[0].strip() or (request.client.host if request.client else "unknown")
        now = _time.time()
        key = (ip, path)
        hits = [t for t in _RL_HITS[key] if now - t < _RL_WINDOW]
        if len(hits) >= _RL_MAX[path]:
            return JSONResponse({"detail": "Too many requests — please slow down and try again shortly."}, status_code=429)
        hits.append(now)
        _RL_HITS[key] = hits
    resp = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    resp.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    resp.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return resp
