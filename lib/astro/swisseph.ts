/**
 * Swiss Ephemeris wrapper using the `sweph` N-API package.
 *
 * Provides precision-grade astronomical calculations matching Astrosage,
 * Jagannatha Hora, and Parashara system outputs.  All planetary positions
 * are derived from the Swiss Ephemeris library with Lahiri (Chitrapaksha)
 * ayanamsa applied.
 */

import fs from "node:fs";
import path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sweph = require("sweph") as typeof import("sweph");

export const SWE_CONSTANTS = {
  SE_SUN: sweph.constants.SE_SUN,
  SE_MOON: sweph.constants.SE_MOON,
  SE_MERCURY: sweph.constants.SE_MERCURY,
  SE_VENUS: sweph.constants.SE_VENUS,
  SE_MARS: sweph.constants.SE_MARS,
  SE_JUPITER: sweph.constants.SE_JUPITER,
  SE_SATURN: sweph.constants.SE_SATURN,
  SE_TRUE_NODE: sweph.constants.SE_TRUE_NODE,
  SE_MEAN_NODE: sweph.constants.SE_MEAN_NODE,
  SEFLG_SWIEPH: sweph.constants.SEFLG_SWIEPH,
  SEFLG_MOSEPH: sweph.constants.SEFLG_MOSEPH,
  SEFLG_SPEED: sweph.constants.SEFLG_SPEED,
  SE_SIDM_LAHIRI: sweph.constants.SE_SIDM_LAHIRI
} as const;

let initialized = false;
let ephemerisFlags = SWE_CONSTANTS.SEFLG_MOSEPH | SWE_CONSTANTS.SEFLG_SPEED;

export class SwissEphemerisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SwissEphemerisError";
  }
}

/**
 * Initializes Swiss Ephemeris settings and Lahiri sidereal mode.
 */
export function initializeSwissEphemeris(): void {
  if (initialized) {
    return;
  }

  const defaultPath = path.join(process.cwd(), "ephe");
  const configuredPath = process.env.SWISSEPH_EPHE_PATH ?? defaultPath;

  if (fs.existsSync(configuredPath)) {
    sweph.set_ephe_path(configuredPath);
    ephemerisFlags = SWE_CONSTANTS.SEFLG_SWIEPH | SWE_CONSTANTS.SEFLG_SPEED;
  }

  sweph.set_sid_mode(SWE_CONSTANTS.SE_SIDM_LAHIRI, 0, 0);
  initialized = true;
}

/**
 * Returns the active ephemeris computation flags after initialization.
 */
export function getSwissEphemerisFlags(): number {
  initializeSwissEphemeris();
  return ephemerisFlags;
}

/**
 * Result shape returned by calculateSwissBody.
 */
export interface SwissEphCalcResult {
  longitude: number;
  latitude: number;
  distance: number;
  longitudeSpeed: number;
  latitudeSpeed: number;
  distanceSpeed: number;
}

/**
 * Calculates a planetary position for a given Julian day in UT.
 * Returns tropical ecliptic coordinates.
 */
export async function calculateSwissBody(
  julianDayUt: number,
  body: number,
  flags: number
): Promise<SwissEphCalcResult> {
  initializeSwissEphemeris();

  const result = sweph.calc_ut(julianDayUt, body, flags);

  // sweph returns { flag, error, data } where data is a 6-element array:
  // [longitude, latitude, distance, longSpeed, latSpeed, distSpeed]
  if (!result || !result.data) {
    throw new SwissEphemerisError(`Swiss Ephemeris calc_ut returned no data for body ${body}.`);
  }

  // If the error string contains a real failure (not just a fallback notice)
  if (result.error && !result.error.includes("using Moshier eph.")) {
    // Only throw if it's a genuine error, not a benign fallback message
    const isBenignWarning =
      result.error.includes("not found in PATH") || result.error.includes("using Moshier");
    if (!isBenignWarning) {
      throw new SwissEphemerisError(result.error);
    }
  }

  return {
    longitude: result.data[0],
    latitude: result.data[1],
    distance: result.data[2],
    longitudeSpeed: result.data[3],
    latitudeSpeed: result.data[4],
    distanceSpeed: result.data[5]
  };
}

/**
 * Calculates Lahiri ayanamsa for a given Julian day in UT.
 */
export async function calculateSwissAyanamsa(julianDayUt: number): Promise<number> {
  initializeSwissEphemeris();
  return sweph.get_ayanamsa_ut(julianDayUt);
}
