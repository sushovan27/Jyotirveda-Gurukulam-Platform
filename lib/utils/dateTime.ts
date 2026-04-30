import { DateTime, IANAZone } from "luxon";

/**
 * Validates that a timezone string is a valid IANA timezone.
 */
export function isValidTimeZone(timezone: string): boolean {
  return IANAZone.isValidZone(timezone);
}

/**
 * Converts local birth date and time into a UTC Luxon DateTime.
 */
export function convertBirthDataToUtc(birthDate: string, birthTime: string, timezone: string): DateTime {
  const localDateTime = DateTime.fromISO(`${birthDate}T${birthTime}`, {
    zone: timezone
  });

  if (!localDateTime.isValid) {
    throw new RangeError(localDateTime.invalidExplanation ?? "Invalid birth date, time, or timezone.");
  }

  return localDateTime.toUTC();
}

/**
 * Converts a UTC timestamp into its Julian day number.
 */
export function toJulianDay(dateTimeUtc: DateTime): number {
  if (dateTimeUtc.zoneName !== "UTC") {
    throw new RangeError("Julian day conversion expects a UTC timestamp.");
  }

  const year = dateTimeUtc.year;
  const month = dateTimeUtc.month;
  const day = dateTimeUtc.day;
  const hourFraction =
    dateTimeUtc.hour / 24 +
    dateTimeUtc.minute / 1440 +
    dateTimeUtc.second / 86400 +
    dateTimeUtc.millisecond / 86400000;

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  const jdn =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  return jdn - 0.5 + hourFraction;
}

/**
 * Converts a Julian day into Julian centuries from J2000.0.
 */
export function toJulianCentury(julianDay: number): number {
  return (julianDay - 2451545.0) / 36525;
}

/**
 * Computes the mean obliquity of the ecliptic in degrees.
 */
export function getMeanObliquityDegrees(julianDay: number): number {
  const t = toJulianCentury(julianDay);
  return 23.439291111 - 0.013004167 * t - 0.000000164 * t * t + 0.000000504 * t * t * t;
}

/**
 * Computes Greenwich mean sidereal time in degrees.
 */
export function getGreenwichMeanSiderealTimeDegrees(julianDay: number): number {
  const t = toJulianCentury(julianDay);
  const gmst =
    280.46061837 +
    360.98564736629 * (julianDay - 2451545.0) +
    0.000387933 * t * t -
    (t * t * t) / 38710000;

  return ((gmst % 360) + 360) % 360;
}

/**
 * Computes local sidereal time in degrees for a longitude.
 */
export function getLocalSiderealTimeDegrees(julianDay: number, longitude: number): number {
  const localSiderealTime = getGreenwichMeanSiderealTimeDegrees(julianDay) + longitude;
  return ((localSiderealTime % 360) + 360) % 360;
}

/**
 * Adds Vimshottari-style year durations using a 365.25-day civil approximation.
 */
export function addDashaYears(dateTimeUtc: DateTime, years: number): DateTime {
  return dateTimeUtc.plus({ days: years * 365.25 });
}

/**
 * Formats a UTC DateTime as an ISO calendar date.
 */
export function formatIsoDate(dateTimeUtc: DateTime): string {
  return dateTimeUtc.toUTC().toISODate() ?? dateTimeUtc.toUTC().toFormat("yyyy-MM-dd");
}
