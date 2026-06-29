/**
 * Seed data modelled on the real CozyBox by Fossey's Distillery menu and
 * distillery products. Prices are stored in the smallest currency unit
 * (cents) to match Square's Money model. Currency is AUD.
 */

export type CatalogCategory = "food" | "drink" | "retail";

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  /** price in cents (AUD) */
  price: number;
  currency: "AUD";
  category: CatalogCategory;
  section: string;
  dietary: string[];
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  timezone: string;
  hours: string;
}

export const LOCATIONS: Location[] = [
  {
    id: "LOC_CARLTON",
    name: "Cozy Box by Fossey's Distillery — Carlton",
    address: "209 Lygon St, Carlton VIC 3053, Australia",
    phone: "+61 3 9100 1916",
    timezone: "Australia/Melbourne",
    hours: "Wed–Thu 4pm–10pm · Fri 4pm–12am · Sat 12pm–12am · Sun 12pm–10pm",
  },
];

export const CATALOG: CatalogItem[] = [
  // ── Small plates / sliders ───────────────────────────────────────────
  {
    id: "ITEM_DUCK_SLIDER",
    name: "Duck Slider",
    description:
      "Pulled duck, pineapple chili jam, asian slaw, honey curd lime & butter-toasted pav.",
    price: 900,
    currency: "AUD",
    category: "food",
    section: "Small Plates",
    dietary: [],
  },
  {
    id: "ITEM_VEG_SLIDER",
    name: "Veg Slider",
    description:
      "Aloo tikki, carrot-cabbage-onion, tamarind & mint chutney & butter toasted pav.",
    price: 700,
    currency: "AUD",
    category: "food",
    section: "Small Plates",
    dietary: ["V"],
  },
  {
    id: "ITEM_GOAT_SLIDER",
    name: "Goat Slider",
    description:
      "Mint chutney, pickled onion, garlic yogurt mayo, butter-toasted pav.",
    price: 900,
    currency: "AUD",
    category: "food",
    section: "Small Plates",
    dietary: [],
  },
  {
    id: "ITEM_BOMBAY_CHAAT",
    name: "Bombay Chaat",
    description: "Cracker, avocado, pomegranate, tamarind, yogurt & coriander.",
    price: 2100,
    currency: "AUD",
    category: "food",
    section: "From the Garden",
    dietary: ["V"],
  },
  {
    id: "ITEM_PUMPKIN_KATAIFI",
    name: "Pumpkin Kataifi",
    description: "Khata meetha pumpkin, harissa honey, pistachio.",
    price: 1400,
    currency: "AUD",
    category: "food",
    section: "From the Garden",
    dietary: ["V"],
  },
  {
    id: "ITEM_DAL_CHAWAL",
    name: "Dal Chawal",
    description: "Papadum, yellow dal, rice, tomato-onion kachumber & raita.",
    price: 1900,
    currency: "AUD",
    category: "food",
    section: "Large Plates",
    dietary: ["V", "GF", "DFO"],
  },
  {
    id: "ITEM_TANDOORI_DUCK",
    name: "Tandoori Duck",
    description: "Indian spiced broccolini, tandoori duck, orange coconut yogurt.",
    price: 3400,
    currency: "AUD",
    category: "food",
    section: "Large Plates",
    dietary: ["GF"],
  },
  {
    id: "ITEM_BUTTER_CHICKEN",
    name: "Butter Chicken",
    description:
      "Waffle naan, butter chicken pate, chicken tikka & pistachios crumble.",
    price: 3600,
    currency: "AUD",
    category: "food",
    section: "Large Plates",
    dietary: ["DFO"],
  },
  {
    id: "ITEM_LAMB_RIBS",
    name: "Lamb Ribs",
    description:
      "Khata meeta pumpkin, almond korma, tandoori spiced lamb & rice cakes.",
    price: 4200,
    currency: "AUD",
    category: "food",
    section: "Large Plates",
    dietary: ["GF", "DFO"],
  },
  {
    id: "ITEM_GAJER_HALWA",
    name: "Gajer Halwa",
    description: "Reconstructed carrot pudding.",
    price: 1600,
    currency: "AUD",
    category: "food",
    section: "Desserts",
    dietary: ["GF"],
  },
  {
    id: "ITEM_TASTING_MENU",
    name: "Five-Dish Tasting Menu (pp)",
    description:
      "Put yourself in the chef's hands — a curated five-dish selection of seasonal plates. Minimum 2 guests.",
    price: 4900,
    currency: "AUD",
    category: "food",
    section: "Chef's Selection",
    dietary: [],
  },

  // ── Distillery retail products (online shop) ─────────────────────────
  {
    id: "ITEM_REDGUM_HONEY_RUM",
    name: "Redgum Honey Rum",
    description: "Fossey's small-batch rum mellowed with native redgum honey. 700ml.",
    price: 8500,
    currency: "AUD",
    category: "retail",
    section: "Our Distillery Products",
    dietary: [],
  },
  {
    id: "ITEM_PEATED_WHISKY",
    name: "Peated Single Malt Single Barrel Whisky",
    description: "Single barrel, peated single malt whisky. 700ml.",
    price: 16000,
    currency: "AUD",
    category: "retail",
    section: "Our Distillery Products",
    dietary: [],
  },
  {
    id: "ITEM_BLOOD_ORANGE_VODKA",
    name: "Blood Orange Vodka",
    description: "Bright, citrus-forward vodka infused with blood orange. 700ml.",
    price: 6500,
    currency: "AUD",
    category: "retail",
    section: "Our Distillery Products",
    dietary: [],
  },
  {
    id: "ITEM_CHILLI_GIN",
    name: "Chilli Gin",
    description: "Botanical gin with a slow build of warming chilli. 700ml.",
    price: 7500,
    currency: "AUD",
    category: "retail",
    section: "Our Distillery Products",
    dietary: [],
  },
];

/** Plate Pass — loyalty + subscription tiers (Square Loyalty / Subscriptions). */
export interface PlatePassPlan {
  id: string;
  name: string;
  cadence: "MONTHLY" | "ANNUAL";
  price: number;
  currency: "AUD";
  perks: string[];
}

export const PLATE_PASS_PLANS: PlatePassPlan[] = [
  {
    id: "PLAN_PLATE_PASS_MONTHLY",
    name: "Plate Pass — Monthly",
    cadence: "MONTHLY",
    price: 2900,
    currency: "AUD",
    perks: [
      "10% off every dine-in visit",
      "2× loyalty points on all spend",
      "Priority table booking windows",
      "Member-only tasting events",
    ],
  },
  {
    id: "PLAN_PLATE_PASS_ANNUAL",
    name: "Plate Pass — Annual",
    cadence: "ANNUAL",
    price: 29000,
    currency: "AUD",
    perks: [
      "Everything in Monthly",
      "One free Five-Dish Tasting Menu each year",
      "Complimentary welcome cocktail every visit",
      "Early access to distillery releases",
    ],
  },
];

/** Loyalty program config (mirrors a Square Loyalty program). */
export const LOYALTY_PROGRAM = {
  id: "LOYALTY_PLATE_PASS",
  name: "Plate Pass Rewards",
  /** points earned per AUD dollar spent */
  pointsPerDollar: 1,
  rewardTiers: [
    { id: "TIER_100", name: "$10 off", points: 100 },
    { id: "TIER_250", name: "Free dessert + $15 off", points: 250 },
    { id: "TIER_500", name: "Free Five-Dish Tasting Menu", points: 500 },
  ],
};
