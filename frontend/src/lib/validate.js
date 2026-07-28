// Australian-aware form validators, shared by the booking + checkout forms.

export const isValidEmail = (e) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());

// Accepts AU mobiles (04xx xxx xxx) and landlines (02/03/07/08 + 8 digits),
// with or without a +61 country code, and tolerates spaces/dashes/brackets.
export const isValidAuPhone = (raw) => {
  const s = (raw || "").replace(/[\s()\-.]/g, "");
  return /^(?:\+?61|0)[2-478]\d{8}$/.test(s);
};

// 4-digit Australian postcode.
export const isValidAuPostcode = (p) => /^\d{4}$/.test((p || "").trim());

export const AU_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];
