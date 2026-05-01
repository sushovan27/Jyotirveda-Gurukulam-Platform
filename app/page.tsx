"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Ornament } from "@/components/site/Ornament";
import { Button } from "@/components/site/Button";
import { Card } from "@/components/site/Card";
import { SectionHeading } from "@/components/site/SectionHeading";
import { AdBanner } from "@/components/site/AdBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-gold/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-brand-dark/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-[520px] w-[520px] rounded-full bg-brand-accent/10 blur-3xl" />
          </div>

          <Container className="relative py-16 sm:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mx-auto max-w-4xl text-center"
            >
              <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-4 py-2 ring-1 ring-brand-dark/10 shadow-sm mb-8">
                <span className="text-sm text-brand-gold font-sanskrit">
                  सत्यम् • शिवम् • सुन्दरम्
                </span>
                <span className="h-4 w-[1px] bg-brand-dark/20" />
                <span className="text-xs font-semibold tracking-widest uppercase text-brand-dark/80">
                  Premium Digital Gurukulam
                </span>
              </div>

              <h1 className="text-balance text-5xl font-semibold leading-tight tracking-tight text-brand-dark sm:text-6xl md:text-7xl font-display">
                Align Your Destiny with <br/><span className="text-brand-gold">Cosmic Wisdom</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-brand-dark/75 sm:text-xl">
                Authentic Vedic Astrology, Numerology, and Vastu Shastra guided by Dr. Subrata Acharya. Discover your path through expert consultation or structured learning.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button href="/services" className="px-8 py-4 text-base shadow-xl shadow-brand-dark/10">
                  Book Consultation
                </Button>
                <Button variant="secondary" href="/courses" className="px-8 py-4 text-base">
                  Explore Courses
                </Button>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Pathways Section */}
        <section className="py-16 sm:py-24 bg-brand-cream/50">
          <Container>
            <SectionHeading
              eyebrow="Your Journey"
              title="Choose Your Path of Wisdom"
              description="Whether you seek immediate clarity or lifelong knowledge, our gurukulam provides the perfect pathway."
              align="center"
            />

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {/* Services Card */}
              <motion.div variants={fadeUp}>
                <Link href="/services" className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-brand-dark/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/15">
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-gold/20 to-transparent blur-2xl" />
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cream text-brand-gold ring-1 ring-brand-gold/20 transition-transform group-hover:scale-110">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-brand-dark mb-3 font-display">Consultations</h3>
                    <p className="text-brand-dark/70 leading-relaxed flex-1">
                      One-on-one sessions with Guruji for Astrology, Vastu, Numerology, and Marriage Matching.
                    </p>
                    <div className="mt-8 flex items-center font-semibold text-brand-gold group-hover:text-brand-accent">
                      Book Now <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Courses Card */}
              <motion.div variants={fadeUp}>
                <Link href="/courses" className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-brand-dark/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/15">
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-gold/20 to-transparent blur-2xl" />
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cream text-brand-gold ring-1 ring-brand-gold/20 transition-transform group-hover:scale-110">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-brand-dark mb-3 font-display">Masterclasses</h3>
                    <p className="text-brand-dark/70 leading-relaxed flex-1">
                      Structured learning programs designed for serious seekers to master Vedic sciences.
                    </p>
                    <div className="mt-8 flex items-center font-semibold text-brand-gold group-hover:text-brand-accent">
                      View Curriculum <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* eBooks Card */}
              <motion.div variants={fadeUp}>
                <Link href="/ebooks" className="group block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-8 ring-1 ring-brand-dark/10 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-gold/15">
                    <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-gold/20 to-transparent blur-2xl" />
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-cream text-brand-gold ring-1 ring-brand-gold/20 transition-transform group-hover:scale-110">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-brand-dark mb-3 font-display">eBooks</h3>
                    <p className="text-brand-dark/70 leading-relaxed flex-1">
                      Premium study-ready PDFs with clean structure, perfect for quick reference and deep study.
                    </p>
                    <div className="mt-8 flex items-center font-semibold text-brand-gold group-hover:text-brand-accent">
                      Browse Library <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* Gurukulam Method */}
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-brand-gold/15 blur-3xl" />
                <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-10 text-white shadow-2xl">
                  <div className="mb-6 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-widest text-brand-gold">
                    WHY GURUKULAM?
                  </div>
                  <h2 className="text-3xl font-semibold leading-tight sm:text-4xl font-display">
                    Traditional Wisdom,<br/> Modern Clarity.
                  </h2>
                  <p className="mt-6 text-brand-cream/70 leading-relaxed">
                    We believe ancient sciences shouldn't be diluted or overly complex. Our platform strips away the noise, delivering authentic Jyotish and Vastu principles through a highly focused, distraction-free environment.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      "Vedic-first explanations (no noise)",
                      "Designed for focused self-study",
                      "Premium layout & typography"
                    ].map((t) => (
                      <li key={t} className="flex items-center gap-3 text-brand-cream/90">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="lg:pl-8">
                <SectionHeading
                  eyebrow="Trust & tradition"
                  title="Over 5,000+ happy seekers guided"
                  description="A premium experience built for clarity. Read what our students and clients have to say."
                />
                <div className="mt-10 grid gap-6">
                  {[
                    { quote: "The explanations feel traditional yet refreshingly clear. The layout makes revision effortless.", name: "Vedic Astrology Student" },
                    { quote: "Guruji's consultation gave me profound clarity. Highly recommend the marriage matching.", name: "Consultation Client" }
                  ].map((t, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-brand-dark/5 border-l-4 border-l-brand-gold"
                    >
                      <p className="text-base italic leading-relaxed text-brand-dark/80">"{t.quote}"</p>
                      <div className="mt-4 text-sm font-bold text-brand-dark">{t.name}</div>
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
      </main>
    </SiteShell>
  );
}
