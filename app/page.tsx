"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AdBanner } from "@/components/site/AdBanner";
import { KundaliGenerator } from "@/components/kundali/KundaliGenerator";
import { BOOKING_URL } from "@/lib/jyotirveda";

/* ─── Animation presets ─── */
const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const offerings = [
  {
    href: "/services",
    icon: (
      <svg className="h-6 w-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Personal Consultations",
    description:
      "Private one-to-one guidance for career, marriage, health tendencies, spiritual growth, Vastu, and numerology.",
    cta: "Explore Consultations"
  },
  {
    href: "/courses",
    icon: (
      <svg className="h-6 w-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Structured Learning",
    description:
      "Study Jyotisha in a calm, systematic format designed for sincere learners who want depth rather than scattered information.",
    cta: "Explore Courses"
  },
  {
    href: "/chat",
    icon: (
      <svg className="h-6 w-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Astrology Guide",
    description:
      "Begin with your own Kundali data, ask meaningful questions, and understand the core themes of your chart with clarity.",
    cta: "Open AI Chat"
  }
];

const pillars = [
  "Authentic Vedic astrology rooted in traditional principles",
  "Chart-based interpretation using Lagna, Moon sign, dashas, and house lords",
  "Guidance that is practical, spiritually grounded, and easy to understand",
  "A digital gurukulam for both seekers and serious students"
];

const guidanceAreas = [
  "Career direction & timing",
  "Marriage & relationship insight",
  "Vimshottari dasha understanding",
  "Planetary remedies & spiritual discipline",
  "Vastu & numerology guidance",
  "Foundational Jyotisha study"
];

export default function Home() {
  const [showKundaliForm, setShowKundaliForm] = React.useState(false);

  const openKundaliForm = () => {
    setShowKundaliForm(true);
    setTimeout(() => {
      document.getElementById("free-kundali")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 80);
  };

  return (
    <SiteShell>
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden">
          {/* Background blurs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-gold/12 blur-3xl animate-float" />
            <div className="absolute -bottom-24 -left-24 h-[380px] w-[380px] rounded-full bg-brand-dark/8 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-[480px] w-[480px] rounded-full bg-brand-accent/8 blur-3xl" />
          </div>

          <Container className="relative py-20 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="mx-auto max-w-4xl text-center"
            >
              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-sm px-4 py-2 ring-1 ring-brand-dark/8 shadow-sm"
              >
                <span className="text-sm text-brand-gold font-sanskrit">Satyam • Shivam • Sundaram</span>
                <span className="h-4 w-px bg-brand-dark/15" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-dark/70">
                  Jyotirveda Gurukulam
                </span>
              </motion.div>

              {/* Main heading — balanced symmetry */}
              <h1 className="text-3xl font-semibold leading-[1.15] tracking-tight text-brand-dark sm:text-5xl md:text-6xl lg:text-7xl font-display">
                Vedic Astrology for
                <br />
                <span className="bg-gradient-to-r from-brand-gold via-brand-accent to-brand-gold bg-clip-text text-transparent">
                  Clarity, Timing &amp; Direction
                </span>
              </h1>

              {/* Subheading — consistent line-lengths */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-brand-dark/65 sm:text-lg"
              >
                Generate your Kundali, understand your planetary periods, and go deeper through guided consultation or structured Jyotisha study.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              >
                <button
                  type="button"
                  onClick={openKundaliForm}
                  className="inline-flex items-center justify-center rounded-full bg-brand-gold px-8 py-4 text-base font-semibold text-brand-dark shadow-xl shadow-brand-gold/20 transition-all duration-200 hover:bg-brand-accent hover:shadow-brand-accent/25 active:scale-[0.97]"
                >
                  Generate Free Kundali
                </button>
                <Button href={BOOKING_URL} className="px-8 py-4 text-base shadow-xl shadow-brand-dark/10">
                  Book Consultation
                </Button>
              </motion.div>

              {/* Stats strip — equal-width columns */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mx-auto mt-14 grid max-w-3xl grid-cols-1 sm:grid-cols-3 gap-3"
              >
                {[
                  { label: "Read Your Chart", value: "Lagna, Moon sign, houses & dashas" },
                  { label: "Get Guidance", value: "Consultation for life decisions" },
                  { label: "Study Deeply", value: "Courses for serious learners" }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-white/65 backdrop-blur-sm p-4 ring-1 ring-brand-dark/8 transition-all duration-200 hover:bg-white/80 hover:ring-brand-gold/20"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark/40">{item.label}</div>
                    <div className="mt-2 text-xs font-medium leading-relaxed text-brand-dark/75 sm:text-sm">{item.value}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* ═══════════ KUNDALI FORM ═══════════ */}
        <AnimatePresence>
          {showKundaliForm && (
            <motion.section
              id="free-kundali"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease }}
              className="overflow-hidden"
            >
              <div className="py-16 sm:py-20">
                <Container className="max-w-5xl">
                  <KundaliGenerator
                    formId="free-kundali"
                    title="Generate Your Free Kundali"
                    description="Enter your birth details to calculate your chart through our own Jyotirveda API and review your houses, grahas, and complete Vimshottari dasha timeline."
                    compact
                  />
                </Container>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ═══════════ SECTION DIVIDER ═══════════ */}
        <div className="section-divider mx-auto max-w-lg" />

        {/* ═══════════ OFFERINGS ═══════════ */}
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Offerings"
              title="Three ways to begin your journey"
              description="Choose the format that fits your need: quick clarity, deep consultation, or structured traditional study."
              align="center"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-14 grid gap-6 md:grid-cols-3"
            >
              {offerings.map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Link href={item.href} className="group block h-full">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm p-8 ring-1 ring-brand-dark/8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] hover:ring-brand-gold/25">
                      {/* Corner glow */}
                      <div className="absolute right-0 top-0 h-28 w-28 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-gold/15 to-transparent blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

                      {/* Icon */}
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-cream ring-1 ring-brand-dark/8 text-xl transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                      </div>

                      <h3 className="text-xl font-semibold text-brand-dark font-display">{item.title}</h3>
                      <p className="mt-3 flex-1 text-sm text-brand-dark/65 leading-relaxed">{item.description}</p>
                      <div className="mt-6 flex items-center text-sm font-semibold text-brand-gold transition-colors duration-200 group-hover:text-brand-accent">
                        {item.cta}
                        <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1.5">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* ═══════════ ABOUT & PILLARS ═══════════ */}
        <section className="bg-brand-cream/40 py-20 sm:py-28">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left: About card */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease }}
                className="relative"
              >
                <div className="absolute -left-8 -top-8 h-56 w-56 rounded-full bg-brand-gold/12 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-8 text-white shadow-2xl sm:p-10">
                  <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-brand-gold/8 blur-3xl" />
                  <div className="relative">
                    <div className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-brand-gold">
                      ABOUT JYOTIRVEDA
                    </div>
                    <h2 className="text-3xl font-semibold leading-tight sm:text-4xl font-display">
                      Traditional wisdom,
                      <br />
                      explained with care.
                    </h2>
                    <p className="mt-5 text-brand-cream/70 leading-relaxed">
                      Jyotirveda Gurukulam is built for seekers who want more than generic astrology content. Our approach respects
                      classical Vedic principles while making interpretation clear, practical, and spiritually steady for modern life.
                    </p>
                    <p className="mt-4 text-brand-cream/70 leading-relaxed">
                      Guided by the teachings of Dr. Subrata Acharya, the platform brings together
                      astrology, numerology, Vastu, and reflective spiritual study in one focused space.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right: Pillars */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease }}
              >
                <SectionHeading
                  eyebrow="Why people stay"
                  title="A calmer, more serious astrology experience"
                  description="The goal is not fear, hype, or overpromising. It is thoughtful understanding of timing, tendencies, remedies, and conscious action."
                />
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mt-8 grid gap-3"
                >
                  {pillars.map((item) => (
                    <motion.li
                      key={item}
                      variants={fadeUp}
                      className="flex gap-3 rounded-2xl bg-white/80 backdrop-blur-sm p-4 ring-1 ring-brand-dark/8 transition-all duration-200 hover:ring-brand-gold/20"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm leading-relaxed text-brand-dark/75">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* ═══════════ GUIDANCE + TESTIMONIALS ═══════════ */}
        <section className="py-20 sm:py-28">
          <Container>
            <div className="grid items-start gap-14 lg:grid-cols-2">
              {/* Left: Guidance areas */}
              <div>
                <SectionHeading
                  eyebrow="Guidance Areas"
                  title="What you can explore here"
                  description="Whether you are looking for personal timing or deeper study, the platform is designed around practical questions that real seekers bring."
                />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="mt-8 grid gap-3 sm:grid-cols-2"
                >
                  {guidanceAreas.map((item) => (
                    <motion.div
                      key={item}
                      variants={fadeScale}
                      className="rounded-2xl bg-white/80 backdrop-blur-sm p-4 text-sm text-brand-dark/75 ring-1 ring-brand-dark/8 transition-all duration-200 hover:bg-white hover:ring-brand-gold/20 hover:text-brand-dark/85"
                    >
                      {item}
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right: Testimonials */}
              <div className="lg:pl-4">
                <SectionHeading
                  eyebrow="Testimonials"
                  title="Trusted by seekers and students"
                  description="A premium experience built for clarity, discipline, and thoughtful explanation."
                />
                <div className="mt-10 grid gap-5">
                  {[
                    {
                      quote:
                        "The explanations feel traditional yet refreshingly clear. The layout makes revision effortless and the chart details are actually useful.",
                      name: "Vedic Astrology Student"
                    },
                    {
                      quote:
                        "The consultation style is calm and insightful. It helped me understand timing in my chart without fear or confusion.",
                      name: "Consultation Client"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5, ease }}
                      className="rounded-2xl border-l-4 border-l-brand-gold bg-white/80 backdrop-blur-sm p-6 shadow-sm ring-1 ring-brand-dark/5 transition-all duration-300 hover:shadow-md hover:ring-brand-gold/15"
                    >
                      <p className="text-sm italic leading-relaxed text-brand-dark/75">&quot;{item.quote}&quot;</p>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-brand-gold/15 ring-1 ring-brand-gold/20" />
                        <span className="text-xs font-bold text-brand-dark/80 tracking-wide">{item.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-20">
              <AdBanner />
            </div>
          </Container>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="pb-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="relative overflow-hidden rounded-[2rem] bg-brand-dark px-6 py-10 text-center text-brand-cream shadow-2xl sm:px-12 sm:py-16"
            >
              {/* Background orbs */}
              <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-brand-gold/8 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-brand-gold/6 blur-3xl" />

              <div className="relative">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-gold/80">When you need deeper clarity</p>
                <h2 className="mt-4 text-3xl font-semibold font-display sm:text-4xl lg:text-5xl leading-tight">
                  Book a personalised
                  <br />
                  Jyotisha consultation
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-brand-cream/65 sm:text-base">
                  Use the free Kundali and AI guide to begin, then move into a complete reading for life themes, timing, remedies, and a more nuanced interpretation of your birth chart.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href={BOOKING_URL} className="bg-brand-gold text-brand-dark hover:bg-brand-accent shadow-lg shadow-brand-gold/20">
                    Book Consultation
                  </Button>
                  <Button variant="secondary" href="/about" className="bg-white/10 text-brand-cream hover:bg-white/15 ring-white/20">
                    Learn About Us
                  </Button>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

