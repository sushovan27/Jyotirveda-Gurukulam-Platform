import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";
import { SectionHeading } from "@/components/site/SectionHeading";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="py-14 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="About Gurukulam"
            title="A modern space shaped by traditional rigor"
            description="This platform is designed to feel sacred, calm, and trustworthy—while staying modern, fast, and secure."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3
                className="text-lg font-semibold text-brand-dark font-display"
              >
                Our intention
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-dark/75">
                Jyotirvedanta Gurukulam exists to present authentic Jyotish learning
                with clarity—without noise, hype, or distraction. Content is structured
                for consistent practice and deep understanding.
              </p>
            </Card>

            <Card className="p-6">
              <h3
                className="text-lg font-semibold text-brand-dark font-display"
              >
                What you can expect
              </h3>
              <ul className="mt-3 grid gap-2 text-sm text-brand-dark/75">
                <li>• Clean modules and course paths</li>
                <li>• Premium PDFs for revision and reference</li>
                <li>• Secure account and purchase history</li>
                <li>• A calm, premium Vedic aesthetic</li>
              </ul>
            </Card>
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
