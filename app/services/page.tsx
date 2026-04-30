import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceSection } from "@/components/site/ServiceSection";
import { AdBanner } from "@/components/site/AdBanner";

export const metadata = {
  title: "Personal Consultations | JyotirVedanta Gurukulam",
  description: "Book an online consultation with Dr. Subrata Acharya for profound insights and practical remedies.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#D4AF37]/15 blur-3xl" />
          </div>
          <Container className="relative">
            <SectionHeading
              eyebrow="Expert Guidance"
              title="Personal Consultations"
              description="Connect with Dr. Subrata Acharya for deep astrological, numerological, and Vastu insights."
              align="center"
            />
          </Container>
        </section>

        {/* Services List */}
        <section className="pb-16 sm:pb-24">
          <Container>
            <ServiceSection />
            <div className="mt-16">
              <AdBanner />
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
