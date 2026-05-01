"use client";

import type { KundaliResponse } from "@/types/kundali";
import { PLANET_ABBREVIATIONS } from "@/lib/jyotirveda";

type EastIndianKundaliChartProps = {
  kundali: KundaliResponse;
  className?: string;
};

function formatPlanetLabel(name: string, isRetrograde?: boolean) {
  const short = PLANET_ABBREVIATIONS[name] ?? name.slice(0, 2);
  return isRetrograde ? `${short}R` : short;
}

function getHouseData(kundali: KundaliResponse, house: number) {
  const cell = kundali.houses.find((item) => item.house === house);
  const occupants = kundali.planets.filter((planet) => planet.house === house);

  return {
    house,
    sign: cell?.sign ?? "",
    occupants
  };
}

function ChartCell({
  house,
  sign,
  occupants,
  className = ""
}: {
  house: number;
  sign: string;
  occupants: KundaliResponse["planets"];
  className?: string;
}) {
  return (
    <div className={`flex h-full min-h-[92px] flex-col justify-between border border-brand-dark/15 bg-white/70 p-2 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-dark/45">H{house}</span>
        <span className="text-[11px] font-semibold text-brand-dark">{sign}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1 text-[11px] font-medium text-brand-gold">
        {occupants.length > 0 ? (
          occupants.map((planet) => (
            <span key={planet.name} className="rounded-full bg-brand-dark/5 px-1.5 py-0.5">
              {formatPlanetLabel(planet.name, planet.isRetrograde)}
            </span>
          ))
        ) : (
          <span className="text-brand-dark/35">-</span>
        )}
      </div>
    </div>
  );
}

export function EastIndianKundaliChart({
  kundali,
  className = ""
}: EastIndianKundaliChartProps) {
  const h1 = getHouseData(kundali, 1);
  const h2 = getHouseData(kundali, 2);
  const h3 = getHouseData(kundali, 3);
  const h4 = getHouseData(kundali, 4);
  const h5 = getHouseData(kundali, 5);
  const h6 = getHouseData(kundali, 6);
  const h7 = getHouseData(kundali, 7);
  const h8 = getHouseData(kundali, 8);
  const h9 = getHouseData(kundali, 9);
  const h10 = getHouseData(kundali, 10);
  const h11 = getHouseData(kundali, 11);
  const h12 = getHouseData(kundali, 12);

  return (
    <div className={`rounded-[2rem] bg-[#fffaf0] p-4 ring-1 ring-brand-dark/10 ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-dark/45">
            East Indian Kundali
          </p>
          <h3 className="text-lg font-semibold text-brand-dark font-display">
            {kundali.name}&apos;s Rashi Chart
          </h3>
        </div>
        <div className="text-right text-xs text-brand-dark/60">
          <div>Lagna: {kundali.lagna}</div>
          <div>Moon: {kundali.moonSign}</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-brand-dark/10 bg-brand-cream/40">
        <div className="grid grid-cols-4">
          <ChartCell {...h12} />
          <ChartCell {...h1} />
          <ChartCell {...h2} />
          <ChartCell {...h3} />

          <ChartCell {...h11} />
          <div className="col-span-2 row-span-2 flex min-h-[184px] flex-col items-center justify-center border border-brand-dark/15 bg-white/80 p-4 text-center">
            <div className="text-[10px] uppercase tracking-[0.22em] text-brand-dark/45">Key Dashas</div>
            <div className="mt-3 text-sm font-semibold text-brand-dark">
              {kundali.dasha.mahadasha.lord} / {kundali.dasha.antardasha.lord}
            </div>
            <div className="mt-1 text-xs text-brand-dark/60">
              {kundali.dasha.pratyantar?.lord ?? "Pratyantar unavailable"}
            </div>
          </div>
          <ChartCell {...h4} />

          <ChartCell {...h10} />
          <ChartCell {...h5} />

          <ChartCell {...h9} />
          <ChartCell {...h8} />
          <ChartCell {...h7} />
          <ChartCell {...h6} />
        </div>
      </div>
    </div>
  );
}
