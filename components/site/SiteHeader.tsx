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

          {/* Auth buttons — desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {checking ? (
              <div className="h-9 w-20 animate-pulse rounded-full bg-[#4A0A0A]/10" />
            ) : user ? (
              <>
                <Button variant="ghost" href="/dashboard">
                  Dashboard
                </Button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-full bg-[#FFF7E6] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#4A0A0A] ring-1 ring-[#4A0A0A]/15 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70"
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
                          className="w-full inline-flex items-center justify-center rounded-full bg-[#4A0A0A] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#FFF7E6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#3A0707]"
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
