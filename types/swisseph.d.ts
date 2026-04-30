declare module "swisseph" {
  export interface SwissEphResultObject {
    error?: string | null;
    longitude?: number;
    latitude?: number;
    distance?: number;
    longitudeSpeed?: number;
    latitudeSpeed?: number;
    distanceSpeed?: number;
    xx?: number[];
  }

  export type SwissEphCalcResult = number[] | SwissEphResultObject;

  export function swe_set_ephe_path(ephemerisPath: string): void;
  export function swe_set_sid_mode(sidMode: number, t0: number, ayanT0: number): void;
  export function swe_julday(
    year: number,
    month: number,
    day: number,
    hour: number,
    calendarFlag: number,
    callback?: (julianDay: number) => void
  ): number | void;
  export function swe_get_ayanamsa_ut(
    julianDayUt: number,
    callback?: (ayanamsa: number) => void
  ): number | void;
  export function swe_calc_ut(
    julianDayUt: number,
    body: number,
    flags: number,
    callback?: (result: SwissEphCalcResult) => void
  ): SwissEphCalcResult | void;

  export const SE_GREG_CAL: number;
  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MARS: number;
  export const SE_MERCURY: number;
  export const SE_JUPITER: number;
  export const SE_VENUS: number;
  export const SE_SATURN: number;
  export const SE_MEAN_NODE: number;
  export const SEFLG_SPEED: number;
  export const SEFLG_MOSEPH: number;
  export const SEFLG_SWIEPH: number;
  export const SE_SIDM_LAHIRI: number;
}
