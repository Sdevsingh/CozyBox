// ─────────────────────────────────────────────────────────
//  Cozy Box by Fossey's Distillery, static content
//  All prices in AUD cents.  Images in /public/img/.
//  When Square Catalog is live, these are replaced by API.
// ─────────────────────────────────────────────────────────

export const LOCATION = {
  name: "Cozy Box by Fossey's Distillery",
  address: "209 Lygon St, Carlton VIC 3053",
  phone: "+61 3 9100 1916",
  email: "hello@cozybox.au",
  instagram: "https://www.instagram.com/cozybox_au/",
  facebook: "https://www.facebook.com/cozyboxau/",
  timezone: "Australia/Melbourne",
  hours: [
    { day: "Monday", time: "Closed" },
    { day: "Tuesday", time: "Closed" },
    { day: "Wednesday", time: "4:30pm – 10pm" },
    { day: "Thursday", time: "4:30pm – 1am" },
    { day: "Friday", time: "11am – 1am" },
    { day: "Saturday", time: "11am – 1am" },
    { day: "Sunday", time: "11am – 10pm" },
  ],
  hoursOneLiner: "Wed 4:30pm–10pm · Thu 4:30pm–1am · Fri & Sat 11am–1am · Sun 11am–10pm · Mon & Tue closed",
  aboutBlurb:
    "Cozy Box celebrates the rich diversity of Indian cuisine through a contemporary, tapas style experience. Crafted for sharing and discovery, each small plate reimagines familiar flavours — where every dish tells a story and every bite sparks conversation.",
  enquiryEmail: "events@cozybox.au",
};

// ─── OPENING HOURS (structured + live "open now") ─────────
//  24-hour decimals; close > 24 means the venue trades past midnight.
//  `dow` is JS getDay() (0 = Sunday … 6 = Saturday).
export const HOURS = [
  { day: "Monday", dow: 1, open: null, close: null },
  { day: "Tuesday", dow: 2, open: null, close: null },
  { day: "Wednesday", dow: 3, open: 16.5, close: 22 },   // 4:30pm – 10pm
  { day: "Thursday", dow: 4, open: 16.5, close: 25 },    // 4:30pm – 1am
  { day: "Friday", dow: 5, open: 11, close: 25 },        // 11am – 1am
  { day: "Saturday", dow: 6, open: 11, close: 25 },      // 11am – 1am
  { day: "Sunday", dow: 0, open: 11, close: 22 },        // 11am – 10pm
];

const fmtHour = (h) => {
  const hh = ((Math.floor(h) % 24) + 24) % 24;
  const m = Math.round((h - Math.floor(h)) * 60);
  const ap = hh < 12 ? "am" : "pm";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return m === 0 ? `${h12}${ap}` : `${h12}:${String(m).padStart(2, "0")}${ap}`;
};
export const hourLabel = (e) => (e.open == null ? "Closed" : `${fmtHour(e.open)} – ${fmtHour(e.close)}`);

// Current time at the venue (Australia/Melbourne), as a JS weekday + decimal hour.
export function melbourneNow() {
  try {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
    }).formatToParts(new Date());
    const m = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    const dowMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    let hour = parseInt(m.hour, 10);
    if (hour === 24) hour = 0;
    return { dow: dowMap[m.weekday] ?? new Date().getDay(), time: hour + parseInt(m.minute, 10) / 60 };
  } catch {
    const d = new Date();
    return { dow: d.getDay(), time: d.getHours() + d.getMinutes() / 60 };
  }
}

// Is the venue open right now? (handles trading past midnight).
export function openStatus() {
  const { dow, time } = melbourneNow();
  const byDow = (d) => HOURS.find((h) => h.dow === d);
  const today = byDow(dow);
  let openNow = !!(today && today.open != null && time >= today.open && time < today.close);
  if (!openNow) {
    const y = byDow((dow + 6) % 7); // yesterday, in case it closed after midnight
    if (y && y.close > 24 && time < y.close - 24) openNow = true;
  }
  return { openNow, todayDow: dow };
}

// ─── FOOD & DRINKS MENU ───────────────────────────────────

