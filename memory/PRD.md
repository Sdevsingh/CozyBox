# Cozy Box — Website Revamp PRD

## Problem statement
Revamp cozybox.au (WordPress) for "Cozy Box by Fossey's Distillery" — an Indian-tapas
cocktail bar & craft distillery, 209 Lygon St, Carlton VIC. Transform into a dark
"bar/club vibes" experience with demo-style motion (Lenis smooth scroll, staggered
reveals, parallax, spotlight cursor, glow buttons). Keep original logo + real business
info. Backend to move to Square (shop/bookings/loyalty/subscriptions) in a later phase.

## Personas
- Diners/drinkers booking a table or browsing the menu.
- Customers buying Fossey's spirits online (The Cellar).
- Event/function organisers (private hire), members (Cocktail Passport).

## Architecture (current)
- Frontend: React (CRA) :3000 — Tailwind, Framer Motion, Lenis, lucide-react.
- Backend: FastAPI :8001 (/api), mock content mode; Mongo for form submissions.
- DB: MongoDB (collections: contact_messages, bookings, package_enquiries).
- Standard Emergent stack (supervisor-managed). Square = Phase 2.

## Information architecture (6 sections + utility)
Home · Our Story · Menu (Food/Cocktails) · What's On · Private & Events · The Cellar
(Fossey's shop) · + Cocktail Passport, Reserve/Book a Table, Contact.

## Implemented (2026-06-29) — Phase 1 COMPLETE
- Dark gold/amber-neon theme; original logo reused; film grain, spotlight cursor,
  glow buttons, Lenis smooth scroll, parallax heroes, whileInView reveals, age gate.
- Pages: Home (cinematic hero + bento + spirits + passport teaser + reviews marquee),
  Our Story, Menu (food/cocktails tabs), What's On (events), Private & Events
  (packages + enquiry form), The Cellar (products + cart drawer + Phase-2 checkout
  notice), Cocktail Passport (plans + stamp tiers), Reserve (booking flow), Contact
  (form + map).
- Backend content + working Contact / Booking / Enquiry forms (stored in Mongo).
- Tested: backend 15/15 pytest pass; frontend 100% (testing agent iteration_1). No bugs.

## Backlog / Next
- P0 (Phase 2): Square integration — Catalog/Orders/Payments (shop checkout),
  Bookings API (reservations), Loyalty + Subscriptions (Cocktail Passport).
  Needs: Square Access Token, Application ID, Location ID (Sandbox first).
- P1: Real photography to replace AI imagery; finalise real menu + prices; email
  notifications (SendGrid/Resend) on form submit; admin to manage events/menu.
- P2: Rate limiting on public POST endpoints; tighten CORS; date/time validation;
  React Router v7 future flags; SEO/meta + analytics.

## Notes
- No authentication in Phase 1. Mocked: Square commerce/bookings/loyalty.
