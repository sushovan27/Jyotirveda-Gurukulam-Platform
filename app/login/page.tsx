"use client";

import * as React from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const redirectTo =
    rawRedirectTo.startsWith("/") && !rawRedirectTo.startsWith("//") ? rawRedirectTo : "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    errorParam === "auth_callback_failed" ? "Authentication failed. Please try again." : null
  );
  const [message, setMessage] = React.useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
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
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Password reset link sent. Check your inbox.");
    }

    setLoading(false);
  };

  const inputCls =
    "w-full rounded-xl border border-brand-dark/20 bg-white/80 px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/40";

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={handleLogin} className="grid gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-brand-dark">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className={inputCls}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-brand-dark">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-brand-gold transition hover:text-[#B8941F]"
            >
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className={inputCls}
            autoComplete="current-password"
          />
        </div>

        {error ? (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        ) : null}

        {message ? (
          <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 ring-1 ring-green-200">
            {message}
          </div>
        ) : null}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-brand-dark/70">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-brand-dark underline underline-offset-4 transition hover:text-brand-gold"
        >
          Create one
        </Link>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <SiteShell>
      <main className="py-14 sm:py-20">
        <Container className="max-w-md">
          <div className="mb-8 text-center">
            <div className="text-3xl font-semibold text-brand-dark font-display">Welcome Back</div>
            <p className="mt-2 text-sm text-brand-dark/70">
              Sign in to access your Kundli reports, chat history, and more.
            </p>
          </div>

          <Suspense fallback={<Card className="p-6 sm:p-8 text-sm text-brand-dark/60">Loading login...</Card>}>
            <LoginForm />
          </Suspense>
        </Container>
      </main>
    </SiteShell>
  );
}
