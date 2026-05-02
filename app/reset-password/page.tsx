"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Password successfully updated! Redirecting to dashboard...");
    
    // Give user a moment to read the success message before redirecting
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 2000);
  };

  const inputCls =
    "w-full rounded-xl border border-brand-dark/20 bg-white/80 px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/40";

  return (
    <SiteShell>
      <main className="py-14 sm:py-20">
        <Container className="max-w-md">
          <div className="mb-8 text-center">
            <div className="text-3xl font-semibold text-brand-dark font-display">Reset Password</div>
            <p className="mt-2 text-sm text-brand-dark/70">
              Enter your new password below.
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <form onSubmit={handleResetPassword} className="grid gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputCls}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-brand-dark">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className={inputCls}
                  autoComplete="new-password"
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
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Card>
        </Container>
      </main>
    </SiteShell>
  );
}
