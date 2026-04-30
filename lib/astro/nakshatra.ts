import type { DashaLord, NakshatraPlacement } from "@/types/kundali";

export const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
] as const;

export const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashira",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishtha",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati"
] as const;

export const DASHA_SEQUENCE: DashaLord[] = [
  "Ketu",
  "Venus",
  "Sun",
  "Moon",
  "Mars",
  "Rahu",
  "Jupiter",
  "Saturn",
  "Mercury"
];

export const DASHA_YEARS: Record<DashaLord, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

export const NAKSHATRA_SPAN = 360 / 27;
export const PADA_SPAN = 360 / 108;

/**
 * Normalizes degrees into the 0-360 range.
 */
export function normalizeDegrees(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/**
 * Returns the sidereal sign index for a longitude.
 */
export function getSignIndexFromLongitude(longitude: number): number {
  return Math.floor(normalizeDegrees(longitude) / 30);
}

/**
 * Returns the sidereal sign name for a longitude.
 */
export function getRashiFromLongitude(longitude: number): string {
  return ZODIAC_SIGNS[getSignIndexFromLongitude(longitude)];
}

/**
 * Returns full nakshatra metadata for a sidereal longitude.
 */
export function getNakshatraDetails(longitude: number): NakshatraPlacement {
  const normalizedLongitude = normalizeDegrees(longitude);
  const nakshatraIndex = Math.floor(normalizedLongitude / NAKSHATRA_SPAN);
  const offsetWithinNakshatra = normalizedLongitude % NAKSHATRA_SPAN;
  const pada = Math.floor(offsetWithinNakshatra / PADA_SPAN) + 1;
  const lord = DASHA_SEQUENCE[nakshatraIndex % DASHA_SEQUENCE.length];

  return {
    index: nakshatraIndex,
    name: NAKSHATRAS[nakshatraIndex],
    pada,
    lord
  };
}