export const CATALOG = [
  // Small Plates
  {
    id: "ITEM_DUCK_SLIDER",
    name: "Duck Slider",
    description: "Pulled duck, pineapple chili jam, asian slaw, honey curd lime & butter-toasted pav.",
    price: 900,
    category: "food",
    section: "Small Plates",
    dietary: [],
  },
  {
    id: "ITEM_VEG_SLIDER",
    name: "Veg Slider",
    description: "Aloo tikki, carrot-cabbage-onion, tamarind & mint chutney & butter toasted pav.",
    price: 700,
    category: "food",
    section: "Small Plates",
    dietary: ["V"],
  },
  {
    id: "ITEM_GOAT_SLIDER",
    name: "Goat Slider",
    description: "Mint chutney, pickled onion, garlic yogurt mayo, butter-toasted pav.",
    price: 900,
    category: "food",
    section: "Small Plates",
    dietary: [],
  },

  // From the Garden
  {
    id: "ITEM_BOMBAY_CHAAT",
    name: "Bombay Chaat",
    description: "Cracker, avocado, pomegranate, tamarind, yogurt & coriander.",
    price: 2100,
    category: "food",
    section: "From the Garden",
    dietary: ["V"],
  },
  {
    id: "ITEM_PUMPKIN_KATAIFI",
    name: "Pumpkin Kataifi",
    description: "Khata meetha pumpkin, harissa honey, pistachio.",
    price: 1400,
    category: "food",
    section: "From the Garden",
    dietary: ["V"],
  },

  // Large Plates
  {
    id: "ITEM_DAL_CHAWAL",
    name: "Dal Chawal",
    description: "Papadum, yellow dal, rice, tomato-onion kachumber & raita.",
    price: 1900,
    category: "food",
    section: "Large Plates",
    dietary: ["V", "GF", "DFO"],
  },
  {
    id: "ITEM_TANDOORI_DUCK",
    name: "Tandoori Duck",
    description: "Indian spiced broccolini, tandoori duck, orange coconut yogurt.",
    price: 3400,
    category: "food",
    section: "Large Plates",
    dietary: ["GF"],
  },
  {
    id: "ITEM_BUTTER_CHICKEN",
    name: "Butter Chicken",
    description: "Waffle naan, butter chicken pate, chicken tikka & pistachios crumble.",
    price: 3600,
    category: "food",
    section: "Large Plates",
    dietary: ["DFO"],
  },
  {
    id: "ITEM_LAMB_RIBS",
    name: "Lamb Ribs",
    description: "Khata meeta pumpkin, almond korma, tandoori spiced lamb & rice cakes.",
    price: 4200,
    category: "food",
    section: "Large Plates",
    dietary: ["GF", "DFO"],
  },

  // Desserts
  {
    id: "ITEM_GAJER_HALWA",
    name: "Gajer Halwa",
    description: "Reconstructed carrot pudding, warm, aromatic, and made the slow way.",
    price: 1600,
    category: "food",
    section: "Desserts",
    dietary: ["GF"],
  },

  // Chef's Selection
  {
    id: "ITEM_TASTING_MENU",
    name: "Five-Dish Tasting Menu",
    description: "Put yourself in the chef's hands, a curated five-dish selection of seasonal plates. Minimum 2 guests.",
    price: 4900,
    category: "food",
    section: "Chef's Selection",
    dietary: [],
    perPerson: true,
  },

  // Signature Cocktails, all built on Fossey's spirits
  {
    id: "DRK_REDGUM_OLD_FASHIONED",
    name: "Redgum Old Fashioned",
    description: "Fossey's Redgum Honey Rum, aromatic bitters, native honey syrup, smoked orange peel.",
    price: 2400,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Rum",
    image: "/img/cocktail-1.jpg",
  },
  {
    id: "DRK_CHILLI_MARG",
    name: "Chilli Gin Margarita",
    description: "Fossey's Chilli Gin, agave nectar, fresh lime, tajín rim, heat that builds slowly.",
    price: 2300,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Gin",
    image: "/img/cocktail-3.png",
  },
  {
    id: "DRK_BLOOD_ORANGE_SPRITZ",
    name: "Blood Orange Spritz",
    description: "Fossey's Blood Orange Vodka, prosecco, soda water, blood orange twist.",
    price: 2200,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Vodka",
  },
  {
    id: "DRK_PEATED_SOUR",
    name: "Peated Whisky Sour",
    description: "Our single barrel peated malt, citrus, aquafaba, house smoked bitters.",
    price: 2600,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Whisky",
  },
  {
    id: "DRK_MASALA_MARTINI",
    name: "Masala Martini",
    description: "Chai washed Fossey's Vodka, dry vermouth, cardamom bitters, stirred and cold.",
    price: 2400,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Vodka",
  },
  {
    id: "DRK_MANGO_LASSI_SOUR",
    name: "Mango Lassi Sour",
    description: "Fossey's Original Gin, alphonso mango purée, yogurt, fresh lime, saffron.",
    price: 2200,
    category: "drink",
    section: "Signature Cocktails",
    dietary: [],
    spirit: "Gin",
  },
  {
    id: "DRK_PAAN_NEGRONI",
    name: "Paan Negroni",
    description: "Fossey's Paan Gin Liquor, Campari, sweet vermouth, a betel-leaf twist on a classic.",
    price: 2500,
    category: "drink",
    section: "Indian Series Cocktails",
    dietary: [],
    spirit: "Indian Series",
  },
  {
    id: "DRK_KALA_FIZZ",
    name: "Kala Khatta Fizz",
    description: "Fossey's Kala Khatta Gin Liquor, elderflower, prosecco, jamun foam.",
    price: 2300,
    category: "drink",
    section: "Indian Series Cocktails",
    dietary: [],
    spirit: "Indian Series",
  },
  {
    id: "DRK_ROYAL_ATTAR",
    name: "Royal Attar Rose",
    description: "Fossey's Royal Attar Vodka, lychee, rose water, lime, floral and bright.",
    price: 2400,
    category: "drink",
    section: "Indian Series Cocktails",
    dietary: [],
    spirit: "Indian Series",
  },
];

// ─── THE COZY BOX MENU (dine-in, from the house menu) ─────
// Prices are dine-in menu prices in AUD dollars. `star` = staff pick,
// `distiller` = distiller's choice. Dietary: V, DF, GF, GFO, DFO, VO.

export const MENU_LEGEND = [
  { code: "V", label: "Vegetarian" },
  { code: "DF", label: "Dairy Free" },
  { code: "GFO", label: "Gluten Free Option" },
  { code: "DFO", label: "Dairy Free Option" },
  { code: "VO", label: "Vegetarian Option" },
];

// Signature house gin tasting flight — the heart of the menu.
export const GIN_FLIGHT = {
  eyebrow: "Taste · Sip · Discover",
  title: "Choose Any 3 House Gins",
  note: "11+ gin flavours · house distilled, small batch",
  price: 15,
  flavours: [
    "Original", "Botanical", "Desert Lime", "Chilli", "Naval Strength",
    "Kaffir Leaf", "Hot Toddy", "Hot Cross Bun", "Mango",
    "Jamun · Indian Berries", "Masala Cumin", "Rose",
  ],
};

