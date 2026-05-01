"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { courses } from "@/lib/content/catalog";
import { CourseBookingModal } from "@/components/site/CourseBookingModal";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CoursesPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleBookNow = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
    setBookingModalOpen(true);
  };

  return (
    <SiteShell>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-brand-gold/10 blur-3xl" />
        </div>

        <Container className="relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold mb-4">Learn from Masters</p>
            <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl text-brand-dark">
              Ancient Wisdom.
              <br />
              <span className="bg-gradient-to-r from-brand-gold via-brand-accent to-brand-gold bg-clip-text text-transparent">
                Modern Mastery.
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-brand-dark/65 leading-relaxed"
            >
              Learn Vedic Astrology, Numerology &amp; Vastu Shastra from certified masters through structured, in-depth programmes.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* Courses Grid */}
      <section id="courses-grid" className="relative pb-24 sm:pb-32">
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {courses.map((course) => (
              <motion.div
                key={course.slug}
                variants={fadeUp}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-brand-dark/8 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.15)] hover:border-brand-gold/20"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-semibold tracking-wider text-brand-accent">
                    {course.level}
                  </span>
                  <span className="text-sm font-medium text-brand-dark/55">
                    {course.duration}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-brand-dark mb-3 transition-colors duration-200 group-hover:text-brand-dark">
                  {course.title}
                </h3>
                
                <p className="text-brand-dark/65 text-sm leading-relaxed mb-8 flex-1">
                  {course.subtitle}
                </p>

                <div className="mb-8 space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-dark/45">
                    Curriculum Highlights
                  </h4>
                  <ul className="space-y-2">
                    {course.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex text-sm text-brand-dark/75 leading-relaxed">
                        <span className="mr-3 mt-0.5 text-brand-gold font-bold">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-brand-dark/8 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-brand-dark/45 uppercase tracking-wider">Tuition</span>
                    <span className="font-display text-2xl font-bold text-brand-dark">
                      {course.priceLabel}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBookNow(course.title)}
                    className="w-full rounded-xl bg-brand-dark px-6 py-3.5 font-semibold text-brand-cream transition-all duration-200 hover:bg-[#3A0707] hover:shadow-lg active:scale-[0.97] shadow-md"
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/918697332855" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-200 hover:scale-110 active:scale-100"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>

      <CourseBookingModal 
        isOpen={bookingModalOpen} 
        onClose={() => setBookingModalOpen(false)} 
        selectedCourse={selectedCourse} 
      />
    </SiteShell>
  );
}
