"""Static content for Cozy Box (Phase 1). Prices are in cents (AUD).
Modelled on the real Cozy Box by Fossey's Distillery menu & distillery range.
Square integration replaces these reads in Phase 2."""

LOCATION = {
    "id": "LOC_CARLTON",
    "name": "Cozy Box by Fossey's Distillery",
    "address": "209 Lygon St, Carlton VIC 3053, Australia",
    "phone": "+61 3 9100 1916",
    "email": "hello@cozybox.au",
    "instagram": "https://www.instagram.com/cozybox_au/",
    "timezone": "Australia/Melbourne",
    "hours": "Wed–Thu 4pm–10pm · Fri 4pm–12am · Sat 12pm–12am · Sun 12pm–10pm",
}

CATALOG = [
    # ── Small Plates ──
    {"id": "ITEM_DUCK_SLIDER", "name": "Duck Slider", "description": "Pulled duck, pineapple chili jam, asian slaw, honey curd lime & butter-toasted pav.", "price": 900, "category": "food", "section": "Small Plates", "dietary": []},
    {"id": "ITEM_VEG_SLIDER", "name": "Veg Slider", "description": "Aloo tikki, carrot-cabbage-onion, tamarind & mint chutney & butter toasted pav.", "price": 700, "category": "food", "section": "Small Plates", "dietary": ["V"]},
    {"id": "ITEM_GOAT_SLIDER", "name": "Goat Slider", "description": "Mint chutney, pickled onion, garlic yogurt mayo, butter-toasted pav.", "price": 900, "category": "food", "section": "Small Plates", "dietary": []},
    # ── From the Garden ──
    {"id": "ITEM_BOMBAY_CHAAT", "name": "Bombay Chaat", "description": "Cracker, avocado, pomegranate, tamarind, yogurt & coriander.", "price": 2100, "category": "food", "section": "From the Garden", "dietary": ["V"]},
    {"id": "ITEM_PUMPKIN_KATAIFI", "name": "Pumpkin Kataifi", "description": "Khata meetha pumpkin, harissa honey, pistachio.", "price": 1400, "category": "food", "section": "From the Garden", "dietary": ["V"]},
    # ── Large Plates ──
    {"id": "ITEM_DAL_CHAWAL", "name": "Dal Chawal", "description": "Papadum, yellow dal, rice, tomato-onion kachumber & raita.", "price": 1900, "category": "food", "section": "Large Plates", "dietary": ["V", "GF", "DFO"]},
    {"id": "ITEM_TANDOORI_DUCK", "name": "Tandoori Duck", "description": "Indian spiced broccolini, tandoori duck, orange coconut yogurt.", "price": 3400, "category": "food", "section": "Large Plates", "dietary": ["GF"]},
    {"id": "ITEM_BUTTER_CHICKEN", "name": "Butter Chicken", "description": "Waffle naan, butter chicken pate, chicken tikka & pistachios crumble.", "price": 3600, "category": "food", "section": "Large Plates", "dietary": ["DFO"]},
    {"id": "ITEM_LAMB_RIBS", "name": "Lamb Ribs", "description": "Khata meeta pumpkin, almond korma, tandoori spiced lamb & rice cakes.", "price": 4200, "category": "food", "section": "Large Plates", "dietary": ["GF", "DFO"]},
    # ── Desserts ──
    {"id": "ITEM_GAJER_HALWA", "name": "Gajer Halwa", "description": "Reconstructed carrot pudding.", "price": 1600, "category": "food", "section": "Desserts", "dietary": ["GF"]},
    {"id": "ITEM_TASTING_MENU", "name": "Five-Dish Tasting Menu (pp)", "description": "Put yourself in the chef's hands — a curated five-dish selection of seasonal plates. Minimum 2 guests.", "price": 4900, "category": "food", "section": "Chef's Selection", "dietary": []},

    # ── Cocktails ──
    {"id": "DRK_REDGUM_OLD_FASHIONED", "name": "Redgum Old Fashioned", "description": "Fossey's Redgum Honey Rum, bitters, native honey, smoked orange.", "price": 2400, "category": "drink", "section": "Signature Cocktails", "dietary": []},
    {"id": "DRK_CHILLI_MARG", "name": "Chilli Gin Margarita", "description": "Fossey's Chilli Gin, agave, lime, tajín rim — a slow warming finish.", "price": 2300, "category": "drink", "section": "Signature Cocktails", "dietary": []},
    {"id": "DRK_BLOOD_ORANGE_SPRITZ", "name": "Blood Orange Spritz", "description": "Fossey's Blood Orange Vodka, prosecco, soda, blood orange twist.", "price": 2200, "category": "drink", "section": "Signature Cocktails", "dietary": []},
    {"id": "DRK_PEATED_SOUR", "name": "Peated Whisky Sour", "description": "Single barrel peated malt, citrus, aquafaba, smoked bitters.", "price": 2600, "category": "drink", "section": "Signature Cocktails", "dietary": []},
    {"id": "DRK_MASALA_MARTINI", "name": "Masala Martini", "description": "Spiced chai-washed vodka, vermouth, cardamom — stirred & cold.", "price": 2400, "category": "drink", "section": "Signature Cocktails", "dietary": []},
    {"id": "DRK_MANGO_LASSI_SOUR", "name": "Mango Lassi Sour", "description": "Gin, alphonso mango, yogurt, lime, saffron.", "price": 2200, "category": "drink", "section": "Signature Cocktails", "dietary": []},

    # ── Distillery retail (The Cellar) — real Fossey's range ──
    {"id": "GIN_ORIGINAL", "name": "Original Gin", "description": "Botanical-forward London dry, crafted with precision. 40% ABV · 700ml.", "price": 8500, "category": "retail", "section": "Gin", "dietary": []},
    {"id": "GIN_SHIRAZ", "name": "Shiraz Gin", "description": "Barossa shiraz steeped over the original botanicals. 40% ABV · 700ml.", "price": 8500, "category": "retail", "section": "Gin", "dietary": []},
    {"id": "GIN_NAVAL", "name": "Naval Strength Gin", "description": "Bold, high-proof and intensely aromatic. 57% ABV · 700ml.", "price": 9500, "category": "retail", "section": "Gin", "dietary": []},
    {"id": "GIN_CHILLI", "name": "Chilli Gin", "description": "Botanical gin with a slow build of warming chilli. 40% ABV · 500ml.", "price": 8500, "category": "retail", "section": "Gin", "dietary": []},
    {"id": "VODKA_BLOOD_ORANGE", "name": "Blood Orange Vodka", "description": "Bright, citrus-forward vodka infused with blood orange. 40% ABV · 700ml.", "price": 6000, "category": "retail", "section": "Vodka", "dietary": []},
    {"id": "WHISKY_SINGLE_MALT", "name": "Single Malt Whisky", "description": "Rich, balanced single malt with depth and character. 44% ABV · 500ml.", "price": 16000, "category": "retail", "section": "Whisky", "dietary": []},
    {"id": "WHISKY_PEATED", "name": "Peated Single Malt", "description": "Smoky, single-barrel peated malt. 44% ABV · 500ml.", "price": 16500, "category": "retail", "section": "Whisky", "dietary": []},
    {"id": "RUM_HONEY", "name": "Honey Rum", "description": "Small-batch rum mellowed with native honey. 40% ABV · 700ml.", "price": 8500, "category": "retail", "section": "Rum", "dietary": []},
    {"id": "RUM_REDGUM", "name": "Redgum Rum", "description": "Warm, rounded rum with a smooth redgum finish. 40% ABV · 700ml.", "price": 8500, "category": "retail", "section": "Rum", "dietary": []},
    {"id": "IND_PAAN", "name": "Paan Gin Liquor", "description": "Indian Series — betel-leaf paan, sweet and aromatic. 35% ABV · 700ml.", "price": 9700, "category": "retail", "section": "Indian Series", "dietary": []},
    {"id": "IND_KALA_KHATTA", "name": "Kala Khatta Gin Liquor", "description": "Indian Series — tangy, dark jamun kala khatta. 36.5% ABV · 700ml.", "price": 9700, "category": "retail", "section": "Indian Series", "dietary": []},
    {"id": "IND_ROYAL_ATTAR", "name": "Royal Attar Vodka", "description": "Indian Series — rose & saffron royal attar. 35.4% ABV · 700ml.", "price": 9700, "category": "retail", "section": "Indian Series", "dietary": []},
]