// Must try pours singled out on the menu.
export const MUST_TRY = [
  { name: "Monsoon Drop", note: "Inspired by the first rain", abv: "40%", kind: "Single Malt Whiskey" },
  { name: "Ikka", note: "Lead. Never Follow.", abv: "60%", kind: "Single Malt Whiskey" },
];

// Cocktail pitchers, poured to share.
export const PITCHERS = {
  price: 25,
  items: [
    { name: "Mango Pash", build: "Fossey's mango gin, passionfruit, pineapple" },
    { name: "Masala Cumin Spritz", build: "Fossey's masala gin, lemon, lemonade" },
    { name: "Movie Night", build: "Fossey's popcorn vodka, espresso & cola" },
    { name: "Jamun Mojito", build: "Fossey's jamun gin, mint, lemon & lemonade" },
    { name: "Chilli Elderflower Margarita", build: "Fossey's chilli gin, kaffir gin, elderflower" },
  ],
};

// Weekly specials calendar.
export const WEEKLY_SPECIALS = [
  { day: "Wednesday", title: "Tasting Flight", detail: "Choose any 3 gins · 11+ flavours", price: 10 },
  { day: "Thursday", title: "Ladies Special", detail: "2 cocktails & 2 small plates", price: 19.99 },
  { day: "Friday", title: "Cozy Passport", detail: "3 cocktails or 3 house drinks · till 1am", price: 25 },
  { day: "Saturday", title: "Tasters & Sliders", detail: "3 tasters + 2 sliders", price: 20 },
];

export const HOUSE_OFFERS = [
  { title: "Friends Flight", detail: "Shared platter — cocktail jug, bao & skewers", price: 49 },
  { title: "Fossey's Bottle Shop", detail: "Spend $100 & unlock any Fossey's gin or vodka", price: 40, prefix: "for" },
];

// Food menu, grouped for the tabbed layout.
export const FOOD_MENU = {
  plates: {
    label: "Small Plates",
    items: [
      { name: "Charcoal Fish", desc: "Crispy charcoal crusted, lemon & gunpowder", price: 16, diet: ["DF", "GFO"], star: true },
      { name: "Crispy Calamari", desc: "Golden calamari, lemon pepper & pickle aioli", price: 15, diet: ["DF", "GFO"] },
      { name: "Garlic Chilli Prawns", desc: "Pan-fried, garlic, chilli & lemon", price: 16, diet: ["GF", "DFO"] },
      { name: "Firecracker Chicken Lollipops", desc: "Garlic, ginger, chilli, curry leaf & pepper · 8pcs", price: 18, diet: ["GF"], star: true },
      { name: "Jalapeño Poppers", desc: "Kataifi, jalapeño, cheese, potato, sriracha cream", price: 16, diet: ["V"] },
      { name: "Avocado Chaat", desc: "Avocado, yoghurt, potato, tamarind", price: 16, diet: ["V", "DFO", "GFO"] },
      { name: "Crispy Corn", desc: "Sweet corn, garlic, green chilli & spring onion", price: 16, diet: ["V", "DF", "GFO"] },
      { name: "Crispy Mushroom Tacos", desc: "Flatbread, mushrooms, slaw, sour & chilli jam · 2pcs", price: 16, diet: ["V"] },
    ],
  },
  sliders: {
    label: "Sliders",
    note: "Served two per order",
    items: [
      { name: "Potato", desc: "Potato patty, tamarind slaw, mint chutney" },
      { name: "Cheesy Jalapeño", desc: "Cheese patty, jalapeño relish" },
      { name: "Pork", desc: "Pulled pork, Asian slaw, jalapeño, chilli garlic aioli" },
      { name: "Chilli Chicken", desc: "Chicken patty, chilli jam slaw, jalapeño mayo" },
    ],
  },
  sides: {
    label: "Sides",
    items: [
      { name: "Fries", desc: "", price: 8 },
      { name: "Cheezy Chilli Fries", desc: "", price: 12 },
      { name: "Flatbreads", desc: "2 flatbreads, pickle & garlic chilli aioli", price: 12 },
    ],
  },
  skewers: {
    label: "Skewers · Roast & Grilled",
    diet: ["VO", "GFO", "DFO"],
    price: 15,
    served: "Served with 2 flatbreads, pickled turnip & chilli garlic aioli",
    extra: "Extra: 1 skewer $9 · 2 flatbread $5 · pickle or dip $3",
    items: [
      { name: "Pineapple", desc: "Smoked paprika" },
      { name: "Paneer", desc: "Lemon, chilli" },
      { name: "Mushrooms", desc: "Cheese stuffed" },
      { name: "Chicken Breast", desc: "Creamy lemon" },
      { name: "Barramundi", desc: "Lemon butter" },
      { name: "Prawn", desc: "Chilli garlic" },
      { name: "Lamb", desc: "Chilli butter" },
      { name: "Beef", desc: "Whisky infused" },
    ],
  },
  kebabs: {
    label: "Kebab Platters",
    diet: ["VO", "GFO", "DFO"],
    price: 15,
    served: "Served with 2 flatbreads, pickled turnip & chilli garlic aioli",
    extra: "2 kebab $9 · 2 flatbread $5 · pickle or dip $3",
    items: [
      { name: "Paneer", desc: "" },
      { name: "Chicken", desc: "" },
      { name: "Goat", desc: "" },
    ],
  },
  bao: {
    label: "Bao Buns",
    diet: ["VO", "DFO"],
    price: 15,
    note: "2 pcs · choose your filling",
    fillings: ["Pork Belly", "Paneer", "Chicken", "Prawns"],
    flavours: ["Hot & Sour", "Garlic Chilli", "Asian Slaw"],
  },
  dumplings: {
    label: "Dumplings",
    diet: ["VO", "DFO"],
    price: 12,
    note: "5 pcs · steamed or fried",
    fillings: ["Veg", "Paneer", "Chicken", "Prawns"],
    sauces: [
      { name: "Ginger & Coriander (Soup)", price: 4, star: true },
      { name: "Tomato Sesame", price: 4 },
      { name: "Hot Chilli", price: 4 },
      { name: "Hot & Sour", price: 4 },
    ],
  },
};

