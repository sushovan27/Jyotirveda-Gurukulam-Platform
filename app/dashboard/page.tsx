import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { Button } from "@/components/site/Button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SignOutButton } from "@/components/site/SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Seeker";

  return (
    <SiteShell>
      <main className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="My Dashboard"
            title={`Welcome back, ${displayName}`}
            description="Your personal Jyotirvedanta space—access your Kundli reports, chat history, and more."
          />

          {/* Quick actions */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "✦",
                title: "AI Kundli Generator",
                description: "Generate a detailed Vedic birth chart with AI interpretation.",
                href: "/kundli",
                cta: "Generate Kundli",
              },
              {
                icon: "☽",
                title: "Daily Horoscope",
                description: "Fresh Vedic rashi predictions refreshed daily.",
                href: "/horoscope",
                cta: "View Horoscope",
              },
              {
                icon: "ॐ",
                title: "AI Astrologer Chat",
                description: "Ask anything about Jyotish, your chart, or remedies.",
                href: "/chat",
                cta: "Start Chat",
              },
            ].map((item) => (
              <Card key={item.title} className="p-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gold/18 text-lg text-brand-dark">
                  {item.icon}
                </div>
                <h3
                  className="mt-3 text-base font-semibold text-brand-dark"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-brand-dark/70">
                  {item.description}
                </p>
                <div className="mt-4">
                  <Button href={item.href} className="w-full">
                    {item.cta}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent activity placeholder */}
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2
                className="text-base font-semibold text-brand-dark"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recent Kundli Reports
              </h2>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-brand-cream/60 py-8 text-center ring-1 ring-brand-dark/10">
                <span className="text-2xl">✦</span>
                <p className="text-sm text-brand-dark/60">
                  No reports yet. Generate your first Kundli.
                </p>
                <Button variant="secondary" href="/kundli">
                  Generate Kundli
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2
                className="text-base font-semibold text-brand-dark"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Recent Chats
              </h2>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-brand-cream/60 py-8 text-center ring-1 ring-brand-dark/10">
                <span className="text-2xl">ॐ</span>
                <p className="text-sm text-brand-dark/60">
                  No conversations yet. Ask our AI Astrologer.
                </p>
                <Button variant="secondary" href="/chat">
                  Start a Chat
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile card */}
          <Card className="mt-6 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  className="text-base font-semibold text-brand-dark"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  My Profile
                </h2>
                <p className="mt-1 text-sm text-brand-dark/60">
                  Signed in as{" "}
                  <span className="font-medium text-brand-dark">
                    {user.email}
                  </span>
                </p>
              </div>
              <SignOutButton />
            </div>
          </Card>
        </Container>
      </main>
    </SiteShell>
  );
}
