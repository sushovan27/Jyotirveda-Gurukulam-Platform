"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Fire: "bg-orange-50 ring-orange-200/60 text-orange-700",
  Earth: "bg-emerald-50 ring-emerald-200/60 text-emerald-700",
  Air: "bg-sky-50 ring-sky-200/60 text-sky-700",
  Water: "bg-blue-50 ring-blue-200/60 text-blue-700",
};

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } }
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HoroscopePage() {
  const [horoscopes, setHoroscopes] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);

  const [todayLabel, setTodayLabel] = React.useState("");

  React.useEffect(() => {
    setTodayLabel(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

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
        <section className="relative overflow-hidden py-14 sm:py-20">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-gold/10 blur-3xl" />
          </div>
          <Container className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="flex flex-col items-center gap-5"
            >
              <SectionHeading
                eyebrow={`Daily Horoscope${todayLabel ? ` · ${todayLabel}` : ""}`}
                title="Today's Vedic Rashi Predictions"
                description="Fresh AI-generated horoscopes rooted in Vedic Jyotish principles. Select your rashi to read your daily cosmic guidance."
                align="center"
              />
              <button
                onClick={() => void fetchHoroscopes()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-brand-dark/12 transition-all duration-200 hover:bg-white hover:ring-brand-gold/30 hover:shadow-sm disabled:opacity-50 active:scale-[0.97]"
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
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh predictions
                  </>
                )}
              </button>
            </motion.div>
          </Container>
        </section>

        {/* Rashi Grid */}
        <section className="pb-20">
          <Container>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700 ring-1 ring-red-200"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start"
            >
              {RASHIS.map((rashi) => {
                const isSelected = selected === rashi.name;
                const prediction = horoscopes[rashi.name];

                return (
                  <motion.div key={rashi.name} variants={fadeUp}>
                    <Card
                      className={[
                        "cursor-pointer p-5 transition-all duration-250",
                        isSelected
                          ? "ring-2 ring-brand-gold shadow-lg shadow-brand-gold/10"
                          : "hover:ring-1 hover:ring-brand-gold/40 hover:shadow-md",
                      ].join(" ")}
                      onClick={() => setSelected(isSelected ? null : rashi.name)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-2xl font-sanskrit leading-none">{rashi.sanskrit}</div>
                          <div className="mt-1.5 text-base font-semibold text-brand-dark font-display">
                            {rashi.name}
                          </div>
                          <div className="text-xs text-brand-dark/50 mt-0.5">
                            {rashi.english}
                          </div>
                        </div>
                        {/* Golden Zodiac Badge */}
                        <div className="relative flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cream to-[#FCEABB] ring-1 ring-brand-gold/30 shadow-inner transition-all duration-300 group-hover:ring-brand-gold/50">
                          <span 
                            className="text-2xl text-brand-dark/80 drop-shadow-sm" 
                            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                          >
                            {rashi.symbol}&#xFE0E;
                          </span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ring-1 ${ELEMENT_COLOURS[rashi.element] ?? ""}`}
                        >
                          {rashi.element}
                        </span>
                        <span className="rounded-full bg-brand-cream px-2.5 py-0.5 text-[10px] font-medium text-brand-dark/60 ring-1 ring-brand-dark/8">
                          {rashi.lord}
                        </span>
                      </div>

                      {/* Prediction (expanded) */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 border-t border-brand-dark/8 pt-4">
                              {loading || !prediction ? (
                                <div className="flex gap-1">
                                  {[1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className="h-2 flex-1 animate-pulse rounded-full bg-brand-gold/25"
                                      style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm leading-relaxed text-brand-dark/75">
                                  {prediction}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isSelected && (
                        <p className="mt-3 text-[11px] text-brand-dark/40 tracking-wide">
                          Tap to read today&apos;s guidance →
                        </p>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            <p className="mt-10 text-center text-xs text-brand-dark/40 tracking-wide">
              AI-generated Vedic horoscopes · For spiritual guidance only · Refresh daily
            </p>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
