"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";
import { SectionHeading } from "@/components/site/SectionHeading";

// ---------------------------------------------------------------------------
// Types & validation
// ---------------------------------------------------------------------------

const kundliFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time (HH:MM)"),
  pob: z.string().min(2, "Place of birth is required").max(150, "Too long"),
});

type KundliFormValues = z.infer<typeof kundliFormSchema>;

type Planet = {
  name: string;
  sign: string;
  house: number;
  degree: string;
  nakshatra: string;
  effects: string;
};

type KundliInterpretation = {
  summary: string;
  ascendant: string;
  sunSign: string;
  moonSign: string;
  planets: Planet[];
  career: string;
  marriage: string;
  health: string;
  remedies: string[];
  favourableColours: string[];
  luckyNumbers: number[];
  mahadasha: string;
};

// ---------------------------------------------------------------------------
// Input field helper
// ---------------------------------------------------------------------------

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#4A0A0A]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#4A0A0A]/20 bg-white/80 px-3 py-2.5 text-sm text-[#1b1b1b] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 placeholder:text-[#4A0A0A]/40";

// ---------------------------------------------------------------------------
// Result sections
// ---------------------------------------------------------------------------

function ResultSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3
        className="mb-2 text-base font-semibold text-[#4A0A0A]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function KundliPage() {
  const [interpretation, setInterpretation] =
    React.useState<KundliInterpretation | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KundliFormValues>({
    resolver: zodResolver(kundliFormSchema),
  });

  const onSubmit = async (data: KundliFormValues) => {
    setLoading(true);
    setApiError(null);
    setInterpretation(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as {
        interpretation?: KundliInterpretation;
        error?: string;
      };

      if (!res.ok || json.error) {
        setApiError(json.error ?? "Failed to generate Kundli. Please try again.");
        return;
      }

      if (json.interpretation) {
        setInterpretation(json.interpretation);
        // Scroll to results
        setTimeout(() => {
          document.getElementById("kundli-result")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          </div>
          <Container className="relative">
            <SectionHeading
              eyebrow="AI Kundli Generator"
              title="Reveal your Vedic birth chart"
              description="Enter your birth details to receive an AI-powered Vedic Kundli interpretation—planetary positions, life guidance, and spiritual remedies."
              align="center"
            />
          </Container>
        </section>

        {/* Form */}
        <section className="pb-14 sm:pb-16">
          <Container className="max-w-xl">
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                <FormField label="Full Name" error={errors.name?.message}>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="e.g. Arjun Sharma"
                    className={inputCls}
                  />
                </FormField>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="Date of Birth"
                    error={errors.dob?.message}
                  >
                    <input
                      {...register("dob")}
                      type="date"
                      className={inputCls}
                    />
                  </FormField>

                  <FormField
                    label="Time of Birth"
                    error={errors.tob?.message}
                  >
                    <input
                      {...register("tob")}
                      type="time"
                      className={inputCls}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Place of Birth"
                  error={errors.pob?.message}
                >
                  <input
                    {...register("pob")}
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    className={inputCls}
                  />
                </FormField>

                {apiError && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {apiError}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      Generating your Kundli…
                    </span>
                  ) : (
                    "Generate Kundli ✦"
                  )}
                </Button>

                <p className="text-center text-xs text-[#4A0A0A]/60">
                  Powered by AI · Vedic Jyotish principles · For guidance only
                </p>
              </form>
            </Card>
          </Container>
        </section>

        {/* Results */}
        {interpretation && (
          <section id="kundli-result" className="pb-16">
            <Container className="max-w-3xl">
              <div className="grid gap-5">
                {/* Summary */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#4A0A0A] text-[#FFF7E6]">
                      <span
                        className="text-lg"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        ॐ
                      </span>
                    </div>
                    <div>
                      <h2
                        className="text-xl font-semibold text-[#4A0A0A]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Your Vedic Kundli
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-[#4A0A0A]/75">
                        {interpretation.summary}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Lagna (Ascendant)", value: interpretation.ascendant },
                      { label: "Surya (Sun Sign)", value: interpretation.sunSign },
                      { label: "Chandra (Moon Sign)", value: interpretation.moonSign },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl bg-[#FFF7E6] p-3 ring-1 ring-[#4A0A0A]/10"
                      >
                        <div className="text-xs text-[#4A0A0A]/60">{item.label}</div>
                        <div
                          className="mt-1 text-sm font-semibold text-[#4A0A0A]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Planetary Positions */}
                <Card className="p-6">
                  <ResultSection title="Graha Positions (Planetary Positions)">
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[#4A0A0A]/10">
                            {["Planet", "Sign", "House", "Degree", "Nakshatra"].map(
                              (h) => (
                                <th
                                  key={h}
                                  className="pb-2 pr-4 text-left text-xs font-semibold text-[#4A0A0A]/60"
                                >
                                  {h}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {interpretation.planets.map((p) => (
                            <tr
                              key={p.name}
                              className="border-b border-[#4A0A0A]/5 last:border-0"
                            >
                              <td className="py-2 pr-4 font-medium text-[#4A0A0A]">
                                {p.name}
                              </td>
                              <td className="py-2 pr-4 text-[#4A0A0A]/75">{p.sign}</td>
                              <td className="py-2 pr-4 text-[#4A0A0A]/75">{p.house}</td>
                              <td className="py-2 pr-4 text-[#4A0A0A]/75">{p.degree}</td>
                              <td className="py-2 pr-4 text-[#4A0A0A]/75">
                                {p.nakshatra}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ResultSection>
                </Card>

                {/* Life Areas */}
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    { title: "Career & Dharma", text: interpretation.career },
                    { title: "Marriage & Relationships", text: interpretation.marriage },
                    { title: "Health & Vitality", text: interpretation.health },
                  ].map((item) => (
                    <Card key={item.title} className="p-5">
                      <ResultSection title={item.title}>
                        <p className="text-sm leading-relaxed text-[#4A0A0A]/75">
                          {item.text}
                        </p>
                      </ResultSection>
                    </Card>
                  ))}
                </div>

                {/* Mahadasha */}
                <Card className="p-5">
                  <ResultSection title="Current Mahadasha Period">
                    <p className="text-sm leading-relaxed text-[#4A0A0A]/75">
                      {interpretation.mahadasha}
                    </p>
                  </ResultSection>
                </Card>

                {/* Lucky Details & Remedies */}
                <div className="grid gap-5 md:grid-cols-2">
                  <Card className="p-5">
                    <ResultSection title="Auspicious Details">
                      <div className="mt-3 grid gap-2">
                        <div className="flex items-center gap-3 rounded-xl bg-[#FFF7E6] p-3 ring-1 ring-[#4A0A0A]/10">
                          <span className="text-xs font-semibold text-[#4A0A0A]/60">
                            Lucky Numbers
                          </span>
                          <span className="ml-auto text-sm font-semibold text-[#4A0A0A]">
                            {interpretation.luckyNumbers.join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-[#FFF7E6] p-3 ring-1 ring-[#4A0A0A]/10">
                          <span className="text-xs font-semibold text-[#4A0A0A]/60">
                            Favourable Colours
                          </span>
                          <span className="ml-auto text-sm font-semibold text-[#4A0A0A]">
                            {interpretation.favourableColours.join(", ")}
                          </span>
                        </div>
                      </div>
                    </ResultSection>
                  </Card>

                  <Card className="p-5">
                    <ResultSection title="Vedic Remedies">
                      <ul className="mt-3 grid gap-2">
                        {interpretation.remedies.map((remedy, i) => (
                          <li key={i} className="flex gap-2 text-sm text-[#4A0A0A]/75">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                            {remedy}
                          </li>
                        ))}
                      </ul>
                    </ResultSection>
                  </Card>
                </div>

                <div className="text-center">
                  <Button
                    variant="secondary"
                    href="/chat"
                  >
                    Discuss this with our AI Astrologer →
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        )}
      </main>
    </SiteShell>
  );
}
