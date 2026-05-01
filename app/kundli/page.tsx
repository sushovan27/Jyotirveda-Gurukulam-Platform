"use client";

import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { KundaliGenerator } from "@/components/kundali/KundaliGenerator";

export default function KundliPage() {
  return (
    <SiteShell>
      <main>
        <section className="relative overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-gold/15 blur-3xl" />
          </div>
          <Container className="relative">
            <SectionHeading
              eyebrow="Precision Kundli Generator"
              title="Reveal your Vedic birth chart"
              description="Enter your birth details to receive a North Indian style Kundali rendered by our in-house astrology engine."
              align="center"
            />
          </Container>
        </section>

        <section className="pb-16">
          <Container className="max-w-5xl">
            <KundaliGenerator
              title="Generate Your Free Kundali"
              description="Submit your full name, birth date, birth time, and birth place to calculate your chart and review the current dasha flow."
            />
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
