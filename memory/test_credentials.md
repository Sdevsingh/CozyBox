# Cozy Box — Test Notes

No authentication in Phase 1 (no login/accounts). Public marketing + content site.

## App entry
- Age gate appears on first load. Click `[data-testid="age-gate-yes"]` to enter (stored in sessionStorage as `cozybox_age_ok`).

## Backend
- FastAPI at /api (mock content mode; Square integration is Phase 2).
- Mongo collections written by forms: `contact_messages`, `bookings`, `package_enquiries`.

## Key API endpoints
- GET /api/health, /api/catalog?category=food|drink|retail, /api/events, /api/packages, /api/passport/plans, /api/reviews, /api/location
- GET /api/bookings/availability?date=YYYY-MM-DD
- POST /api/contact, /api/bookings, /api/packages/enquiries