// ─── FOSSEY'S DISTILLERY, THE CELLAR (retail / ship nationally) ──

export const SPIRITS = [
  // ─── Gin ────────────────────────────────────────────────
  {
    id: "GIN_ORIGINAL",
    name: "Original Gin",
    tagline: "Our flagship. Botanical forward, precisely crafted.",
    description:
      "The spirit that started it all. A classic Australian craft gin, juniper led with layers of coriander, angelica and hand selected botanicals, distilled for balance, versatility and effortless smoothness. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 8500,
    category: "retail",
    section: "Gin",
    image: "/img/original-gin-min.png",
    badge: "Flagship",
  },
  {
    id: "GIN_DESERT_LIME",
    name: "Desert Lime Gin",
    tagline: "Native desert lime, zesty and unmistakably Australian.",
    description:
      "A uniquely Australian gin infused with native desert lime, delivering bright citrus notes and a clean, refreshing finish. Crisp over tonic with a wedge of lime. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Gin",
    image: "/img/desert-lime-gin-min.png",
  },
  {
    id: "GIN_NAVAL",
    name: "Naval Strength Gin",
    tagline: "Bold, high-proof and intensely aromatic.",
    description:
      "A bold, higher proof expression for gin enthusiasts who want greater intensity and character. At 57% ABV it stands up to ice, tonic, or a confident sip neat, with an amplified botanical punch and a long, warming finish.",
    abv: "57%",
    size: "700ml",
    price: 9500,
    category: "retail",
    section: "Gin",
    image: "/img/navel-strength-gin-min.png",
    badge: "High Proof",
  },
  {
    id: "GIN_SHIRAZ",
    name: "Shiraz Gin",
    tagline: "Vibrant shiraz grapes, rich berry and colour.",
    description:
      "A vibrant gin infused with shiraz grapes, offering rich berry notes and a beautifully coloured, deep ruby finish. Silky botanicals with a warm, fruit forward nose. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 8500,
    category: "retail",
    section: "Gin",
    image: "/img/shop_bottles.jpg",
  },
  {
    id: "GIN_KAFFIR_LEAF",
    name: "Kaffir Leaf Gin",
    tagline: "Fresh and aromatic, a Southeast Asian twist.",
    description:
      "Fresh and aromatic, featuring fragrant kaffir lime leaf for a distinctive citrus and herbal profile. Herbaceous and lifted, beautiful in a gin and tonic or a fragrant martini. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Gin",
    image: "/img/shop_bottles.jpg",
  },
  {
    id: "GIN_TODDY",
    name: "Gin Toddy",
    tagline: "Warming, comforting, made for the cold.",
    description:
      "A warming and comforting spirit with botanical complexity and a smooth finish. Lower in proof and built for a hot toddy, gentle spice and honeyed warmth. Serve warm with lemon and honey. 27% ABV.",
    abv: "27%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Gin",
    image: "/img/shop_bottles.jpg",
  },
  {
    id: "GIN_XMAS_PUD",
    name: "Christmas Pudding Gin",
    tagline: "Festive flavours, warm spice and dried fruit.",
    description:
      "Inspired by festive flavours, featuring notes reminiscent of traditional Christmas pudding, dried fruit, warm spice and a hint of citrus peel. The taste of the holidays, poured. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Gin",
    image: "/img/shop_bottles.jpg",
    badge: "Seasonal",
  },
  {
    id: "GIN_CHILLI",
    name: "Chilli Gin",
    tagline: "A gentle chilli kick, spice and botanical freshness.",
    description:
      "A bold gin with a gentle chilli kick, balancing spice and botanical freshness. The heat builds slowly and finishes long. Perfect in a spicy margarita or over rocks with tonic. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 8500,
    category: "retail",
    section: "Gin",
    image: "/img/fosseys_chilli_gin.jpg",
  },
  {
    id: "GIN_GRAPEFRUIT",
    name: "Grapefruit Gin",
    tagline: "Bright citrus and a crisp, refreshing finish.",
    description:
      "Bright citrus character with refreshing ruby grapefruit notes and a crisp finish. Bittersweet and blush toned, made for a Paloma or a long, cold spritz. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Gin",
    image: "/img/shop_bottles.jpg",
  },

  // ─── Vodka ──────────────────────────────────────────────
  {
    id: "VODKA_DOUBLE",
    name: "Double Distilled Vodka",
    tagline: "Crystal clear, exceptionally smooth.",
    description:
      "Crystal clear and exceptionally smooth, crafted for purity and versatility. Double distilled for a silky smooth finish, the perfect blank canvas for classic and contemporary cocktails alike. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Vodka",
    image: "/img/shop_bottles.jpg",
  },
  {
    id: "VODKA_D_DOUBLE",
    name: "D Double Distilled Vodka",
    tagline: "A refined, premium expression.",
    description:
      "A refined premium vodka expression with enhanced smoothness and character. Meticulously distilled for an elevated, exceptionally clean pour, neat, on the rocks or as the base of your favourite serve. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Vodka",
    image: "/img/shop_bottles.jpg",
    badge: "Premium",
  },
  {
    id: "VODKA_BLOOD_ORANGE",
    name: "Blood Orange Vodka",
    tagline: "Vibrant, citrus forward, fresh in every pour.",
    description:
      "Infused with vibrant blood orange for a naturally vivid colour and a fresh, citrus forward experience. Drinks effortlessly on ice, in a spritz, or as the base of a Blood Orange Negroni. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 6000,
    category: "retail",
    section: "Vodka",
    image: "/img/blood-orange.png",
    badge: "Best Seller",
  },

  // ─── Whisky ─────────────────────────────────────────────
  {
    id: "WHISKY_SINGLE_MALT",
    name: "Single Malt Whisky",
    tagline: "Depth, richness and complexity, sip it slow.",
    description:
      "A handcrafted Australian single malt offering depth, richness and complexity. Notes of vanilla, dried fruit and gentle oak from careful barrel ageing. Made to sip slowly. 44% ABV.",
    abv: "44%",
    size: "700ml",
    price: 16000,
    category: "retail",
    section: "Whisky",
    image: "/img/singlemalt1.png",
  },
  {
    id: "WHISKY_PEATED",
    name: "Peated Single Malt Whisky",
    tagline: "Smoky, robust, with a lingering finish.",
    description:
      "A smoky and robust single malt with peated character and a lingering finish. Classic smoke and maritime notes softened by Australian oak. Every batch is different, get it while it lasts. 44% ABV.",
    abv: "44%",
    size: "700ml",
    price: 16500,
    category: "retail",
    section: "Whisky",
    image: "/img/real_still.jpg",
    badge: "Limited",
  },
  {
    id: "WHISKY_MONSOON_DROP",
    name: "Monsoon Drop",
    tagline: "A drop of monsoon in every pour.",
    description:
      "An elegant expression of earthy sophistication. Delicate smoky notes intertwine with subtle oak to create a velvety whisky that celebrates the timeless romance of the monsoon.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Whisky",
    image: "/img/real_still.jpg",
    badge: "Premium",
  },
  {
    id: "WHISKY_MALWA_MALT",
    name: "The Malwa Malt",
    tagline: "Double cask single malt, silky and luxurious.",
    description:
      "A harmonious blend of malt inspired depth and exceptional smoothness. This double cask single malt captivates the palate with its silky texture and lingering finish, a truly luxurious drinking experience. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Whisky",
    image: "/img/real_still.jpg",
  },
  {
    id: "WHISKY_BUTTERSCOTCH",
    name: "Butterscotch Whisky",
    tagline: "Where whisky meets sweet temptation.",
    description:
      "Fine whisky blended with the irresistible richness of creamy butterscotch. Smooth, indulgent and perfectly balanced for moments worth savouring. Beautiful over ice, in coffee, or across vanilla ice cream. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Whisky",
    image: "/img/shop_bottles.jpg",
  },

  // ─── Rum ────────────────────────────────────────────────
  {
    id: "RUM_HONEY",
    name: "Honey Rum",
    tagline: "Smooth rum, natural honey, warmth in every sip.",
    description:
      "A smooth rum infused with natural honey notes, delivering warmth and sweetness in every sip. Finished with Australian native honey for a gently sweet character. Sip neat or mix into a daiquiri. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 8500,
    category: "retail",
    section: "Rum",
    image: "/img/fosseys_honey_rum.jpg",
  },
  {
    id: "RUM_REDGUM",
    name: "Redgum Rum",
    tagline: "Rich character, depth and a smooth finish.",
    description:
      "An Australian inspired rum featuring rich character and depth with a smooth finish. Rested in redgum barrels for earthy wood notes and a warm, rounded complexity that feels distinctly Australian. 40% ABV.",
    abv: "40%",
    size: "700ml",
    price: 8500,
    category: "retail",
    section: "Rum",
    image: "/img/real_still.jpg",
  },

  // ─── Liqueurs ───────────────────────────────────────────
  {
    id: "LIQ_COFFEE",
    name: "Coffee Liqueur",
    tagline: "Rich roasted coffee, made for espresso martinis.",
    description:
      "Rich coffee flavours balanced with smooth spirit character for a luxurious drinking experience. Dark and velvety, the heart of a perfect espresso martini or a decadent pour over ice. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Liqueurs",
    image: "/img/shop_bottles.jpg",
  },

  // ─── Indian Series ──────────────────────────────────────
  {
    id: "IND_MANGO",
    name: "Mango Gin · Aam Papad",
    tagline: "Ripe mango and nostalgic aam papad.",
    description:
      "Inspired by the nostalgic flavours of Indian aam papad, combining ripe mango notes with premium craft gin. Sweet, tangy and utterly moreish. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_JAMUN",
    name: "Jamun Gin",
    tagline: "The unique flavour of Indian jamun.",
    description:
      "A distinctive gin inspired by the unique flavour of Indian jamun fruit, tart, dark and fruity, the tangy and sweet taste of childhood summers, captured in a vivid pour. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_LAHORI_JEERA",
    name: "Lahori Jeera Gin",
    tagline: "Bold, nostalgic Lahori jeera spice.",
    description:
      "A bold and nostalgic gin inspired by traditional Lahori jeera flavours, warm cumin and spice woven through craft botanicals. Distinctive and unforgettable. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_BOTANICA",
    name: "Botanica Gin",
    tagline: "Traditional craft, contemporary flavour.",
    description:
      "A refined botanical gin balancing traditional gin craftsmanship with contemporary flavour. Elegant, layered and endlessly sippable, neat or in a classic gin and tonic. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_still.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_ROSE_LYCHEE",
    name: "Rose Lychee Gin",
    tagline: "Delicate rose and sweet lychee.",
    description:
      "Delicate floral rose notes paired with sweet lychee for a luxurious drinking experience. Soft, fragrant and delicately bittersweet, with a blush toned pour made for a spritz. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_SAFFRON",
    name: "Saffron Vodka · Kesar",
    tagline: "Precious saffron, golden and elegant.",
    description:
      "Luxurious notes of precious saffron with subtle warmth and elegant character. Kashmiri kesar steeped into a smooth vodka for a golden hue and an opulent, honeyed floral note. Sip chilled and slow. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_still.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_PAAN",
    name: "Paan Vodka",
    tagline: "Betel leaf, spice and nostalgia.",
    description:
      "Inspired by the iconic Indian after-dinner indulgence, delivering unmistakable spice and nostalgia. Paan, the betel leaf preparation, reimagined as a sweet, herbal and utterly unique spirit. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_POPCORN",
    name: "Popcorn Vodka",
    tagline: "Playful buttery sweetness, a modern twist.",
    description:
      "Playful buttery sweetness with a modern twist. Toasty, sweet caramel popcorn character that's a crowd pleaser neat or in a sweet, indulgent sour. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_cocktail.jpg",
    badge: "Indian Series",
  },
  {
    id: "IND_BLACK",
    name: "Black Vodka",
    tagline: "Bold, mysterious, unforgettable.",
    description:
      "Bold, mysterious and unforgettable. A striking jet black pour with a smooth, clean character, made to be the centrepiece of any cocktail. 38% ABV.",
    abv: "38%",
    size: "700ml",
    price: null,
    category: "retail",
    section: "Indian Series",
    image: "/img/real_still.jpg",
    badge: "Indian Series",
  },
];

