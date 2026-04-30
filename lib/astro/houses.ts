import type { EastIndianChartGrid, HouseDetail, PlanetPosition, RashiChart } from "@/types/kundali";
import { ZODIAC_SIGNS, getSignIndexFromLongitude, normalizeDegrees } from "@/lib/astro/nakshatra";

/**
 * Calculates the whole-sign house number for a planet relative to Lagna.
 */
export function getWholeSignHouse(planetLongitude: number, lagnaSignIndex: number): number {
  const planetSignIndex = getSignIndexFromLongitude(planetLongitude);
  return ((planetSignIndex - lagnaSignIndex + 12) % 12) + 1;
}

/**
 * Builds the 12 whole-sign houses and East Indian chart mapping.
 */
export function buildWholeSignHouses(
  lagnaLongitude: number,
  planets: PlanetPosition[]
): { houses: HouseDetail[]; rashiChart: RashiChart } {
  const lagnaSignIndex = getSignIndexFromLongitude(lagnaLongitude);

  const houses = Array.from({ length: 12 }, (_, index) => {
    const houseNumber = index + 1;
    const signIndex = (lagnaSignIndex + index) % 12;
    const startLongitude = normalizeDegrees(signIndex * 30);
    const endLongitude = normalizeDegrees(startLongitude + 30);
    const occupants = planets.filter((planet) => planet.house === houseNumber).map((planet) => planet.name);

    return {
      house: houseNumber,
      sign: ZODIAC_SIGNS[signIndex],
      startLongitude,
      endLongitude,
      planets: occupants
    };
  });

  const rashiChart: RashiChart = {
    house1: houses[0].sign,
    house2: houses[1].sign,
    house3: houses[2].sign,
    house4: houses[3].sign,
    house5: houses[4].sign,
    house6: houses[5].sign,
    house7: houses[6].sign,
    house8: houses[7].sign,
    house9: houses[8].sign,
    house10: houses[9].sign,
    house11: houses[10].sign,
    house12: houses[11].sign,
    grid: buildEastIndianChartGrid(houses)
  };

  return { houses, rashiChart };
}

/**
 * Converts house details into a perimeter-based East Indian grid object.
 */
export function buildEastIndianChartGrid(houses: HouseDetail[]): EastIndianChartGrid {
  const byHouse = Object.fromEntries(houses.map((house) => [house.house, house])) as Record<number, HouseDetail>;

  const cell = (houseNumber: number) => ({
    house: houseNumber,
    sign: byHouse[houseNumber].sign,
    planets: byHouse[houseNumber].planets
  });

  return {
    topLeft: cell(12),
    topCenter: cell(1),
    topRight: cell(2),
    rightTop: cell(3),
    rightCenter: cell(4),
    rightBottom: cell(5),
    bottomRight: cell(6),
    bottomCenter: cell(7),
    bottomLeft: cell(8),
    leftBottom: cell(9),
    leftCenter: cell(10),
    leftTop: cell(11)
  };
}
