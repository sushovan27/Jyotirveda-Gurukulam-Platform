import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";

export default function KundliLoading() {
  return (
    <SiteShell>
      <main className="flex flex-col min-h-[calc(100vh-65px)] bg-[#FFF7E6]">
        <Container className="py-10">
          <div className="mx-auto max-w-4xl">
            <div className="h-8 w-64 animate-pulse rounded bg-[#4A0A0A]/20 mb-4 mx-auto" />
            <div className="h-4 w-96 animate-pulse rounded bg-[#4A0A0A]/10 mb-10 mx-auto" />
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="h-[400px] animate-pulse rounded-2xl bg-white shadow ring-1 ring-[#4A0A0A]/10" />
              <div className="h-[400px] animate-pulse rounded-2xl bg-white shadow ring-1 ring-[#4A0A0A]/10" />
            </div>
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
