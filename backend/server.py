import os
import uuid
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

import content as C

load_dotenv()

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Cozy Box API")
api = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


# ── Content (Phase 1: static; Square swaps these in Phase 2) ──
@api.get("/health")
async def health():
    return {"status": "ok", "mode": "mock", "service": "cozybox"}


@api.get("/location")
async def get_location():
    return C.LOCATION


@api.get("/catalog")
async def get_catalog(category: str | None = None):
    items = C.CATALOG
    if category:
        items = [i for i in items if i["category"] == category]
    return {"items": items}


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
    name: str
    email: EmailStr
    message: str
    phone: str | None = None


class BookingIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    date: str
    time: str
    guests: int = Field(ge=1, le=40)
    notes: str | None = None


class EnquiryIn(BaseModel):
    name: str
    email: EmailStr
    phone: str
    packageId: str | None = None
    date: str | None = None
    guests: int | None = None
    message: str | None = None


async def _save(collection: str, payload: dict):
    doc = {"id": str(uuid.uuid4()), "createdAt": now_iso(), **payload}
    await db[collection].insert_one(dict(doc))
    doc.pop("_id", None)
    return doc


@api.post("/contact")
async def contact(body: ContactIn):
    doc = await _save("contact_messages", body.model_dump())
    return {"ok": True, "id": doc["id"]}


@api.post("/bookings")
async def create_booking(body: BookingIn):
    doc = await _save("bookings", body.model_dump())
    return {"ok": True, "id": doc["id"], "status": "received",
            "message": "Booking request received. We'll confirm by email shortly."}


@api.get("/bookings/availability")
async def availability(date: str):
    slots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
             "20:00", "20:30", "21:00", "21:30"]
    return {"date": date, "slots": slots}


@api.post("/packages/enquiries")
async def enquiry(body: EnquiryIn):
    doc = await _save("package_enquiries", body.model_dump())
    return {"ok": True, "id": doc["id"],
            "message": "Enquiry received. Our events team will be in touch."}


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
