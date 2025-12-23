"use client";

import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/about", label: "About Gurukulam" },
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#4A0A0A]/10 bg-[#FFF7E6]/70 backdrop-blur">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4A0A0A] text-[#FFF7E6] ring-1 ring-[#D4AF37]/40">
              <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                ॐ
              </span>
            </div>
            <div className="leading-tight">
              <div
                className="text-sm font-semibold tracking-wide text-[#4A0A0A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Jyotirvedanta Gurukulam
              </div>
              <div className="text-xs text-[#4A0A0A]/70">
                Vedic astrology courses • Sacred study
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-[#4A0A0A]/80 hover:text-[#4A0A0A]"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" href="/login">
              Login
            </Button>
            <Button variant="primary" href="/signup">
              Join
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden rounded-xl p-2 ring-1 ring-[#4A0A0A]/15 text-[#4A0A0A]"
            aria-label="Open menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mt-3 rounded-2xl bg-white/70 ring-1 ring-[#4A0A0A]/10 p-3">
                <div className="flex flex-col gap-2">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-[#4A0A0A]/85 hover:bg-[#4A0A0A]/5"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <div className="mt-2 flex gap-2">
                    <Button variant="secondary" href="/login" className="w-full">
                      Login
                    </Button>
                    <Button variant="primary" href="/signup" className="w-full">
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Container>
    </header>
  );
}
