# AGENTS.md

CozyBox is an npm-workspaces monorepo for the cozybox.au website:

- `server/` — Express + TypeScript API proxying Square (catalog, orders, payments, bookings, customers, locations, loyalty, subscriptions).
- `web/` — React + Vite + TypeScript site (Home, Online Shop, Table Booking, Plate Pass).

Standard commands and configuration live in `README.md` and the workspace `package.json` files — prefer those over duplicating here.

## Cursor Cloud specific instructions

- **Run everything from the repo root.** `npm run dev` starts both the API (`:4000`) and the web app (`:5173`) via `concurrently`. Run single workspaces with `npm run dev -w server` / `-w web`.
- **No credentials needed for dev.** With `SQUARE_ACCESS_TOKEN` empty, the server runs in **mock mode** and serves seeded data from memory, so the full app (shop checkout, bookings, Plate Pass) works end-to-end without Square. Confirm mode via `GET /api/health` (`"mode":"mock"`). To exercise the real Square integration, set `SQUARE_ACCESS_TOKEN` + `SQUARE_LOCATION_ID` (and `VITE_SQUARE_*`) in the root `.env`.
- **Single root `.env` configures both workspaces.** The server resolves and loads the repo-root `.env` regardless of the workspace cwd, and Vite reads `VITE_*` from it via `envDir: ".."`. Don't add a separate `web/.env` unless you intend to override.
- **Mock data is in-memory and per-process.** Orders/bookings/customers/loyalty reset on every server restart (including `tsx watch` reloads). This is expected; don't treat lost demo state as a bug.
- **Lint note:** core ESLint `no-undef` is disabled in `web/` because TypeScript handles undefined-reference checking and is aware of DOM/React types ESLint is not. A single `react-refresh/only-export-components` warning on `web/src/store/cart.tsx` (it exports both `CartProvider` and the `useCart` hook) is expected and non-blocking.