EVENTS = [
    {"id": "EVT_LADIES_NIGHT", "title": "Ladies Night", "tagline": "Cocktails, beats & glamour", "date": "2026-07-23", "startTime": "19:00", "category": "Signature", "description": "Our signature Ladies Night returns — 2-for-1 signature cocktails before 9pm, a live DJ, and a sparkling welcome on arrival. Gather your crew for a night of glamour at the Cozy Box bar.", "priceFrom": 0, "image": "/img/ladies_night.jpg", "bookable": True},
    {"id": "EVT_DJ_SATURDAYS", "title": "Neon Saturdays", "tagline": "Resident DJs all night", "date": "2026-07-04", "startTime": "21:00", "category": "Live", "description": "Our resident DJs take over the booth with house, disco and R&B until late. Lasers, haze and the full neon treatment.", "priceFrom": 2000, "image": "/img/whats_on.jpg", "bookable": True},
    {"id": "EVT_PASSPORT_LAUNCH", "title": "Cocktail Passport Launch Party", "tagline": "Be a founding member", "date": "2026-07-11", "startTime": "18:30", "category": "Launch", "description": "Celebrate the launch of the Cozy Box Cocktail Passport. Founding members get a complimentary first stamp, a guided tasting of the new menu, and a Fossey's welcome pour.", "priceFrom": 0, "image": "/img/cocktail_passport.jpg", "bookable": True},
    {"id": "EVT_MASTERCLASS", "title": "Fossey's Cocktail Masterclass", "tagline": "Shake, stir & sip", "date": "2026-07-18", "startTime": "17:00", "category": "Masterclass", "description": "A hands-on 90-minute masterclass with our head bartender using Fossey's distillery spirits. Make (and drink) three cocktails, with bites to match.", "priceFrom": 8900, "image": "/img/menu_food_drinks.jpg", "bookable": True},
]