// ─── SPIRIT CATEGORIES (The Cellar navigation) ────────────
//  Order + evocative blurbs that make each category sell.

export const SPIRIT_CATEGORIES = [
  {
    key: "All",
    label: "All Spirits",
    blurb: "Every bottle we craft at Fossey's Distillery, small batch, made in Carlton, shipped across Australia.",
    accent: "#FF9F1C",
  },
  {
    key: "Gin",
    label: "Gin",
    blurb: "Juniper led and botanical forward. From our flagship Original to the slow-burn Chilli and barrel rich Shiraz.",
    accent: "#8FBF7F",
  },
  {
    key: "Vodka",
    label: "Vodka",
    blurb: "Clean, bright and endlessly mixable. Our Blood Orange is the bottle that never lasts long.",
    accent: "#E8724C",
  },
  {
    key: "Whisky",
    label: "Whisky",
    blurb: "Australian single malt, aged with patience. Sip it slow, the peated release is single barrel and limited.",
    accent: "#C79A4B",
  },
  {
    key: "Rum",
    label: "Rum",
    blurb: "Cane spirit finished the Australian way, native honey and redgum barrels for a warm, rounded pour.",
    accent: "#B5793E",
  },
  {
    key: "Liqueurs",
    label: "Liqueurs",
    blurb: "Flavour led creations for the sweeter moment, rich coffee liqueur made for dessert pours and the perfect espresso martini.",
    accent: "#A6673A",
  },
  {
    key: "Indian Series",
    label: "Indian Series",
    blurb: "Our signature. Mango, jamun, saffron, paan and rose lychee, the flavour memory of the subcontinent, distilled into gin and vodka.",
    accent: "#D96BA0",
  },
];

