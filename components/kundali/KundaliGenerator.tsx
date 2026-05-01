"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";
import { EastIndianKundaliChart } from "@/components/kundali/EastIndianKundaliChart";
import {
  BOOKING_URL,
  readStoredKundali,
  saveStoredKundali,
  saveStoredKundaliRequest
} from "@/lib/jyotirveda";
import type { KundaliResponse } from "@/types/kundali";

const kundliFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time (HH:MM)"),
  pob: z.string().min(2, "Place of birth is required").max(150, "Too long")
});

type KundliFormValues = z.infer<typeof kundliFormSchema>;

function FormField({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-dark">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-brand-dark/20 bg-white/80 px-3 py-2.5 text-sm text-[#1b1b1b] outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/40";

export function KundaliGenerator({
  formId,
  title,
  description,
  compact = false
}: {
  formId?: string;
  title: string;
  description: string;
  compact?: boolean;
}) {
  const [interpretation, setInterpretation] = React.useState<KundaliResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const cached = readStoredKundali();
    if (cached) {
      setInterpretation(cached);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<KundliFormValues>({
    resolver: zodResolver(kundliFormSchema)
  });

  const onSubmit = async (data: KundliFormValues) => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        setApiError(json.error?.message || json.error || "Failed to generate Kundli. Please try again.");
        return;
      }

      if (json.interpretation) {
        const payload = json.interpretation as KundaliResponse;
        setInterpretation(payload);
        saveStoredKundali(payload);
        saveStoredKundaliRequest(data);

        setTimeout(() => {
          document.getElementById("kundali-result")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
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
    <div className="grid gap-6">
      <Card id={formId} className={compact ? "p-6 sm:p-7" : "p-6 sm:p-8"}>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-brand-dark font-display">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-dark/70">{description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <FormField label="Full Name" error={errors.name?.message}>
            <input {...register("name")} type="text" placeholder="e.g. Arjun Sharma" className={inputCls} />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Date of Birth" error={errors.dob?.message}>
              <input {...register("dob")} type="date" className={inputCls} />
            </FormField>

            <FormField label="Time of Birth" error={errors.tob?.message}>
              <input {...register("tob")} type="time" className={inputCls} />
            </FormField>
          </div>

          <FormField label="Place of Birth" error={errors.pob?.message}>
            <input {...register("pob")} type="text" placeholder="e.g. Kolkata, India" className={inputCls} />
          </FormField>

          {apiError ? (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {apiError}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-dark hover:bg-brand-accent"
            >
              {loading ? "Calculating Kundali..." : "Generate Free Kundali"}
            </Button>
            <Button variant="secondary" href={BOOKING_URL} className="w-full">
              Book Now
            </Button>
          </div>

          <p className="text-center text-xs text-brand-dark/60">
            Calculated by our in-house Jyotirveda API using Swiss Ephemeris.
          </p>
        </form>
      </Card>

      {interpretation ? (
        <div id="kundali-result" className="grid gap-5">
          <EastIndianKundaliChart kundali={interpretation} />

          <Card className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-brand-cream p-4 ring-1 ring-brand-dark/10">
                <div className="text-xs uppercase tracking-[0.18em] text-brand-dark/45">Lagna</div>
                <div className="mt-2 text-lg font-semibold text-brand-dark">{interpretation.lagna}</div>
              </div>
              <div className="rounded-2xl bg-brand-cream p-4 ring-1 ring-brand-dark/10">
                <div className="text-xs uppercase tracking-[0.18em] text-brand-dark/45">Moon Sign</div>
                <div className="mt-2 text-lg font-semibold text-brand-dark">{interpretation.moonSign}</div>
              </div>
              <div className="rounded-2xl bg-brand-cream p-4 ring-1 ring-brand-dark/10">
                <div className="text-xs uppercase tracking-[0.18em] text-brand-dark/45">Current Mahadasha</div>
                <div className="mt-2 text-lg font-semibold text-brand-dark">{interpretation.dasha.mahadasha.lord}</div>
              </div>
              <div className="rounded-2xl bg-brand-cream p-4 ring-1 ring-brand-dark/10">
                <div className="text-xs uppercase tracking-[0.18em] text-brand-dark/45">Yogas</div>
                <div className="mt-2 text-sm font-semibold text-brand-dark">
                  {interpretation.yogas.length > 0 ? interpretation.yogas.join(", ") : "No major yoga tagged"}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brand-dark font-display">Planetary Positions</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-dark/10">
                    {["Planet", "Sign", "House", "Degree", "Nakshatra", "Retrograde"].map((heading) => (
                      <th key={heading} className="pb-2 pr-4 text-left text-xs font-semibold text-brand-dark/60">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {interpretation.planets.map((planet) => (
                    <tr key={planet.name} className="border-b border-brand-dark/5 last:border-0">
                      <td className="py-2 pr-4 font-medium text-brand-dark">{planet.name}</td>
                      <td className="py-2 pr-4 text-brand-dark/75">{planet.rashi}</td>
                      <td className="py-2 pr-4 text-brand-dark/75">{planet.house}</td>
                      <td className="py-2 pr-4 text-brand-dark/75">{planet.longitude.toFixed(2)}°</td>
                      <td className="py-2 pr-4 text-brand-dark/75">
                        {planet.nakshatra} ({planet.pada})
                      </td>
                      <td className="py-2 pr-4 text-brand-dark/75">{planet.isRetrograde ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-brand-dark font-display">Vimshottari Dasha (Timeline)</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-dark/10">
                    <th className="pb-2 pr-4 text-left text-xs font-semibold text-brand-dark/60">Mahadasha Lord</th>
                    <th className="pb-2 pr-4 text-left text-xs font-semibold text-brand-dark/60">Start Date</th>
                    <th className="pb-2 pr-4 text-left text-xs font-semibold text-brand-dark/60">End Date</th>
                    <th className="pb-2 pr-4 text-left text-xs font-semibold text-brand-dark/60">Antardashas</th>
                  </tr>
                </thead>
                <tbody>
                  {interpretation.dasha.timeline.map((period) => (
                    <tr key={`${period.lord}-${period.start}`} className="border-b border-brand-dark/5 last:border-0 align-top">
                      <td className="py-3 pr-4 font-medium text-brand-dark">{period.lord}</td>
                      <td className="py-3 pr-4 text-brand-dark/75">{new Date(period.start).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-brand-dark/75">{new Date(period.end).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 text-brand-dark/75">
                        <div className="grid max-h-32 gap-1 overflow-y-auto pr-2 text-xs">
                          {period.antardashas.map((antardasha) => (
                            <div key={`${period.lord}-${antardasha.lord}-${antardasha.start}`} className="flex justify-between gap-3">
                              <span>{antardasha.lord}</span>
                              <span className="opacity-75">{new Date(antardasha.start).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/chat">Ask Jyoti About This Chart</Button>
            <Button href={BOOKING_URL} variant="secondary">
              Book Now
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
