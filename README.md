# CozyBox

The new **cozybox.au** — a React website for *Cozy Box by Fossey's Distillery*, an electric **cocktail bar & lounge** in Carlton, Melbourne. It unifies the customer experiences on top of Square:

```
                         cozybox.au (React)
                                │
   Home · Our Story · Menu · What's On · Private & Functions · Online Shop
                  (+ Cocktail Passport · Book · Contact)
                                │
        ┌───────────────────────┼───────────────────────┐
        ↓                       ↓                       ↓
  Online Shop             Table Booking          Cocktail Passport
  Catalog · Orders        Bookings · Customers   Loyalty · Customers
  · Payments              · Locations            · Subscriptions
        └───────────────────────┴───────────────────────┘
                                │
                        Square Dashboard  ←→  Square POS (in venue)
                          (one source of truth, real time)
```

> The site was redesigned from an Indian-tapas concept to a club/bar nightlife
> vibe. Hero/section imagery in `web/public/img/` was AI-generated, and the
> Fossey's distillery catalogue PDF is bundled in `web/public/brochures/`.

## Architecture

This is an npm-workspaces monorepo:

| Workspace | Stack | Purpose |
| --- | --- | --- |
| `server` | Node + Express + TypeScript | API that proxies the Square APIs (catalog, orders, payments, bookings, customers, locations, loyalty, subscriptions). Square access tokens stay server-side. |
| `web` | React + Vite + TypeScript | The customer-facing site: Home, Our Story, Menu, What's On, Private & Functions, Online Shop, Cocktail Passport, Book, Contact. |

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
- `GET /api/events` · `GET /api/events/:id` — What's On programme
- `GET /api/packages` · `POST /api/packages/enquiries` — Private & Functions

## Configuration

See `.env.example`. A single root `.env` configures both workspaces (the server loads it directly; Vite reads `VITE_*` from it via `envDir`).