// ─── EVENTS ───────────────────────────────────────────────

// The weekly line-up. `recurring` marks a repeating night (no fixed date);
// `highlights` are the quick bullet chips; `priceUnit` labels the price.
export const EVENTS = [
  {
    id: "EVT_GIN_FLIGHT",
    title: "Gin Tasting Flight",
    tagline: "3 gins. Endless flavours.",
    recurring: "Every Wednesday",
    startTime: "From 5:00pm",
    category: "Tastings",
    description:
      "Our Wednesday tasting flight. Choose any 3 from 11+ house distilled Fossey's gin flavours, poured across three Glencairn glasses. Taste, sip and discover the whole range for just $10.",
    highlights: ["Choose any 3", "11+ gin flavours", "House distilled"],
    priceFrom: 1000,
    priceUnit: "per flight",
    image: "/img/event_gin_flight.jpg",
    bookable: true,
  },
  {
    id: "EVT_LADIES_NIGHT",
    title: "Ladies Night",
    tagline: "Cocktails, share plates & glamour.",
    recurring: "Every Thursday",
    startTime: "From 5:00pm",
    category: "Ladies Night",
    description:
      "Gather your crew for our signature Ladies Night. A special menu of 2 cocktails and 2 small share plates for $19.99 per person — glamour, good drinks and even better company.",
    highlights: ["2 cocktails", "2 small share plates", "Special menu"],
    priceFrom: 1999,
    priceUnit: "per person",
    image: "/img/event_ladies_night.jpg",
    bookable: true,
  },
  {
    id: "EVT_FRIDAY_PASSPORT",
    title: "Friday Passport",
    tagline: "3 cocktails or 3 house drinks.",
    recurring: "Every Friday",
    startTime: "Until 1:00am",
    category: "Passport",
    description:
      "Kick off the weekend with the Cozy Passport — 3 cocktails or 3 house drinks for $25, available until 1am. Pour, sip, enjoy. Walk in or dine in.",
    highlights: ["3 cocktails", "or 3 house drinks", "Until 1am"],
    priceFrom: 2500,
    priceUnit: "passport",
    image: "/img/event_passport.jpg",
    bookable: true,
  },
  {
    id: "EVT_FRIENDS_FLIGHT",
    title: "Friends Flight",
    tagline: "Made to share.",
    recurring: "Available daily",
    startTime: "Walk in · Dine in · Takeaway",
    category: "Share Plates",
    description:
      "Good food, great drinks, better together. A shared feast of a cocktail jug, bao, skewers and a shared platter for $49 — the easiest way to do a group night at the Cozy Box.",
    highlights: ["Cocktail jug", "Bao", "Skewers", "Shared platter"],
    priceFrom: 4900,
    priceUnit: "to share",
    image: "/img/friends-flight.jpg",
    bookable: true,
  },
  {
    id: "EVT_MASTERCLASS",
    title: "Fossey's Cocktail Masterclass",
    tagline: "Shake, stir & sip with our head bartender.",
    date: "2026-08-15",
    startTime: "5:00pm",
    category: "Masterclass",
    description:
      "A hands-on 90-minute masterclass using the full Fossey's Distillery range — gin, vodka, whisky and rum. You'll make three cocktails, enjoy matched bites, and leave with a recipe card.",
    highlights: ["3 cocktails", "Matched bites", "90 minutes"],
    priceFrom: 8900,
    priceUnit: "per person",
    image: "/img/menu_food_drinks.jpg",
    bookable: true,
  },
  {
    id: "EVT_INDIAN_SERIES",
    title: "Indian Series Tasting Night",
    tagline: "Paan · Jamun · Saffron Kesar.",
    date: "2026-08-22",
    startTime: "6:00pm",
    category: "Tastings",
    description:
      "A curated evening exploring Fossey's Indian Series — unique spirits inspired by the flavours of the subcontinent. Guided pours, paired Indian tapas, and the story behind each bottle.",
    highlights: ["Guided pours", "Paired tapas", "Indian Series"],
    priceFrom: 6500,
    priceUnit: "per person",
    image: "/img/real_cocktail.jpg",
    bookable: true,
  },
];

