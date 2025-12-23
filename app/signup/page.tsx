import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Card } from "@/components/site/Card";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <main className="py-14 sm:py-16">
        <Container className="max-w-3xl">
          <Card className="p-6 sm:p-8">
            <h1
              className="text-2xl font-semibold text-[#4A0A0A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#4A0A0A]/75">
              Placeholder policy text. We will finalize this once authentication, payments,
              and data storage are implemented.
            </p>

            <div className="mt-6 space-y-4 text-sm text-[#4A0A0A]/75">
              <p>
                We intend to collect only what is necessary for account access, purchase
                verification, and customer support.
              </p>
              <p>
                Payment details will be processed by the payment gateway; we will store only
                essential references and status for access control.
              </p>
            </div>
          </Card>
        </Container>
      </main>
    </SiteShell>
  );
}
