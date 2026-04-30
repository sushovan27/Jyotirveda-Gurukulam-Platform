import { calculateSwissAyanamsa } from "@/lib/astro/swisseph";
import { normalizeDegrees } from "@/lib/astro/nakshatra";

/**
 * Computes Lahiri ayanamsa from Swiss Ephemeris for a UT Julian day.
 */
export async function getLahiriAyanamsa(julianDayUt: number): Promise<number> {
  return calculateSwissAyanamsa(julianDayUt);
}

/**
 * Converts a tropical longitude to a Lahiri sidereal longitude.
 */
export function toSiderealLongitude(tropicalLongitude: number, ayanamsa: number): number {
  return normalizeDegrees(tropicalLongitude - ayanamsa);
}
