export interface KundaliRequestBody {
  name: string;
  birthDate: string;
  birthTime: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  city?: string;
}

export type DashaLord =
  | "Ketu"
  | "Venus"
  | "Sun"
  | "Moon"
  | "Mars"
  | "Rahu"
  | "Jupiter"
  | "Saturn"
  | "Mercury";

export interface NakshatraPlacement {
  index: number;
  name: string;
  pada: number;
  lord: DashaLord;
}

export interface PlanetDivisionalPlacement {
  name: string;
  sign: string;
  longitude: number;
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  rashi: string;
  nakshatra: string;
  nakshatraLord: DashaLord;
  pada: number;
  house: number;
}

export interface HouseDetail {
  house: number;
  sign: string;
  startLongitude: number;
  endLongitude: number;
  planets: string[];
}

export interface EastIndianChartCell {
  house: number;
  sign: string;
  planets: string[];
}

export interface EastIndianChartGrid {
  topLeft: EastIndianChartCell;
  topCenter: EastIndianChartCell;
  topRight: EastIndianChartCell;
  rightTop: EastIndianChartCell;
  rightCenter: EastIndianChartCell;
  rightBottom: EastIndianChartCell;
  bottomRight: EastIndianChartCell;
  bottomCenter: EastIndianChartCell;
  bottomLeft: EastIndianChartCell;
  leftBottom: EastIndianChartCell;
  leftCenter: EastIndianChartCell;
  leftTop: EastIndianChartCell;
}

export interface RashiChart {
  house1: string;
  house2: string;
  house3: string;
  house4: string;
  house5: string;
  house6: string;
  house7: string;
  house8: string;
  house9: string;
  house10: string;
  house11: string;
  house12: string;
  grid: EastIndianChartGrid;
}

export interface AntardashaPeriod {
  lord: DashaLord;
  start: string;
  end: string;
}

export interface MahadashaPeriod {
  lord: DashaLord;
  start: string;
  end: string;
  antardashas: AntardashaPeriod[];
}

export interface DashaSummaryPeriod {
  lord: DashaLord;
  start: string;
  end: string;
}

export interface DashaResponse {
  mahadasha: DashaSummaryPeriod;
  antardasha: DashaSummaryPeriod;
  timeline: MahadashaPeriod[];
}

export interface DivisionalCharts {
  d9: PlanetDivisionalPlacement[];
  d10: PlanetDivisionalPlacement[];
}

export interface KundaliResponse {
  lagna: string;
  lagnaLongitude: number;
  ayanamsa: number;
  rashiChart: RashiChart;
  planets: PlanetPosition[];
  nakshatras: Array<{
    planet: string;
    nakshatra: string;
    pada: number;
    lord: DashaLord;
  }>;
  houses: HouseDetail[];
  dasha: DashaResponse;
  divisionalCharts: DivisionalCharts;
  birthTimestampUtc: string;
}
