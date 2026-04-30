"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    errorParam === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null
  );
  const [message, setMessage] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push(redirectTo);
    router.refresh();
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address first.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Password reset link sent! Check your inbox.");
    }
    setLoading(false);
  };

  const inputCls =
    "w-full rounded-xl border border-[#4A0A0A]/20 bg-white/80 px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 placeholder:text-[#4A0A0A]/40";

  return (
    <SiteShell>
      <main className="py-14 sm:py-20">
        <Container className="max-w-md">
          <div className="mb-8 text-center">
            <div
              className="text-3xl font-semibold text-[#4A0A0A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome Back
            </div>
            <p className="mt-2 text-sm text-[#4A0A0A]/70">
              Sign in to access your Kundli reports, chat history, and more.
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleLogin} className="grid gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#4A0A0A]">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#4A0A0A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#D4AF37] hover:text-[#B8941F] transition"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputCls}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
                  {message}
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
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-[#4A0A0A]/70">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#4A0A0A] underline underline-offset-4 hover:text-[#D4AF37] transition"
              >
                Create one
              </Link>
            </div>
          </Card>
        </Container>
      </main>
    </SiteShell>
  );
}
