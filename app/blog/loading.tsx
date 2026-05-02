import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";

export default function BlogLoading() {
  return (
    <SiteShell>
      <main className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Jyotisha Vani"
            title="Wisdom from the Stars"
            description="Explore our articles on Vedic astrology, practical remedies, and deeper spiritual study."
            align="center"
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="flex h-[380px] w-full animate-pulse flex-col overflow-hidden rounded-2xl bg-white/60 ring-1 ring-brand-dark/5"
              >
                <div className="h-48 w-full bg-brand-dark/5" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 h-3 w-20 rounded bg-brand-dark/8" />
                  <div className="mb-2.5 h-5 w-full rounded bg-brand-dark/10" />
                  <div className="mb-2.5 h-5 w-3/4 rounded bg-brand-dark/10" />
                  <div className="mt-auto space-y-2">
                    <div className="h-3 w-full rounded bg-brand-dark/5" />
                    <div className="h-3 w-full rounded bg-brand-dark/5" />
                    <div className="h-3 w-2/3 rounded bg-brand-dark/5" />
                  </div>
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-dark/5">
                    <div className="h-6 w-20 rounded-full bg-brand-dark/5" />
                    <div className="h-3 w-16 rounded bg-brand-dark/8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
