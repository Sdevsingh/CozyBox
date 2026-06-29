# CozyBox

The new **cozybox.au** — a React website for *Cozy Box by Fossey's Distillery* (Indian tapas & distillery, Carlton, Melbourne), unifying three customer experiences on top of Square:

```
                         cozybox.au (React)
                                │
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
  Online Shop             Table Booking             Plate Pass
  Catalog · Orders        Bookings · Customers      Loyalty · Customers
  · Payments              · Locations               · Subscriptions
        └───────────────────────┴───────────────────────┘
                                │
                        Square Dashboard  ←→  Square POS (in venue)
                          (one source of truth, real time)
```

## Architecture

This is an npm-workspaces monorepo:

| Workspace | Stack | Purpose |
| --- | --- | --- |
| `server` | Node + Express + TypeScript | API that proxies the Square APIs (catalog, orders, payments, bookings, customers, locations, loyalty, subscriptions). Square access tokens stay server-side. |
| `web` | React + Vite + TypeScript | The customer-facing site: Home, Online Shop, Table Booking, Plate Pass. |

### Mock mode vs. Square mode

The server runs in **mock mode** whenever `SQUARE_ACCESS_TOKEN` is empty. In mock mode it serves seeded CozyBox catalog/booking/loyalty data from memory, so the entire product runs end-to-end with **no external credentials** — ideal for local development and demos.

Set `SQUARE_ACCESS_TOKEN` (+ `SQUARE_LOCATION_ID`) in `.env` to switch the same endpoints to live **Square** (sandbox or production). Get sandbox credentials at https://developer.squareup.com/apps.

## Getting started

```bash
npm install            # install all workspaces
cp .env.example .env   # optional: defaults already run in mock mode
npm run dev            # starts API (:4000) + web (:5173) together
```

Then open http://localhost:5173.

### Scripts (run from the repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Run server + web dev servers concurrently |
| `npm run build` | Type-check & build both workspaces |
| `npm run lint` | Lint both workspaces |
| `npm run dev -w server` / `-w web` | Run a single workspace |

## API overview

All endpoints are under `/api`:

- `GET /api/health` — mode (`mock`/`square`) + status
- `GET /api/catalog?category=food|retail` — menu & distillery products
- `GET /api/locations`
- `POST /api/customers` · `GET /api/customers/:id`
- `POST /api/orders` · `GET /api/orders/:id`
- `POST /api/payments`
- `GET /api/bookings/availability?date=YYYY-MM-DD` · `POST /api/bookings`
- `GET /api/loyalty/program` · `POST /api/loyalty/accounts` · `POST /api/loyalty/accrue`
- `GET /api/subscriptions/plans` · `POST /api/subscriptions`

## Configuration

See `.env.example`. A single root `.env` configures both workspaces (the server loads it directly; Vite reads `VITE_*` from it via `envDir`).
