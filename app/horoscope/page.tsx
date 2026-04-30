"use client";

import * as React from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { SectionHeading } from "@/components/site/SectionHeading";

// ---------------------------------------------------------------------------
// Rashi metadata
// ---------------------------------------------------------------------------

const RASHIS = [
  { name: "Mesha", sanskrit: "मेष", symbol: "♈", english: "Aries", element: "Fire", lord: "Mangala (Mars)" },
  { name: "Vrishabha", sanskrit: "वृषभ", symbol: "♉", english: "Taurus", element: "Earth", lord: "Shukra (Venus)" },
  { name: "Mithuna", sanskrit: "मिथुन", symbol: "♊", english: "Gemini", element: "Air", lord: "Budha (Mercury)" },
  { name: "Karka", sanskrit: "कर्क", symbol: "♋", english: "Cancer", element: "Water", lord: "Chandra (Moon)" },
  { name: "Simha", sanskrit: "सिंह", symbol: "♌", english: "Leo", element: "Fire", lord: "Surya (Sun)" },
  { name: "Kanya", sanskrit: "कन्या", symbol: "♍", english: "Virgo", element: "Earth", lord: "Budha (Mercury)" },
  { name: "Tula", sanskrit: "तुला", symbol: "♎", english: "Libra", element: "Air", lord: "Shukra (Venus)" },
  { name: "Vrishchika", sanskrit: "वृश्चिक", symbol: "♏", english: "Scorpio", element: "Water", lord: "Mangala (Mars)" },
  { name: "Dhanu", sanskrit: "धनु", symbol: "♐", english: "Sagittarius", element: "Fire", lord: "Guru (Jupiter)" },
  { name: "Makara", sanskrit: "मकर", symbol: "♑", english: "Capricorn", element: "Earth", lord: "Shani (Saturn)" },
  { name: "Kumbha", sanskrit: "कुम्भ", symbol: "♒", english: "Aquarius", element: "Air", lord: "Shani (Saturn)" },
  { name: "Meena", sanskrit: "मीन", symbol: "♓", english: "Pisces", element: "Water", lord: "Guru (Jupiter)" },
];

const ELEMENT_COLOURS: Record<string, string> = {
  Fire: "bg-orange-50 ring-orange-200",
  Earth: "bg-green-50 ring-green-200",
  Air: "bg-sky-50 ring-sky-200",
  Water: "bg-blue-50 ring-blue-200",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HoroscopePage() {
  const [horoscopes, setHoroscopes] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fetchHoroscopes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/horoscope");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = (await res.json()) as Record<string, string>;
      setHoroscopes(data);
    } catch {
      setError("Could not load today's horoscopes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void fetchHoroscopes();
  }, [fetchHoroscopes]);

  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-gold/12 blur-3xl" />
          </div>
          <Container className="relative">
            <div className="flex flex-col items-center gap-4">
              <SectionHeading
                eyebrow={`Daily Horoscope · ${todayLabel}`}
                title="Today's Vedic Rashi Predictions"
                description="Fresh AI-generated horoscopes rooted in Vedic Jyotish principles. Select your rashi to read your daily cosmic guidance."
                align="center"
              />
              <button
                onClick={() => void fetchHoroscopes()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-brand-dark/15 hover:bg-white disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Loading…
                  </>
                ) : (
                  <>↺ Refresh predictions</>
                )}
              </button>
            </div>
          </Container>
        </section>

        {/* Rashi Grid */}
        <section className="pb-16">
          <Container>
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
              {RASHIS.map((rashi) => {
                const isSelected = selected === rashi.name;
                const prediction = horoscopes[rashi.name];

                return (
                  <Card
                    key={rashi.name}
                    className={[
                      "cursor-pointer p-5 transition-all duration-200",
                      isSelected
                        ? "ring-2 ring-brand-gold shadow-lg"
                        : "hover:ring-1 hover:ring-brand-gold/50",
                    ].join(" ")}
                    onClick={() => setSelected(isSelected ? null : rashi.name)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div
                          className="text-2xl"
                          style={{ fontFamily: "var(--font-sanskrit)" }}
                        >
                          {rashi.sanskrit}
                        </div>
                        <div
                          className="mt-1 text-base font-semibold text-brand-dark"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {rashi.name}
                        </div>
                        <div className="text-xs text-brand-dark/60">
                          {rashi.english}
                        </div>
                      </div>
                      {/* Golden Zodiac Badge */}
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cream to-brand-light-gold ring-1 ring-brand-gold/40 shadow-inner">
                        <div className="absolute inset-0 rounded-full bg-brand-gold/10 opacity-0 transition-opacity group-hover:opacity-100" />
                        <span 
                          className="text-2xl text-brand-dark drop-shadow-sm" 
                          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                        >
                          {rashi.symbol}&#xFE0E;
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${ELEMENT_COLOURS[rashi.element] ?? ""}`}
                      >
                        {rashi.element}
                      </span>
                      <span className="rounded-full bg-brand-cream px-2 py-0.5 text-xs text-brand-dark/70 ring-1 ring-brand-dark/10">
                        {rashi.lord}
                      </span>
                    </div>

                    {/* Prediction (expanded) */}
                    {isSelected && (
                      <div className="mt-4 border-t border-brand-dark/10 pt-4">
                        {loading || !prediction ? (
                          <div className="flex gap-1">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-2 flex-1 animate-pulse rounded-full bg-brand-gold/30"
                                style={{ animationDelay: `${i * 0.15}s` }}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed text-brand-dark/80">
                            {prediction}
                          </p>
                        )}
                      </div>
                    )}

                    {!isSelected && (
                      <p className="mt-3 text-xs text-brand-dark/50">
                        Tap to read today's guidance →
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs text-brand-dark/50">
              AI-generated Vedic horoscopes · For spiritual guidance only · Refresh daily
            </p>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
