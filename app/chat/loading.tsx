import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";

export default function ChatLoading() {
  return (
    <SiteShell>
      <main className="flex flex-col h-[calc(100vh-65px)]">
        <Container className="flex flex-1 flex-col overflow-hidden py-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-[#4A0A0A]/20" />
            <div>
              <div className="h-5 w-32 animate-pulse rounded bg-[#4A0A0A]/20 mb-2" />
              <div className="h-3 w-24 animate-pulse rounded bg-[#4A0A0A]/10" />
            </div>
          </div>
          <div className="flex-1 animate-pulse rounded-2xl bg-[#FFF7E6]/50 p-4 ring-1 ring-[#4A0A0A]/10">
            <div className="flex flex-col gap-4">
              <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-[#4A0A0A]/10" />
              <div className="h-24 w-2/3 self-end animate-pulse rounded-2xl bg-[#4A0A0A]/20" />
            </div>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="h-12 flex-1 animate-pulse rounded-2xl bg-white ring-1 ring-[#4A0A0A]/15" />
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#4A0A0A]/20" />
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
