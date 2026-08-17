// ─────────────────────────────────────────────────────────
//  SEO helpers — schema.org structured data for the Cellar.
//  Emitted via <JsonLd/> so each spirit is eligible for Google
//  Product rich results (name, brand, image, price when set).
// ─────────────────────────────────────────────────────────

export const SITE_URL = "https://cozybox.au";

const abs = (path) => (path?.startsWith("http") ? path : SITE_URL + (path || "/img/shop_bottles.jpg"));

// ── Per-route <title>/description/canonical ────────────────────────────────
// The static index.html canonical points every route at the homepage, which
// tells Google that /menu, /shop etc. are duplicates of "/". This updates the
// canonical + title + description per route so each page can rank on its own.
export const ROUTE_META = {
  "/":          { title: "Cozy Box · by Fossey's Distillery", description: "Cozy Box by Fossey's Distillery. An electric cocktail bar and lounge in Carlton, Melbourne. Indian inspired tapas, craft spirits and late nights." },
  "/our-story": { title: "Our Story · Cozy Box",              description: "The story behind Cozy Box by Fossey's Distillery, an Indian inspired cocktail bar and lounge in Carlton, Melbourne." },
  "/menu":      { title: "Menu · Cozy Box",                   description: "Lunch and dinner at Cozy Box. Indian inspired tapas, large plates and desserts in Carlton, Melbourne." },
  "/whats-on":  { title: "What's On · Cozy Box",              description: "Weekly events at Cozy Box in Carlton, Melbourne, from gin flights to late nights." },
  "/private":   { title: "Private & Events · Cozy Box",       description: "Private dining and events at Cozy Box in Carlton, Melbourne. Enquire about hosting your next occasion." },
  "/shop":      { title: "The Cellar · Cozy Box",             description: "Shop Fossey's Distillery spirits. Small batch gin, vodka, whisky and liqueurs, shipped across Australia." },
  "/passport":  { title: "Cocktail Passport · Cozy Box",      description: "The Cozy Box cocktail passport. Journey through our signature drinks in Carlton, Melbourne." },
  "/book":      { title: "Book a Table · Cozy Box",           description: "Reserve your table at Cozy Box in Carlton, Melbourne. Open Wednesday to Sunday." },
  "/contact":   { title: "Contact · Cozy Box",               description: "Find Cozy Box at 209 Lygon Street, Carlton, Melbourne. Opening hours and contact details." },
};

const setAttr = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Update the head's canonical, title and description for the current route. */
export function applyRouteSeo(pathname) {
  const path = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const meta = ROUTE_META[path] || ROUTE_META["/"];
  const url = path === "/" ? SITE_URL + "/" : SITE_URL + path;
  document.title = meta.title;
  setAttr('link[rel="canonical"]', "href", url);
  setAttr('meta[name="description"]', "content", meta.description);
  setAttr('meta[property="og:url"]', "content", url);
  setAttr('meta[property="og:title"]', "content", meta.title);
  setAttr('meta[property="og:description"]', "content", meta.description);
}

/** A single Fossey's spirit as a schema.org/Product. */
export function productSchema(s) {
  const price = s.price ? (s.price / 100).toFixed(2) : null;
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: `Fossey's ${s.name}`,
    description: s.description,
    image: abs(s.image),
    category: s.section,
    brand: { "@type": "Brand", name: "Fossey's Distillery" },
    ...(s.abv
      ? { additionalProperty: [{ "@type": "PropertyValue", name: "Alcohol by volume", value: s.abv }] }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/shop`,
      seller: { "@type": "Organization", name: "Cozy Box by Fossey's Distillery" },
      ...(price ? { price } : { priceSpecification: { "@type": "PriceSpecification", priceCurrency: "AUD" } }),
    },
  };
}

/** The whole Cellar as an ItemList of Products (crawlable on /shop). */
export function catalogSchema(spirits) {
  return {
    "@context": "https://schema.org/",
    "@type": "ItemList",
    name: "The Cellar — Fossey's Distillery spirits",
    description: "Small-batch gin, vodka, whisky, rum, liqueurs and the Indian Series, crafted in Carlton and shipped across Australia.",
    numberOfItems: spirits.length,
    itemListElement: spirits.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: productSchema(s),
    })),
  };
}
