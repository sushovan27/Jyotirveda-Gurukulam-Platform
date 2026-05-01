"use client";

import Link from "next/link";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/kundli", label: "Kundli" },
  { href: "/horoscope", label: "Horoscope" },
  { href: "/chat", label: "AI Chat" },
  { href: "/courses", label: "Courses" },
  { href: "/ebooks", label: "eBooks" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [checking, setChecking] = React.useState(true);
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) {
      setChecking(false);
      return;
    }

    const supabase = createClient();

    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      setChecking(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
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
    <header className="sticky top-0 z-50 border-b border-brand-dark/10 bg-brand-cream/70 backdrop-blur">
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-dark text-brand-cream ring-1 ring-brand-gold/40">
              <span className="font-semibold font-display">
                ॐ
              </span>
            </div>
            <div className="leading-tight">
              <div
                className="text-sm font-semibold tracking-wide text-brand-dark font-display"
              >
                Jyotirvedanta Gurukulam
              </div>
              <div className="text-xs text-brand-dark/70">
                Vedic astrology courses • Sacred study
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHoveredLink(l.href)}
                onMouseLeave={() => setHoveredLink(null)}
                className="relative px-3 py-1.5 text-sm font-medium text-brand-dark/80 transition-colors hover:text-brand-dark"
              >
                {hoveredLink === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-brand-gold/15"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{l.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth buttons — desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {checking ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-brand-dark/10" />
            ) : user ? (
              <>
                <Button variant="ghost" href="/dashboard">
                  Dashboard
                </Button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-full bg-brand-cream px-5 py-2.5 text-sm font-semibold tracking-wide text-brand-dark ring-1 ring-brand-dark/15 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70"
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
            className="md:hidden rounded-xl p-2 ring-1 ring-brand-dark/15 text-brand-dark"
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
              <div className="mt-3 rounded-2xl bg-white/70 ring-1 ring-brand-dark/10 p-3">
                <div className="flex flex-col gap-2">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-brand-dark/85 hover:bg-brand-dark/5"
                    >
                      {l.label}
                    </Link>
                  ))}
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
                          className="w-full inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-2.5 text-sm font-semibold tracking-wide text-brand-cream ring-1 ring-brand-gold/40 transition hover:bg-[#3A0707]"
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
