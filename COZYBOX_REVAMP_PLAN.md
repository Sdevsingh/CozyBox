# Cozy Box — Website Revamp & Migration Plan
### From WordPress/WooCommerce → React + Square ("Bar / Club Vibes")

**Prepared for:** Cozy Box by Fossey's Distillery — 209 Lygon St, Carlton VIC 3053
**Goal:** Rebuild cozybox.au as a dark, cinematic "bar/club" experience. Keep the real business info (menu, spirits, address, hours), keep the existing logo, replace WordPress/WooCommerce/WPCafe with a modern React front end powered by Square for shop, bookings, loyalty and events.

---

## 0. TL;DR — What We're Doing

| Area | Today (WordPress) | After Revamp |
|---|---|---|
| Front end | Elementor + WordPress theme | React (custom dark bar/club UI, motion-driven) |
| Online shop | WooCommerce + WooCommerce Square plugin | Square Catalog + Orders + Payments APIs |
| Reservations | WPCafe | Square Bookings API |
| Loyalty ("Plate Pass") | Manual Google Sheet | Square Loyalty API |
| Recurring ("Semester Pass") | None / manual | Square Subscriptions API |
| Content (story, events text) | WordPress pages | Stored in our DB / CMS-style admin |
| Logo | WHITE-PNG-scaled.png | **Same logo — reused as-is** |
| Vibe | Light, editorial, restaurant | Dark, moody, gold/amber neon, nightlife |

**No more:** WooCommerce, WPCafe, Real3D Flipbook, and (optionally) Elementor Pro.
**One source of truth:** Square Dashboard + Square POS in venue stay perfectly in sync with the website.

---

## 1. New Information Architecture (the 6 sections)

Your note said *"Total of 6 sub categories only"*. Here's the proposed top-nav — 6 primary items + utility links — with bar/club-flavoured naming (your original names kept in brackets so nothing is lost):

| # | New name (bar/club tone) | Original / note name | What it holds |
|---|---|---|---|
| 1 | **Home** | Home | Cinematic hero, vibe reel, highlights, quick book CTA |
| 2 | **Our Story** | Our Story | The Cozy Box + Fossey's Distillery narrative, gallery |
| 3 | **The Menu** *(Food & Drinks)* | Menu → Food & Drinks | Tapas plates + cocktails/spirits, filterable |
| 4 | **Reserve** *(Book Your Experience)* | Reservations / Book your experience | Square Bookings flow |
| 5 | **The Cellar** *(Fossey's Shop)* | Online Shop (Fossey's) | Square-powered bottle shop |
| 6 | **Private & Events** | Private Area & Functions + What's On | Function enquiries + What's On listings |

**Utility (not counted in the 6):** `Contact` and a persistent **Book a Table** button in the header.

> Naming options if you want more nightlife edge: *"Reserve"→"Get a Table"*, *"The Cellar"→"Bottle Shop"*, *"Private & Events"→"After Dark" / "The Lineup"*. We can A/B these.

**Menu sub-categories (the "6" could also mean food groupings):** we'll structure the food/drink menu into up to 6 buckets, e.g. *Snacks · Small Plates · Off the Grill · From the Tandoor · Sweets · Cocktails & Spirits*. Final list to be confirmed from your real menu.

---

## 2. Design Direction — "Dark + Warm Gold/Amber Neon"

Inspired by the 3 demo reels (FragWater / Obsyx / Osiris style): **luxury-editorial motion**, cinematic dark canvas, deliberate pacing — adapted to a moody nightlife bar.

### 2.1 Visual language
- **Base:** near-black charcoal (`#0E0C0A` / `#14110E`) — solid, not gradient — to echo the bluestone/whisky-bar interior.
- **Accent:** warm amber/gold neon (`#E9B86A`, `#C8922F`, glow `#F4C77A`). Used for headlines, button borders, hover glows, dividers.
- **Texture/depth:** subtle film grain overlay, soft vignette, glass-morphism panels (16–20px backdrop blur) for cards and the sticky nav.
- **Imagery:** your existing photography (stone entrance, plated tapas, bottles) graded warmer/darker for consistency. New images added where gaps exist.
- **Logo:** the existing white Cozy Box logo sits perfectly on the dark canvas — reused unchanged.

### 2.2 Typography (avoiding generic defaults)
- **Display/headings:** an editorial serif with character (e.g. *Fraunces* / *Cormorant*) for that premium "menu card" feel, entering with a **blur-to-sharp** focus animation.
- **Body/UI:** a clean grotesk that isn't Inter/Roboto (e.g. *Geist*, *Hanken Grotesk*, or *Schibsted Grotesk*).
- Generous spacing (2–3× typical), left-aligned and asymmetric layouts rather than centered symmetry.

