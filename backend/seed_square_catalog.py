"""Seed the Square Catalog (categories + items + prices) from our static data.

Reusable + environment-driven: it targets whatever SQUARE_ENVIRONMENT /
SQUARE_ACCESS_TOKEN point to in backend/.env — so run it once for sandbox now,
and again for production later (after switching the env) to bootstrap a catalog.

Safe to re-run: it wipes the existing ITEM/CATEGORY/IMAGE objects first, then
upserts a clean set, so you never get duplicates.

    cd backend && python3 seed_square_catalog.py

Images are NOT uploaded here (product photos live in Square or fall back to the
site's local images by name-match). Add images in the Square dashboard, or via
the Catalog image API later.
"""
import os
import sys
import uuid

import httpx
from dotenv import load_dotenv

import content as C

load_dotenv()

TOKEN = os.environ.get("SQUARE_ACCESS_TOKEN")
ENV = os.environ.get("SQUARE_ENVIRONMENT", "sandbox")
CURRENCY = os.environ.get("SQUARE_CURRENCY", "AUD")
BASE = "https://connect.squareup.com" if ENV == "production" else "https://connect.squareupsandbox.com"
H = {"Authorization": f"Bearer {TOKEN}", "Square-Version": "2025-01-23", "Content-Type": "application/json"}


def slug(s):
    return "".join(c for c in s.lower() if c.isalnum())


def main():
    if not TOKEN:
        sys.exit("SQUARE_ACCESS_TOKEN not set in backend/.env")

    # Safety: this wipes the catalog before seeding. Never let that happen to a
    # live production catalog by accident — require an explicit --force.
    if ENV == "production" and "--force" not in sys.argv:
        sys.exit(
            "REFUSING to seed PRODUCTION (this deletes all existing catalog items).\n"
            "If the production catalog is empty and you really want to bootstrap it,\n"
            "re-run with:  python3 seed_square_catalog.py --force"
        )

    retail = [i for i in C.CATALOG if i["category"] == "retail"]
    if not retail:
        sys.exit("No retail items in content.CATALOG")

    # preserve section order for tidy categories
    sections = []
    for i in retail:
        if i["section"] not in sections:
            sections.append(i["section"])

    print(f"Target: {ENV}  ·  {len(retail)} items across {len(sections)} categories")

    with httpx.Client(timeout=40) as cl:
        # 1) wipe existing catalog objects (clean re-run)
        r = cl.get(f"{BASE}/v2/catalog/list?types=ITEM,CATEGORY,IMAGE", headers=H)
        r.raise_for_status()
        ids = [o["id"] for o in r.json().get("objects", [])]
        if ids:
            d = cl.post(f"{BASE}/v2/catalog/batch-delete", headers=H, json={"object_ids": ids})
            d.raise_for_status()
            print(f"Deleted {len(ids)} existing objects")

        # 2) build categories + items + priced variations
        objs = []
        cat_id = {}
        for s in sections:
            cid = f"#cat_{slug(s)}"
            cat_id[s] = cid
            objs.append({"type": "CATEGORY", "id": cid, "category_data": {"name": s}})

        for i in retail:
            iid = f"#item_{slug(i['id'])}"
            vid = f"#var_{slug(i['id'])}"
            objs.append({
                "type": "ITEM",
                "id": iid,
                "item_data": {
                    "name": i["name"],
                    "description": i["description"],
                    "categories": [{"id": cat_id[i["section"]]}],
                    "reporting_category": {"id": cat_id[i["section"]]},
                    "variations": [{
                        "type": "ITEM_VARIATION",
                        "id": vid,
                        "item_variation_data": {
                            "item_id": iid,
                            "name": i.get("size", "Bottle"),
                            "pricing_type": "FIXED_PRICING",
                            "price_money": {"amount": i["price"], "currency": CURRENCY},
                            "sku": i["id"],
                        },
                    }],
                },
            })

        # 3) upsert
        body = {"idempotency_key": str(uuid.uuid4()), "batches": [{"objects": objs}]}
        u = cl.post(f"{BASE}/v2/catalog/batch-upsert", headers=H, json=body)
        if u.status_code >= 400:
            sys.exit(f"batch-upsert failed {u.status_code}: {u.text[:600]}")
        created = u.json().get("objects", [])
        print(f"Upserted {len(created)} objects ✓")
        print(f"Done. {len([o for o in created if o.get('type') == 'ITEM'])} items now live in {ENV} Square Catalog.")


if __name__ == "__main__":
    main()