// ─── PRIVATE EVENTS & FUNCTIONS ───────────────────────────
//  Extracted from Cozy Box Private Events brochure.

export const PACKAGES = [
  {
    id: "PKG_SEMI_PRIVATE",
    name: "Semi-Private Booth",
    blurb:
      "Your own reserved corner of the Cozy Box, perfect for birthday dinners, celebrations or a special night out with your crew. Includes a dedicated section of the bar with your own booth and cocktail service.",
    priceFrom: 45000,
    minimumSpend: "$450 minimum spend",
    capacity: "8 to 20 guests",
    inclusions: [
      "Reserved booth for the evening",
      "Dedicated cocktail server",
      "Choice of sharing or canapé menu",
      "Welcome Fossey's cocktail tower",
      "Custom birthday or occasion signage",
    ],
    image: "/img/private_events.jpg",
    brochureUrl: null,
    enquiryNote: "Minimum spend applies. Includes food and beverages.",
  },
  {
    id: "PKG_PRIVATE_HIRE",
    name: "Exclusive Venue Hire",
    blurb:
      "Take over the entire Cozy Box, the bar, the DJ booth, the neon, the lot. Our events team will work with you on a completely bespoke experience using Fossey's Distillery spirits as the centrepiece.",
    priceFrom: 250000,
    minimumSpend: "From $2,500 (custom quote)",
    capacity: "Up to 120 guests",
    inclusions: [
      "Exclusive use of the full venue",
      "Dedicated bar staff & event manager",
      "DJ booth & full sound system",
      "Custom cocktail menu featuring Fossey's spirits",
      "Canapé or sit-down menu options",
      "Event styling & setup",
    ],
    image: "/img/hero_club.jpg",
    brochureUrl: null,
    enquiryNote: "Quote tailored to your event. Contact our events team.",
  },
  {
    id: "PKG_CORPORATE",
    name: "Corporate & Functions",
    blurb:
      "End-of-year parties, product launches, team celebrations and client events. Flexible semi-private or full venue hire, with tailored beverage packages built around the Fossey's Distillery range.",
    priceFrom: 90000,
    minimumSpend: "From $900 (custom packages available)",
    capacity: "20 to 80 guests",
    inclusions: [
      "Semi-private or full venue options",
      "Beverage packages or consumption bar",
      "Canapé & grazing board menus",
      "AV & presentation support on request",
      "Fossey's distillery spirit showcase",
    ],
    image: "/img/whats_on.jpg",
    brochureUrl: null,
    enquiryNote: "Flexible packages for morning, lunch, and evening functions.",
  },
  {
    id: "PKG_MASTERCLASS",
    name: "Private Cocktail Masterclass",
    blurb:
      "A hands-on cocktail experience led by our head bartender, built entirely around the Fossey's Distillery range. Shake, stir and sip, perfect for hens, team building, birthdays or anyone who loves a good drink.",
    priceFrom: 12000,
    minimumSpend: "$120 per person (minimum 6 guests)",
    capacity: "6 to 16 guests",
    inclusions: [
      "90-minute guided masterclass with head bartender",
      "Three cocktails made and consumed per guest",
      "Matched Indian tapas bites",
      "Fossey's take-home recipe card",
      "Bottle of Fossey's gin for groups of 10+",
    ],
    image: "/img/cocktail_passport.jpg",
    brochureUrl: null,
    enquiryNote: "Available Wednesday to Sunday. Book at least 7 days ahead.",
  },
];

// ─── COCKTAIL PASSPORT MEMBERSHIP ─────────────────────────