### 2.3 Motion system (the part you specifically liked)
| Effect | Where | How |
|---|---|---|
| **Smooth/inertia scroll** ("velvet scroll") | Whole site | Lenis smooth-scroll for momentum/heaviness |
| **Staggered reveal** (fade + slide-up, ease-out) | Every section's text/images | Motion (Framer Motion) + IntersectionObserver |
| **Parallax** (bg moves ~10–20% slower) | Hero, story, gallery | scroll-linked transforms |
| **Spotlight / flashlight** | Hero or a feature section | radial-gradient mask following cursor over a dark overlay |
| **Border-glow buttons** | "Book a Table", "Shop", "Reserve" | animated amber stroke + soft glow on hover, no jarring color flip |
| **Magnetic hover + scale 1.05** | Cards, product tiles | gentle scale + shadow softening |
| **Cross-dissolve / Ken Burns** | Galleries, image transitions | slow zoom + crossfade instead of hard cuts |
| **Kinetic logo/headline reveal** | Page load | letters/words animate in once |

All transitions target specific properties (opacity, transform) — never `transition: all`. Respect `prefers-reduced-motion`.

### 2.4 Deliverable before build
A `design_agent` guideline + 1–2 reference screens (Home hero + Menu) for your sign-off so we lock the look before coding.

---

## 3. Page-by-Page Breakdown

