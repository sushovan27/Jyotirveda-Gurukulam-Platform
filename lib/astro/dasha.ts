import { DateTime } from "luxon";

import type { AntardashaPeriod, DashaLord, DashaResponse, MahadashaPeriod } from "@/types/kundali";
import { DASHA_SEQUENCE, DASHA_YEARS, NAKSHATRA_SPAN, getNakshatraDetails, normalizeDegrees } from "@/lib/astro/nakshatra";
import { addDashaYears, formatIsoDate } from "@/lib/utils/dateTime";

interface RawAntardashaPeriod {
  lord: DashaLord;
  startAt: DateTime;
  endAt: DateTime;
}

interface RawMahadashaPeriod {
  lord: DashaLord;
  startAt: DateTime;
  endAt: DateTime;
  antardashas: RawAntardashaPeriod[];
}

function buildAntardashaSegments(
  mahaLord: DashaLord,
  mahaStart: DateTime,
  mahaYears: number,
  windowStart: DateTime,
  windowEnd: DateTime
): RawAntardashaPeriod[] {
  const startIndex = DASHA_SEQUENCE.indexOf(mahaLord);
  const antardashas: RawAntardashaPeriod[] = [];
  let cursor = mahaStart;

  for (let offset = 0; offset < DASHA_SEQUENCE.length; offset += 1) {
    const antardashaLord = DASHA_SEQUENCE[(startIndex + offset) % DASHA_SEQUENCE.length];
    const antardashaYears = (mahaYears * DASHA_YEARS[antardashaLord]) / 120;
    const antardashaEnd = addDashaYears(cursor, antardashaYears);
    const overlapsWindow = antardashaEnd > windowStart && cursor < windowEnd;

    if (overlapsWindow) {
      const clippedStart = cursor < windowStart ? windowStart : cursor;
      const clippedEnd = antardashaEnd > windowEnd ? windowEnd : antardashaEnd;

      antardashas.push({
        lord: antardashaLord,
        startAt: clippedStart,
        endAt: clippedEnd
      });
    }

    cursor = antardashaEnd;
  }

  return antardashas;
}

function findPeriodAtDate<T extends { startAt: DateTime; endAt: DateTime }>(
  periods: T[],
  targetDate: DateTime
): T | undefined {
  return periods.find((period) => targetDate >= period.startAt && targetDate < period.endAt);
}

function formatAntardashaPeriod(period: RawAntardashaPeriod): AntardashaPeriod {
  return {
    lord: period.lord,
    start: formatIsoDate(period.startAt),
    end: formatIsoDate(period.endAt)
  };
}

function formatMahadashaPeriod(period: RawMahadashaPeriod): MahadashaPeriod {
  return {
    lord: period.lord,
    start: formatIsoDate(period.startAt),
    end: formatIsoDate(period.endAt),
    antardashas: period.antardashas.map(formatAntardashaPeriod)
  };
}

/**
 * Builds a 120-year Vimshottari dasha timeline from the Moon's sidereal longitude.
 */
export function buildVimshottariDasha(
  moonSiderealLongitude: number,
  birthDateTimeUtc: DateTime,
  referenceDateUtc: DateTime = DateTime.utc()
): DashaResponse {
  const moonNakshatra = getNakshatraDetails(moonSiderealLongitude);
  const mahaLordAtBirth = moonNakshatra.lord;
  const mahaYearsAtBirth = DASHA_YEARS[mahaLordAtBirth];
  const offsetWithinNakshatra = normalizeDegrees(moonSiderealLongitude) % NAKSHATRA_SPAN;
  const elapsedFraction = offsetWithinNakshatra / NAKSHATRA_SPAN;
  const elapsedMahadashaYears = mahaYearsAtBirth * elapsedFraction;

  const theoreticalMahadashaStart = addDashaYears(birthDateTimeUtc, -elapsedMahadashaYears);
  const windowStart = birthDateTimeUtc;
  const windowEnd = addDashaYears(birthDateTimeUtc, 120);

  const rawTimeline: RawMahadashaPeriod[] = [];
  let cursor = theoreticalMahadashaStart;
  let sequenceIndex = DASHA_SEQUENCE.indexOf(mahaLordAtBirth);

  while (cursor < windowEnd) {
    const lord = DASHA_SEQUENCE[sequenceIndex % DASHA_SEQUENCE.length];
    const mahaYears = DASHA_YEARS[lord];
    const mahaEnd = addDashaYears(cursor, mahaYears);
    const overlapsWindow = mahaEnd > windowStart && cursor < windowEnd;

    if (overlapsWindow) {
      const clippedStart = cursor < windowStart ? windowStart : cursor;
      const clippedEnd = mahaEnd > windowEnd ? windowEnd : mahaEnd;

      rawTimeline.push({
        lord,
        startAt: clippedStart,
        endAt: clippedEnd,
        antardashas: buildAntardashaSegments(lord, cursor, mahaYears, windowStart, windowEnd)
      });
    }

    cursor = mahaEnd;
    sequenceIndex += 1;
  }

  const currentMahadasha = findPeriodAtDate(rawTimeline, referenceDateUtc) ?? rawTimeline[rawTimeline.length - 1];
  const currentAntardasha =
    (currentMahadasha ? findPeriodAtDate(currentMahadasha.antardashas, referenceDateUtc) : undefined) ??
    currentMahadasha?.antardashas[currentMahadasha.antardashas.length - 1];

  if (!currentMahadasha || !currentAntardasha) {
    throw new Error("Unable to derive Vimshottari dasha periods.");
  }

  const timeline = rawTimeline.map(formatMahadashaPeriod);

  return {
    mahadasha: {
      lord: currentMahadasha.lord,
      start: formatIsoDate(currentMahadasha.startAt),
      end: formatIsoDate(currentMahadasha.endAt)
    },
    antardasha: {
      lord: currentAntardasha.lord,
      start: formatIsoDate(currentAntardasha.startAt),
      end: formatIsoDate(currentAntardasha.endAt)
    },
    timeline
  };
}
