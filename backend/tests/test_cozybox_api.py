"""Cozy Box backend API regression tests (Phase 1, mock mode)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback to frontend .env if env var missing in shell
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ── Health ──
def test_health(client):
    r = client.get(f"{API}/health", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "ok"
    assert data["mode"] == "mock"


# ── Catalog ──
def test_catalog_all(client):
    r = client.get(f"{API}/catalog", timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    cats = {i["category"] for i in items}
    assert {"food", "drink", "retail"}.issubset(cats)


def test_catalog_food(client):
    r = client.get(f"{API}/catalog", params={"category": "food"}, timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    assert items and all(i["category"] == "food" for i in items)


def test_catalog_drink(client):
    r = client.get(f"{API}/catalog", params={"category": "drink"}, timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    assert items and all(i["category"] == "drink" for i in items)
    assert any("Cocktail" in i["section"] or "Signature" in i["section"] for i in items)


def test_catalog_retail(client):
    r = client.get(f"{API}/catalog", params={"category": "retail"}, timeout=15)
    assert r.status_code == 200
    items = r.json()["items"]
    assert len(items) == 4
    assert all(i["category"] == "retail" for i in items)


# ── Events / Packages / Plans / Reviews / Location ──
def test_events(client):
    r = client.get(f"{API}/events", timeout=15)
    assert r.status_code == 200
    events = r.json()["events"]
    assert len(events) == 4


def test_packages(client):
    r = client.get(f"{API}/packages", timeout=15)
    assert r.status_code == 200
    pkgs = r.json()["packages"]
    assert len(pkgs) == 4


def test_passport_plans(client):
    r = client.get(f"{API}/passport/plans", timeout=15)
    assert r.status_code == 200
    plans = r.json()["plans"]
    assert len(plans) == 2


def test_reviews(client):
    r = client.get(f"{API}/reviews", timeout=15)
    assert r.status_code == 200
    assert len(r.json()["reviews"]) >= 1


def test_location(client):
    r = client.get(f"{API}/location", timeout=15)
    assert r.status_code == 200
    loc = r.json()
    assert "address" in loc and "phone" in loc
    assert "Lygon" in loc["address"]


# ── Bookings ──
def test_booking_availability(client):
    r = client.get(f"{API}/bookings/availability", params={"date": "2026-07-25"}, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data["date"] == "2026-07-25"
    assert isinstance(data["slots"], list) and len(data["slots"]) > 0


def test_booking_create(client):
    payload = {
        "name": "TEST_Booker",
        "email": "test_booker@example.com",
        "phone": "+61400000000",
        "date": "2026-07-25",
        "time": "19:00",
        "guests": 4,
    }
    r = client.post(f"{API}/bookings", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["ok"] is True
    assert data["status"] == "received"
    assert "id" in data


# ── Contact ──
def test_contact_ok(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_User",
        "email": "test_user@example.com",
        "message": "Hello from regression test"
    }, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["ok"] is True and "id" in data


def test_contact_invalid_email(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_User",
        "email": "not-an-email",
        "message": "Bad email"
    }, timeout=15)
    assert r.status_code == 422


# ── Enquiry ──
def test_package_enquiry(client):
    r = client.post(f"{API}/packages/enquiries", json={
        "name": "TEST_Enq",
        "email": "test_enq@example.com",
        "phone": "+61400111222"
    }, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json()["ok"] is True
