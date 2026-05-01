import type { DivisionalCharts, PlanetDivisionalPlacement, PlanetPosition } from "@/types/kundali";
import { toSiderealLongitude } from "@/lib/astro/ayanamsa";
import { getWholeSignHouse } from "@/lib/astro/houses";
import { getNakshatraDetails, getRashiFromLongitude, normalizeDegrees } from "@/lib/astro/nakshatra";
import { SWE_CONSTANTS, SwissEphemerisError, calculateSwissBody, getSwissEphemerisFlags } from "@/lib/astro/swisseph";

interface SwissPlanetDefinition {
  name: Exclude<PlanetPosition["name"], "Ketu">;
  body: number;
}

const PLANET_DEFINITIONS: SwissPlanetDefinition[] = [
  { name: "Sun", body: SWE_CONSTANTS.SE_SUN },
  { name: "Moon", body: SWE_CONSTANTS.SE_MOON },
  { name: "Mars", body: SWE_CONSTANTS.SE_MARS },
  { name: "Mercury", body: SWE_CONSTANTS.SE_MERCURY },
  { name: "Jupiter", body: SWE_CONSTANTS.SE_JUPITER },
  { name: "Venus", body: SWE_CONSTANTS.SE_VENUS },
  { name: "Saturn", body: SWE_CONSTANTS.SE_SATURN },
  { name: "Rahu", body: SWE_CONSTANTS.SE_TRUE_NODE }
];

function extractLongitude(result: number[] | { longitude?: number; xx?: number[]; error?: string | null }): number {
  if (typeof result === "object" && "error" in result && result.error) {
    throw new SwissEphemerisError(result.error);
  }

  if (Array.isArray(result)) {
    return result[0];
  }

  if (typeof result === "object" && typeof result.longitude === "number") {
    return result.longitude;
  }

  if (typeof result === "object" && Array.isArray(result.xx) && typeof result.xx[0] === "number") {
    return result.xx[0];
  }

  throw new SwissEphemerisError("Calculation returned a result without longitude.");
}

/**
 * Calculates sidereal planetary positions for the Kundali.
 */
export async function calculatePlanetaryPositions(
  julianDayUt: number,
  lagnaSignIndex: number,
  ayanamsa: number
): Promise<PlanetPosition[]> {
  const flags = getSwissEphemerisFlags();
  const planets: PlanetPosition[] = [];
  let rahuLongitude = 0;

  for (const planet of PLANET_DEFINITIONS) {
    const result = await calculateSwissBody(julianDayUt, planet.body, flags);
    const tropicalLongitude = extractLongitude(
      result as number[] | { longitude?: number; xx?: number[]; error?: string | null }
    );
    const siderealLongitude = toSiderealLongitude(tropicalLongitude, ayanamsa);
    const nakshatra = getNakshatraDetails(siderealLongitude);

    if (planet.name === "Rahu") {
      rahuLongitude = siderealLongitude;
    }

    planets.push({
      name: planet.name,
      longitude: siderealLongitude,
      rashi: getRashiFromLongitude(siderealLongitude),
      nakshatra: nakshatra.name,
      nakshatraLord: nakshatra.lord,
      pada: nakshatra.pada,
      house: getWholeSignHouse(siderealLongitude, lagnaSignIndex),
      isRetrograde: result.longitudeSpeed < 0
    });
  }

  const ketuLongitude = normalizeDegrees(rahuLongitude + 180);
  const ketuNakshatra = getNakshatraDetails(ketuLongitude);

  planets.push({
    name: "Ketu",
    longitude: ketuLongitude,
    rashi: getRashiFromLongitude(ketuLongitude),
    nakshatra: ketuNakshatra.name,
    nakshatraLord: ketuNakshatra.lord,
    pada: ketuNakshatra.pada,
    house: getWholeSignHouse(ketuLongitude, lagnaSignIndex),
    isRetrograde: true
  });

  return planets;
}

function buildDivisionalChartPlacement(name: string, longitude: number, multiplier: number): PlanetDivisionalPlacement {
  const divisionalLongitude = normalizeDegrees(longitude * multiplier);

  return {
    name,
    longitude: divisionalLongitude,
    sign: getRashiFromLongitude(divisionalLongitude)
  };
}

/**
 * Builds simple D9 and D10 divisional chart placements from sidereal longitudes.
 */
export function buildDivisionalCharts(planets: PlanetPosition[]): DivisionalCharts {
  return {
    d9: planets.map((planet) => buildDivisionalChartPlacement(planet.name, planet.longitude, 9)),
    d10: planets.map((planet) => buildDivisionalChartPlacement(planet.name, planet.longitude, 10))
  };
}

/**
 * Finds the Moon placement from a planetary list.
 */
export function findMoonPlacement(planets: PlanetPosition[]): PlanetPosition {
  const moon = planets.find((planet) => planet.name === "Moon");

  if (!moon) {
    throw new Error("Moon placement could not be determined.");
  }

  return moon;
}