PACKAGES = [
    {"id": "PKG_BIRTHDAY", "name": "Birthday Package", "blurb": "Make your birthday unforgettable with a reserved booth, bottle service and a cocktail tower for the table.", "priceFrom": 45000, "capacity": "8–20 guests", "inclusions": ["Reserved booth for the night", "Cocktail tower on arrival", "Choice of grazing or canapé menu", "Personalised birthday cocktail"], "image": "/img/private_events.jpg", "brochureUrl": "/brochures/fosseys-distillery-catalogue.pdf"},
    {"id": "PKG_PRIVATE_HIRE", "name": "Exclusive Venue Hire", "blurb": "Take over the whole Cozy Box for a private event — full bar, DJ booth and dedicated event team.", "priceFrom": 250000, "capacity": "up to 120 guests", "inclusions": ["Exclusive use of the venue", "Dedicated bar staff & event manager", "DJ booth & sound system", "Custom cocktail menu with Fossey's spirits"], "image": "/img/hero_club.jpg", "brochureUrl": "/brochures/fosseys-distillery-catalogue.pdf"},
    {"id": "PKG_CORPORATE", "name": "Corporate & Functions", "blurb": "End-of-year parties, product launches and team nights — flexible spaces and tailored beverage packages.", "priceFrom": 90000, "capacity": "20–80 guests", "inclusions": ["Semi-private or full venue options", "Beverage packages or consumption bar", "Canapé & grazing menus", "AV & presentation support"], "image": "/img/whats_on.jpg", "brochureUrl": "/brochures/fosseys-distillery-catalogue.pdf"},
    {"id": "PKG_MASTERCLASS", "name": "Private Cocktail Masterclass", "blurb": "A guided, hands-on cocktail experience for your group using Fossey's distillery range.", "priceFrom": 12000, "capacity": "6–16 guests", "inclusions": ["90-minute guided masterclass", "Three cocktails per guest", "Matching bar bites", "Take-home recipe card"], "image": "/img/cocktail_passport.jpg", "brochureUrl": "/brochures/fosseys-distillery-catalogue.pdf"},
]

PASSPORT_PLANS = [
    {"id": "PLAN_PASSPORT_MONTHLY", "name": "Cocktail Passport — Monthly", "cadence": "MONTHLY", "price": 3900, "perks": ["1 signature cocktail on the house every visit", "2× passport stamps (loyalty points) on all spend", "Skip-the-line entry on event nights", "Member-only masterclasses & tastings"]},
    {"id": "PLAN_PASSPORT_ANNUAL", "name": "Cocktail Passport — Annual", "cadence": "ANNUAL", "price": 39000, "perks": ["Everything in Monthly", "Complete the passport → unlock a private cocktail masterclass for 4", "Priority RSVP to Ladies Night & launch parties", "Early access to limited Fossey's distillery releases"]},
]

REVIEWS = [
    {"quote": "Easily the best cocktail bar in Carlton — the Redgum Old Fashioned is unreal.", "author": "Sarah Mitchell"},
    {"quote": "Indian flavours with a modern edge, bold but refined. The tapas are made for sharing.", "author": "Daniel Harris"},
    {"quote": "A beautifully curated night out. Every plate and every pour felt intentional.", "author": "Oliver Bennett"},
    {"quote": "Neon Saturdays go off. Great energy, great drinks, great crowd.", "author": "Priya Malhotra"},
    {"quote": "From the first sip you can tell how much thought goes into the menu. Flawless.", "author": "Emily Thompson"},
]
