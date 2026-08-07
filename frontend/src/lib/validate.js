// Australian-aware form validators, shared by the booking + checkout forms.

export const isValidEmail = (e) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());

// A real name: letters (any language), spaces, hyphens, apostrophes, dots.
// No digits or gibberish symbols; at least 2 characters.
export const isValidName = (n) =>
  /^[\p{L}][\p{L} .'’-]{1,}$/u.test((n || "").trim());

// Accepts AU mobiles (04xx xxx xxx) and landlines (02/03/07/08 + 8 digits),
// with or without a +61 country code, and tolerates spaces/dashes/brackets.
export const isValidAuPhone = (raw) => {
  const s = (raw || "").replace(/[\s()\-.]/g, "");
  return /^(?:\+?61|0)[2-478]\d{8}$/.test(s);
};

// 4-digit Australian postcode.
export const isValidAuPostcode = (p) => /^\d{4}$/.test((p || "").trim());

export const AU_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