### 3.1 Home
- Full-bleed hero: dark video/photo loop of the venue, kinetic logo reveal, tagline *"Expect the unexpected"*, **Book a Table** + **Explore the Menu** glow CTAs, spotlight cursor effect.
- "Welcome / Where Indian Tapas Come Alive" — staggered text reveal with a parallax plated-food image.
- Featured highlights strip (What's On teaser, Ladies Night flyer placement).
- Signature spirits carousel (pulls top 4 from Square Catalog).
- Reviews marquee (existing testimonials, auto-scrolling).
- Footer: address, hours, Instagram, contact, 18+ note.

### 3.2 Our Story
- Cozy Box × Fossey's Distillery narrative (reuse/restyle current copy), parallax gallery, "Read more" → distillery section. Cross-dissolve image gallery.

### 3.3 The Menu (Food & Drinks)
- Tabbed/filtered menu (up to 6 categories), each plate as a card with name, description, price, optional photo, dietary tags.
- Toggle **Food ⇄ Drinks/Cocktails**.
- Menu data managed in our admin (or synced from Square Catalog if you keep food items there too).

### 3.4 Reserve (Book Your Experience) — **Square Bookings**
- Step 1: pick date → `SearchAvailability` for 209 Lygon St.
- Step 2: pick time + party size → `Customers` create/find.
- Step 3: confirm → `CreateBooking`; Square auto-sends confirmation email.
- Admin manages in Square Dashboard → Appointments; visible on POS in real time.
- ⚠️ Modifying/cancelling seller bookings via API needs **Square Appointments Plus/Premium** (~$35–55 AUD/mo). On free plan, customers can book but admin edits must be done in-dashboard.

### 3.5 The Cellar (Fossey's Online Shop) — **Square Catalog + Orders + Payments**
- Grid of bottles pulled live from **Catalog API** (Redgum Honey Rum, Peated Single Malt, Blood Orange Vodka, Chilli Gin, etc.).
- Cart in React state → **Orders API** draft order.
- Checkout via **Web Payments SDK** (hosted card iframe — PCI compliant, we never touch card data).
- Server middleman (FastAPI endpoint / one PHP file) calls **Payments API** with the token → charges in AUD → order COMPLETED.
- All sales appear in Square Dashboard alongside in-venue POS sales.
- 18+ age-gate modal preserved (as on current site).

### 3.6 Private & Events (Functions + What's On)
- **Private Area & Functions:** enquiry form (date, headcount, occasion) → stored + emailed; optional deposit via Square.
- **What's On:** event listings (Ladies Night, Campus Cozy, etc.) with flyer images, dates, and "Book"/"RSVP".
- Optional advanced layer: **Plate Pass (Loyalty API)** and **Semester Pass (Subscriptions API)** as described in your Square plan — phased in later.

### 3.7 Contact
- Map, address, hours, phone, email, Instagram, contact form (stored + emailed).

---

## 4. Square Integration Architecture

```
cozybox.au (React front end)
        |
   Server middleman (FastAPI / serverless function)  ← holds the secret Access Token
        |
 ┌──────┼───────────────┬───────────────┬──────────────┐
 Shop   Bookings        Loyalty         Subscriptions   Catalog/Customers
 Orders Bookings API    Loyalty API     Subscriptions   Catalog/Customers API
 Payments
        |
   Square Dashboard  ⇄  Square POS in venue (real-time, one source of truth)
```

**Golden rule:** the Production Access Token lives **server-side only**. Browser → our server → Square. Never expose it in React.

### 4.1 Credentials needed (from developer.squareup.com, your existing Square account)
1. **Production Access Token** (secret, server-side)
2. **Sandbox Access Token** (testing)
3. **Application ID** (Web Payments SDK card form)
4. **Location ID** (Cozy Box venue)
5. **Loyalty Program ID** (after configuring Plate Pass rules) — only when we build loyalty

> We'll build & test everything against **Sandbox** first, then flip to Production on launch.

### 4.2 Square plan/config prerequisites (you action these in Square)
- Confirm/upgrade **Square Appointments Plus** for full Bookings API control.
- Configure **Loyalty** program (1 stamp/visit, 5 stamps = reward) before loyalty build.
- Confirm WooCommerce→Square **Catalog sync** is current (likely already synced).

---

## 5. Technical Stack & Build Approach

- **Front end:** React, Tailwind, Framer Motion, Lenis (smooth scroll), lucide-react icons.
- **Back end:** FastAPI (Python) as the secure Square middleman + our own data (menu content, event listings, enquiry/contact submissions).
- **Database:** MongoDB for site content (menu items, events, story copy, form submissions). Square remains source of truth for commerce/bookings.
- **Admin (lightweight):** manage menu items, events/What's On, and view enquiries — so you update content without touching code.
- **Media:** object storage for any newly uploaded images; existing photos pulled/migrated from the WP media library.

---

## 6. Migration Strategy (zero-downtime, honest about risk)

**Run both systems in parallel for ~30–60 days.**

1. **Build phase:** new React+Square site built on a staging URL while cozybox.au keeps running on WordPress.
2. **Data:** confirm Square Catalog has all Fossey's products; export/clean WP media; copy menu + story copy into new admin.
3. **Sandbox test:** full shop checkout, booking, contact, enquiry flows in Square Sandbox.
4. **Production switch (launch day):** point domain to the new site, flip Square to Production keys, route online orders + bookings to Square.
5. **Grace period:** keep WooCommerce/WPCafe alive but hidden for 30–60 days as a safety net.
6. **Decommission:** after confidence, cancel WPCafe, WooCommerce Square, Real3D Flipbook, (optionally) Elementor Pro. WordPress can be retired entirely or kept only as a content note.

### What you can switch off after launch
| System | Cancel when | Saving |
|---|---|---|
| WooCommerce Square plugin | Shop live on Square API | bundled |
| WPCafe | Reservations live on Square Bookings | licence fee |
| Real3D Flipbook | Menu is a real web page | licence fee |
| Elementor Pro | Site fully on React | ~$15 AUD/mo |
| LiteSpeed / Smush | Hosting/Image handles natively | free anyway |

---

## 7. Risks & Mitigations (from your Square notes)

| Risk | Severity | Mitigation |
|---|---|---|
| Access Token leaking to browser | High | Server middleman only; tokens in env vars, never in React |
| Bookings API needs paid Appointments plan | Medium | Verify plan; budget ~$35–55 AUD/mo; fallback = book-only |
| Loyalty must be pre-configured in Dashboard | Low | Set rules before loyalty build |
| Catalog migration from Woo | Medium | Use existing Woo↔Square sync; verify counts before launch |
| Two systems during transition | Medium | 30–60 day parallel run, switch on launch day |
| Orphan WP images | Low | Clean with Media Cleaner before cutover |

---

## 8. Phased Roadmap (suggested build order)

**Phase 1 — Foundation & Look (highest "wow", lowest risk)**
- Design sign-off (Home + Menu reference screens).
- Build front-end shell: dark theme, motion system, nav (6 sections), Home, Our Story, Menu (content-driven), Contact form (working).
- *No Square yet* — menu/events from our DB. Ship a beautiful, browsable site fast.

**Phase 2 — Commerce & Bookings (Square)**
- The Cellar shop: Catalog + Orders + Payments (Sandbox → Production).
- Reserve: Bookings API flow.
- Private & Events: enquiry forms + What's On listings + lightweight admin.

**Phase 3 — Loyalty & Recurring (optional, advanced)**
- Plate Pass (Loyalty API) + Semester Pass (Subscriptions API).

**Phase 4 — Launch & Decommission**
- Domain switch, Production keys, parallel run, then retire WordPress plugins.

---

## 9. What I Need From You To Start Building

1. **Go-ahead** on the IA naming + design direction above (or your tweaks).
2. **Repo access** — `github.com/Sdevsingh/CozyBox` is currently private (404). Make it public, send a zip, or use GitHub import. (Optional — I can also build fresh.)
3. **Square credentials** (Sandbox first): Access Token, Application ID, Location ID.
4. **Real menu** (food + drinks with prices) and the **What's On** items (e.g. Ladies Night 23 July flyer).
5. **New images** you mentioned you'd add (hero/venue/event shots).
6. Confirm your **Square Appointments plan** (for full Bookings control).

---

*Logo stays the same. Real business info stays accurate. The transformation is purely in experience (dark bar/club vibe + motion) and in plumbing (WordPress → React + Square).*
