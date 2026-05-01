"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  const inputCls =
    "w-full rounded-xl border border-brand-dark/20 bg-white/80 px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/40";

  if (success) {
    return (
      <SiteShell>
        <main className="py-14 sm:py-20">
          <Container className="max-w-md">
            <Card className="p-6 sm:p-8 text-center">
              <div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-green-50 text-green-600 ring-1 ring-green-200">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2
                className="mt-5 text-xl font-semibold text-brand-dark font-display"
              >
                Check your email
              </h2>
              <p className="mt-2 text-sm text-brand-dark/70">
                We&apos;ve sent a confirmation link to{" "}
                <strong className="text-brand-dark">{email}</strong>. Click the
                link to activate your account.
              </p>
              <div className="mt-6">
                <Button variant="secondary" href="/login" className="w-full">
                  Go to Sign In
                </Button>
              </div>
            </Card>
          </Container>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main className="py-14 sm:py-20">
        <Container className="max-w-md">
          <div className="mb-8 text-center">
            <div
              className="text-3xl font-semibold text-brand-dark font-display"
            >
              Create Your Account
            </div>
            <p className="mt-2 text-sm text-brand-dark/70">
              Join the digital gurukulam—save your Kundli reports, chat history,
              and daily horoscopes.
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSignup} className="grid gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  required
                  className={inputCls}
                  autoComplete="name"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={inputCls}
                  autoComplete="email"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                  className={inputCls}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={6}
                  className={inputCls}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Creating account…
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-brand-dark/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-dark underline underline-offset-4 hover:text-brand-gold transition"
              >
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-brand-dark/50">
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-brand-dark/70">
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline hover:text-brand-dark/70"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </Card>
        </Container>
      </main>
    </SiteShell>
  );
}
