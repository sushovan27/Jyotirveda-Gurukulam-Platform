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
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" }
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [checking, setChecking] = React.useState(true);
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const settingsRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [settingsOpen]);

  const handleSignOut = async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setSettingsOpen(false);
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
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-xl bg-brand-dark text-brand-cream ring-1 ring-brand-gold/40 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative font-semibold font-display text-xs sm:text-sm tracking-wide">JG</span>
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-[13px] sm:text-sm font-semibold tracking-wide text-brand-dark font-display truncate">Jyotirveda Gurukulam</div>
              <div className="text-[10px] sm:text-[11px] text-brand-dark/55 tracking-wide truncate hidden sm:block">Vedic astrology & sacred study</div>
            </div>
          </Link>

          {/* Center: Nav Links */}
          <nav className="hidden items-center justify-center gap-0.5 md:flex">
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

          {/* Right: Book Consultation + Settings Gear */}
          <div className="hidden items-center justify-end gap-2 md:flex">
            <Button href={BOOKING_URL} className="bg-brand-gold text-brand-dark hover:bg-brand-accent">
              Book Consultation
            </Button>
            <div ref={settingsRef} className="relative">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="rounded-full p-2.5 text-brand-dark/75 transition-all duration-200 hover:bg-brand-dark/5 hover:text-brand-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70"
                aria-label="Settings"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              <AnimatePresence>
                {settingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 backdrop-blur-xl ring-1 ring-brand-dark/10 shadow-xl shadow-brand-dark/5 overflow-hidden"
                  >
                    <div className="py-2">
                      {checking ? (
                        <div className="px-4 py-3">
                          <div className="h-4 w-20 animate-pulse rounded bg-brand-dark/10" />
                        </div>
                      ) : user ? (
                        <>
                          <div className="px-4 py-2.5 border-b border-brand-dark/5">
                            <div className="text-xs text-brand-dark/50 truncate">{user.email}</div>
                          </div>
                          <Link
                            href="/dashboard"
                            onClick={() => setSettingsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-brand-gold/10 hover:text-brand-dark transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                            </svg>
                            Dashboard
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            onClick={() => setSettingsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-brand-gold/10 hover:text-brand-dark transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                              <polyline points="10 17 15 12 10 7" />
                              <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                            Sign In
                          </Link>
                          <Link
                            href="/signup"
                            onClick={() => setSettingsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-dark/80 hover:bg-brand-gold/10 hover:text-brand-dark transition-colors"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="8.5" cy="7" r="4" />
                              <line x1="20" y1="8" x2="20" y2="14" />
                              <line x1="23" y1="11" x2="17" y2="11" />
                            </svg>
                            Sign Up
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile hamburger */}
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
