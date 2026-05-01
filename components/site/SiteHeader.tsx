"use client";

import Link from "next/link";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { BOOKING_URL } from "@/lib/jyotirveda";
import type { User } from "@supabase/supabase-js";

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/kundli", label: "Kundli" },
  { href: "/horoscope", label: "Horoscope" },
  { href: "/chat", label: "AI Chat" },
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [checking, setChecking] = React.useState(true);
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      setChecking(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: nextUser } }) => {
      setUser(nextUser);
      setChecking(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-brand-dark/10 bg-brand-cream/80 backdrop-blur-xl shadow-[0_1px_20px_-6px_rgba(74,10,10,0.08)]"
          : "border-transparent bg-brand-cream/60 backdrop-blur-md"
      ].join(" ")}
    >
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-brand-dark text-brand-cream ring-1 ring-brand-gold/40 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              {/* Subtle shimmer overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative font-semibold font-display text-xs sm:text-sm tracking-wide">JG</span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-[13px] sm:text-sm font-semibold tracking-wide text-brand-dark font-display truncate">Jyotirveda Gurukulam</div>
              <div className="text-[10px] sm:text-[11px] text-brand-dark/55 tracking-wide truncate hidden sm:block">Vedic astrology & sacred study</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-3 py-1.5 text-sm font-medium text-brand-dark/75 transition-colors duration-200 hover:text-brand-dark"
              >
                {hoveredLink === link.href ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-brand-gold/12"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button href={BOOKING_URL} className="bg-brand-gold text-brand-dark hover:bg-brand-accent">
              Book Consultation
            </Button>
            {checking ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-brand-dark/10" />
            ) : user ? (
              <>
                <Button variant="ghost" href="/dashboard">
                  Dashboard
                </Button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-full bg-brand-cream px-5 py-2.5 text-sm font-semibold tracking-wide text-brand-dark ring-1 ring-brand-dark/15 transition-all duration-200 hover:bg-white hover:ring-brand-dark/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 active:scale-[0.97]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" href="/login">
                  Login
                </Button>
                <Button variant="primary" href="/signup">
                  Join
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="rounded-xl p-2 text-brand-dark ring-1 ring-brand-dark/15 transition-all duration-200 hover:bg-brand-dark/5 active:scale-95 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? "M6 6l12 12M6 18L18 6" : "M4 7h16M4 12h16M4 17h16"}
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
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden md:hidden"
            >
              <div className="mt-3 rounded-2xl bg-white/80 backdrop-blur-sm p-3 ring-1 ring-brand-dark/10 shadow-lg">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-dark/85 transition-colors duration-150 hover:bg-brand-gold/10 hover:text-brand-dark block"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="my-2 h-px bg-brand-dark/10" />
                  <Button href={BOOKING_URL} className="w-full bg-brand-gold text-brand-dark hover:bg-brand-accent">
                    Book Consultation
                  </Button>
                  <div className="mt-2 flex gap-2">
                    {user ? (
                      <>
                        <Button variant="secondary" href="/dashboard" className="w-full">
                          Dashboard
                        </Button>
                        <button
                          onClick={() => {
                            setOpen(false);
                            void handleSignOut();
                          }}
                          className="inline-flex w-full items-center justify-center rounded-full bg-brand-dark px-5 py-2.5 text-sm font-semibold tracking-wide text-brand-cream ring-1 ring-brand-gold/40 transition-all duration-200 hover:bg-[#3A0707]"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Button variant="secondary" href="/login" className="w-full">
                          Login
                        </Button>
                        <Button variant="primary" href="/signup" className="w-full">
                          Join
                        </Button>
                      </>
                    )}
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
