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

/**
 * Cocktail Passport — membership / subscription tiers
 * (Square Loyalty / Subscriptions).
 */
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
    id: "PLAN_PASSPORT_MONTHLY",
    name: "Cocktail Passport — Monthly",
    cadence: "MONTHLY",
    price: 3900,
    currency: "AUD",
    perks: [
      "1 signature cocktail on the house every visit",
      "2× passport stamps (loyalty points) on all spend",
      "Skip-the-line entry on event nights",
      "Member-only masterclasses & tastings",
    ],
  },
  {
    id: "PLAN_PASSPORT_ANNUAL",
    name: "Cocktail Passport — Annual",
    cadence: "ANNUAL",
    price: 39000,
    currency: "AUD",
    perks: [
      "Everything in Monthly",
      "Complete the passport → unlock a private cocktail masterclass for 4",
      "Priority RSVP to Ladies Night & launch parties",
      "Early access to limited Fossey's distillery releases",
    ],
  },
];

/** Loyalty program config (mirrors a Square Loyalty program). */
export const LOYALTY_PROGRAM = {
  id: "LOYALTY_COCKTAIL_PASSPORT",
  name: "Cocktail Passport Stamps",
  /** points (stamps) earned per AUD dollar spent */
  pointsPerDollar: 1,
  rewardTiers: [
    { id: "TIER_50", name: "Free signature cocktail", points: 50 },
    { id: "TIER_150", name: "Cocktail flight for two", points: 150 },
    { id: "TIER_300", name: "Private cocktail masterclass", points: 300 },
  ],
};

/** What's On — events programme. */
export interface VenueEvent {
  id: string;
  title: string;
  tagline: string;
  date: string;
  startTime: string;
  category: "Signature" | "Live" | "Masterclass" | "Launch";
  description: string;
  priceFrom: number | null;
  currency: "AUD";
  image: string;
  bookable: boolean;
}

export const EVENTS: VenueEvent[] = [
  {
    id: "EVT_LADIES_NIGHT",
    title: "Ladies Night",
    tagline: "Cocktails, beats & glamour",
    date: "2026-07-23",
    startTime: "19:00",
    category: "Signature",
    description:
      "Our signature Ladies Night returns — 2-for-1 signature cocktails before 9pm, a live DJ, and a sparkling welcome on arrival. Gather your crew for a night of glamour at the Cozy Box bar.",
    priceFrom: 0,
    currency: "AUD",
    image: "/img/ladies_night.png",
    bookable: true,
  },
  {
    id: "EVT_DJ_SATURDAYS",
    title: "Neon Saturdays",
    tagline: "Resident DJs all night",
    date: "2026-07-04",
    startTime: "21:00",
    category: "Live",
    description:
      "Our resident DJs take over the booth with house, disco and R&B until late. Lasers, haze and the full neon treatment.",
    priceFrom: 2000,
    currency: "AUD",
    image: "/img/whats_on.png",
    bookable: true,
  },
  {
    id: "EVT_PASSPORT_LAUNCH",
    title: "Cocktail Passport Launch Party",
    tagline: "Be a founding member",
    date: "2026-07-11",
    startTime: "18:30",
    category: "Launch",
    description:
      "Celebrate the launch of the Cozy Box Cocktail Passport. Founding members get a complimentary first stamp, a guided tasting of the new menu, and a Fossey's welcome pour.",
    priceFrom: 0,
    currency: "AUD",
    image: "/img/cocktail_passport.png",
    bookable: true,
  },
  {
    id: "EVT_MASTERCLASS",
    title: "Fossey's Cocktail Masterclass",
    tagline: "Shake, stir & sip",
    date: "2026-07-18",
    startTime: "17:00",
    category: "Masterclass",
    description:
      "A hands-on 90-minute masterclass with our head bartender using Fossey's distillery spirits. Make (and drink) three cocktails, with bites to match.",
    priceFrom: 8900,
    currency: "AUD",
    image: "/img/menu_food_drinks.png",
    bookable: true,
  },
];

/** Private Area & Functions — event packages. */
export interface FunctionPackage {
  id: string;
  name: string;
  blurb: string;
  priceFrom: number;
  currency: "AUD";
  capacity: string;
  inclusions: string[];
  image: string;
  brochureUrl: string;
}

export const PACKAGES: FunctionPackage[] = [
  {
    id: "PKG_BIRTHDAY",
    name: "Birthday Package",
    blurb:
      "Make your birthday unforgettable with a reserved booth, bottle service and a cocktail tower for the table.",
    priceFrom: 45000,
    currency: "AUD",
    capacity: "8–20 guests",
    inclusions: [
      "Reserved booth for the night",
      "Cocktail tower on arrival",
      "Choice of grazing or canapé menu",
      "Personalised birthday cocktail",
    ],
    image: "/img/private_events.png",
    brochureUrl: "/brochures/fosseys-distillery-catalogue.pdf",
  },
  {
    id: "PKG_PRIVATE_HIRE",
    name: "Exclusive Venue Hire",
    blurb:
      "Take over the whole Cozy Box for a private event — full bar, DJ booth and dedicated event team.",
    priceFrom: 250000,
    currency: "AUD",
    capacity: "up to 120 guests",
    inclusions: [
      "Exclusive use of the venue",
      "Dedicated bar staff & event manager",
      "DJ booth & sound system",
      "Custom cocktail menu with Fossey's spirits",
    ],
    image: "/img/hero_club.png",
    brochureUrl: "/brochures/fosseys-distillery-catalogue.pdf",
  },
  {
    id: "PKG_CORPORATE",
    name: "Corporate & Functions",
    blurb:
      "End-of-year parties, product launches and team nights — flexible spaces and tailored beverage packages.",
    priceFrom: 90000,
    currency: "AUD",
    capacity: "20–80 guests",
    inclusions: [
      "Semi-private or full venue options",
      "Beverage packages or consumption bar",
      "Canapé & grazing menus",
      "AV & presentation support",
    ],
    image: "/img/whats_on.png",
    brochureUrl: "/brochures/fosseys-distillery-catalogue.pdf",
  },
  {
    id: "PKG_MASTERCLASS",
    name: "Private Cocktail Masterclass",
    blurb:
      "A guided, hands-on cocktail experience for your group using Fossey's distillery range.",
    priceFrom: 12000,
    currency: "AUD",
    capacity: "6–16 guests",
    inclusions: [
      "90-minute guided masterclass",
      "Three cocktails per guest",
      "Matching bar bites",
      "Take-home recipe card",
    ],
    image: "/img/cocktail_passport.png",
    brochureUrl: "/brochures/fosseys-distillery-catalogue.pdf",
  },
];
