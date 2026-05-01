"use client";

import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";
import { BOOKING_URL } from "@/lib/jyotirveda";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const focusAreas = [
  "Vedic astrology and Kundali interpretation",
  "Planetary periods, timing, and life direction",
  "Marriage, career, and spiritual guidance",
  "Vastu and numerology support",
  "Traditional learning in a modern digital format"
];

const values = [
  {
    title: "Clarity over complexity",
    description: "Sacred knowledge is presented with simplicity, so seekers can understand real principles without losing the depth of the tradition."
  },
  {
    title: "Tradition with responsibility",
    description: "Interpretations are framed carefully. We avoid fatalism, fear-driven language, and exaggerated promises about outcomes."
  },
  {
    title: "Study as a path",
    description: "Beyond readings, the gurukulam exists to support long-term learning for those who want to engage with Jyotisha more deeply."
  }
];

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="py-16 sm:py-24">
        <Container className="max-w-5xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">About Us</p>
            <h1 className="mt-4 text-4xl font-semibold text-brand-dark font-display sm:text-5xl leading-tight">
              A digital gurukulam for
              <br />
              serious seekers of Vedic wisdom
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brand-dark/65">
              Jyotirveda Gurukulam is designed as a thoughtful space for astrology, spiritual reflection, and traditional study.
              The intention is simple: offer authentic Vedic insight in a form that is clear, disciplined, and genuinely useful.
            </p>
          </motion.div>

          {/* Two-column about */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <motion.div variants={fadeUp}>
              <Card className="h-full p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-brand-dark font-display">Our approach</h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed text-brand-dark/70">
                  <p>
                    We believe Jyotisha should not be reduced to fear, sensational predictions, or shallow social-media style advice.
                    Real chart interpretation requires patience, context, and respect for timing.
                  </p>
                  <p>
                    That is why the platform is built around chart-based reading, dasha awareness, practical remedies, and a steady,
                    spiritually grounded tone. The goal is insight that supports better decisions, not dependency or confusion.
                  </p>
                  <p>
                    Alongside personal consultations, the gurukulam also supports students who want to study Vedic astrology, numerology,
                    and related knowledge systems in a more structured and serious way.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-brand-dark font-display">What we focus on</h2>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mt-5 grid gap-3"
                >
                  {focusAreas.map((item) => (
                    <motion.div
                      key={item}
                      variants={fadeUp}
                      className="rounded-2xl bg-brand-cream p-4 text-sm text-brand-dark/75 ring-1 ring-brand-dark/8 transition-all duration-200 hover:ring-brand-gold/20 hover:bg-brand-cream/80"
                    >
                      {item}
                    </motion.div>
                  ))}
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Values */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-6 grid gap-6 lg:grid-cols-3"
          >
            {values.map((v) => (
              <motion.div key={v.title} variants={fadeUp}>
                <Card className="h-full p-6 group">
                  <h3 className="text-xl font-semibold text-brand-dark font-display transition-colors duration-200 group-hover:text-brand-gold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-dark/70">
                    {v.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
          >
            <Card className="mt-8 p-6 text-center sm:p-10">
              <h2 className="text-2xl font-semibold text-brand-dark font-display sm:text-3xl">Begin with your chart, then go deeper</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-brand-dark/70">
                Start with the free Kundali generator and AI guide for an initial understanding, then book a consultation when you want a fuller,
                more personal reading of your timing, tendencies, and remedies.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button href="/kundli">Generate Free Kundali</Button>
                <Button variant="secondary" href={BOOKING_URL}>
                  Book Consultation
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </main>
    </SiteShell>
  );
}
