"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { BOOKING_URL } from "@/lib/jyotirveda";

const exploreLinks = [
  { href: "/kundli", label: "Free Kundali Generator" },
  { href: "/chat", label: "AI Astrology Guide" },
  { href: "/horoscope", label: "Daily Horoscope" },
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/services", label: "Consultation Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-brand-dark/8 bg-gradient-to-b from-brand-cream to-[#FFF0CC]/30">
      {/* Top divider glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <Container className="py-12 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-10 md:grid-cols-3"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-dark text-brand-cream ring-1 ring-brand-gold/40">
                <span className="text-xs font-semibold font-display tracking-wide">JG</span>
              </div>
              <span className="text-base font-semibold text-brand-dark font-display">Jyotirveda Gurukulam</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-dark/65">
              A focused digital gurukulam for Vedic astrology, Kundali insight, traditional study, and spiritually grounded guidance.
            </p>
            <div className="mt-5">
              <Button href={BOOKING_URL} className="bg-brand-gold text-brand-dark hover:bg-brand-accent">
                Book Consultation
              </Button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark/50">Explore</div>
            <div className="mt-4 grid gap-2.5 text-sm">
              {exploreLinks.map((link) => (
                <Link
                  key={link.href}
                  className="text-brand-dark/70 transition-colors duration-150 hover:text-brand-gold"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-brand-dark/50">Legal &amp; Support</div>
            <div className="mt-4 grid gap-2.5 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  className="text-brand-dark/70 transition-colors duration-150 hover:text-brand-gold"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 text-xs leading-relaxed text-brand-dark/50">
              For detailed interpretation, timing analysis, remedies, and one-to-one guidance, consultations remain the best next step after the free tools.
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-brand-dark/8 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-brand-dark/45">
            © {new Date().getFullYear()} Jyotirveda Gurukulam. All rights reserved.
          </p>
          <p className="text-xs text-brand-dark/35 tracking-wide">
            Satyam · Shivam · Sundaram
          </p>
        </div>
      </Container>
    </footer>
  );
}