export const PASSPORT_PLANS = [
  {
    id: "PLAN_PASSPORT_MONTHLY",
    name: "Cocktail Passport",
    subtitle: "Monthly",
    cadence: "MONTHLY",
    price: 3900,
    perks: [
      "1 signature Fossey's cocktail on the house, every visit",
      "2× passport stamps (loyalty points) on all spend",
      "Skip-the-line entry on event and DJ nights",
      "Member-only invites to Fossey's masterclasses & tastings",
    ],
    cta: "Join Monthly",
  },
  {
    id: "PLAN_PASSPORT_ANNUAL",
    name: "Cocktail Passport",
    subtitle: "Annual",
    cadence: "ANNUAL",
    price: 39000,
    perks: [
      "Everything in Monthly, all year round",
      "Complete the passport → unlock a private masterclass for 4",
      "Priority RSVP to Ladies Night, launch parties & exclusive events",
      "Early access to limited Fossey's Distillery releases",
      "Bottle of Fossey's Original Gin on sign-up",
    ],
    cta: "Join Annual",
    highlight: true,
  },
];

export const PASSPORT_TIERS = [
  { name: "Free signature cocktail", stamps: 50 },
  { name: "Cocktail flight for two", stamps: 150 },
  { name: "Private cocktail masterclass", stamps: 300 },
];

// ─── THE COZY PASSPORT (travel-stamp loyalty card) ────────
//  Mirrors the physical passport: $25 buys a 3-drink block, one stamp
//  per drink, 15 stamps completes the passport for a $25 gift voucher.

export const PASSPORT = {
  blockPrice: 2500,      // $25 per 3-drink block (AUD cents)
  drinksPerBlock: 3,
  totalStamps: 15,
  blocks: 5,             // 15 stamps = 5 blocks of 3
  rewardLabel: "$25 gift voucher",
  tagline: "Sip. Stamp. Repeat.",
  subtitle: "Good drinks. Great times.",
  stampMotto: ["Good Drinks", "Good Times"],
  steps: [
    { icon: "ticket", title: "Get your passport", text: "Pick up your Cozy Passport at the bar for $25 — your ticket to good drinks and even better times." },
    { icon: "glass", title: "Choose any 3 drinks", text: "Enjoy any three cocktails or spirits from our menu. Choose your favourites." },
    { icon: "stamp", title: "Earn a stamp per drink", text: "One drink equals one stamp. Watch your passport start to fill up." },
    { icon: "repeat", title: "Top up your block", text: "After 3 stamps, grab another $25 drink block and keep the good times going." },
    { icon: "star", title: "Collect 15 stamps", text: "Gather your stamps over as many visits as you like. No rush, no expiry pressure." },
    { icon: "gift", title: "Unlock a $25 voucher", text: "Complete the passport and we'll hand you a $25 gift voucher. Our way of saying thank you." },
  ],
  terms: [
    "1 stamp per eligible drink",
    "15 stamps required to complete a passport",
    "$25 voucher issued upon completion",
    "Not redeemable for cash",
    "One voucher per passport",
    "Management reserves all rights",
  ],
};

// ─── REVIEWS ──────────────────────────────────────────────

export const REVIEWS = [
  {
    quote: "Easily the best cocktail bar in Carlton. The Redgum Old Fashioned is unreal.",
    author: "Sarah Mitchell",
    location: "Melbourne",
  },
  {
    quote: "Indian flavours with a modern edge, bold but refined. The tapas are made for sharing.",
    author: "Daniel Harris",
    location: "Carlton",
  },
  {
    quote: "A beautifully curated night. Every plate and every pour felt intentional.",
    author: "Oliver Bennett",
    location: "Fitzroy",
  },
  {
    quote: "Neon Saturdays go off. Great energy, great drinks, great crowd.",
    author: "Priya Malhotra",
    location: "Melbourne",
  },
  {
    quote: "From the first sip you can tell how much thought goes into the menu. Flawless.",
    author: "Emily Thompson",
    location: "South Yarra",
  },
  {
    quote: "The Indian Series tasting was a revelation. Paan Gin is unlike anything I've had.",
    author: "Arjun Kapoor",
    location: "Brunswick",
  },
];

// ─── HOME PAGE CONTENT ────────────────────────────────────

export const HERO = {
  eyebrow: "209 Lygon St · Carlton · Melbourne",
  headline: ["Crafted spirits.", "Indian soul.", "Late nights."],
  sub: "Fossey's Distillery meets Carlton's best-kept secret. Cocktails poured from our own still, Indian tapas, live DJs and a vibe that doesn't quit.",
  cta: { label: "Book a Table", to: "/book" },
  ctaSecondary: { label: "Explore the Cellar", to: "/shop" },
  videoPoster: "/img/hero_club.jpg",
  videoSrc: "/video/hero.mp4",
};

export const COCKTAILS_SHOWCASE = [
  { id: "SC_1", name: "Redgum Old Fashioned", tag: "Rum · Bitters · Native Honey", image: "/img/real_cocktail.jpg" },
  { id: "SC_2", name: "Chilli Gin Margarita", tag: "Gin · Agave · Lime · Tajín", image: "/img/menu_food_drinks.jpg" },
  { id: "SC_3", name: "Blood Orange Spritz", tag: "Vodka · Prosecco · Twist", image: "/img/real_cocktail.jpg" },
  { id: "SC_4", name: "Peated Whisky Sour", tag: "Peated Malt · Citrus · Foam", image: "/img/real_still.jpg" },
  { id: "SC_5", name: "Masala Martini", tag: "Chai Vodka · Vermouth · Cardamom", image: "/img/real_interior.jpg" },
  { id: "SC_6", name: "Paan Negroni", tag: "Indian Series · Campari · Vermouth", image: "/img/real_cocktail.jpg" },
];

// ─── HELPERS ──────────────────────────────────────────────

export const formatPrice = (cents) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(
    (cents || 0) / 100
  );

export const CATALOG_FOOD = CATALOG.filter((i) => i.category === "food");
export const CATALOG_DRINKS = CATALOG.filter((i) => i.category === "drink");
export const CATALOG_RETAIL = SPIRITS;
