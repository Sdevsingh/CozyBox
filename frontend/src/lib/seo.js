// ─────────────────────────────────────────────────────────
//  SEO helpers — schema.org structured data for the Cellar.
//  Emitted via <JsonLd/> so each spirit is eligible for Google
//  Product rich results (name, brand, image, price when set).
// ─────────────────────────────────────────────────────────

export const SITE_URL = "https://cozybox.au";

const abs = (path) => (path?.startsWith("http") ? path : SITE_URL + (path || "/img/shop_bottles.jpg"));

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
