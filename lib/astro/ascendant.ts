import { getRashiFromLongitude, getSignIndexFromLongitude, normalizeDegrees } from "@/lib/astro/nakshatra";
import { getLocalSiderealTimeDegrees, getMeanObliquityDegrees } from "@/lib/utils/dateTime";

export interface AscendantResult {
  tropicalLongitude: number;
  siderealLongitude: number;
  sign: string;
  signIndex: number;
  localSiderealTime: number;
}

/**
 * Calculates the Lahiri sidereal ascendant using local sidereal time and latitude.
 */
export function calculateAscendant(
  julianDayUt: number,
  latitude: number,
  longitude: number,
  ayanamsa: number
): AscendantResult {
  const localSiderealTime = getLocalSiderealTimeDegrees(julianDayUt, longitude);
  const obliquity = getMeanObliquityDegrees(julianDayUt);

  const theta = (localSiderealTime * Math.PI) / 180;
  const epsilon = (obliquity * Math.PI) / 180;
  const phi = (latitude * Math.PI) / 180;

  const y = -Math.cos(theta);
  const x = Math.sin(theta) * Math.cos(epsilon) + Math.tan(phi) * Math.sin(epsilon);

  let tropicalLongitude = (Math.atan2(y, x) * 180) / Math.PI;
  tropicalLongitude = normalizeDegrees(tropicalLongitude);
  tropicalLongitude = tropicalLongitude < 180 ? tropicalLongitude + 180 : tropicalLongitude - 180;
  tropicalLongitude = normalizeDegrees(tropicalLongitude);

  const siderealLongitude = normalizeDegrees(tropicalLongitude - ayanamsa);
  const signIndex = getSignIndexFromLongitude(siderealLongitude);

  return {
    tropicalLongitude,
    siderealLongitude,
    sign: getRashiFromLongitude(siderealLongitude),
    signIndex,
    localSiderealTime
  };
}
