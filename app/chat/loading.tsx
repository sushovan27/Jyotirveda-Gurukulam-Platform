import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";

// Staggered pulse + golden glow loading skeleton for the chat page
export default function ChatLoading() {
  return (
    <SiteShell>
      <main className="flex flex-col h-[calc(100vh-65px)]">
        <Container className="flex flex-1 flex-col overflow-hidden py-6">
          {/* Header skeleton */}
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-10 w-10 animate-pulse rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(74,10,10,0.15) 100%)",
                boxShadow: "0 0 12px 2px rgba(212,175,55,0.15)",
              }}
            />
            <div className="flex flex-col gap-2">
              <div
                className="h-5 w-36 animate-pulse rounded-lg"
                style={{
                  background: "rgba(212,175,55,0.15)",
                  animationDelay: "0.1s",
                }}
              />
              <div
                className="h-3 w-24 animate-pulse rounded"
                style={{
                  background: "rgba(74,10,10,0.08)",
                  animationDelay: "0.2s",
                }}
              />
            </div>
          </div>

          {/* Messages area skeleton */}
          <div
            className="flex-1 rounded-2xl p-4 ring-1 ring-brand-dark/10"
            style={{ background: "rgba(255,247,230,0.5)" }}
          >
            <div className="flex flex-col gap-5">
              {/* Bot bubble */}
              <div className="flex gap-3">
                <div
                  className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)",
                    boxShadow: "0 0 8px 1px rgba(212,175,55,0.2)",
                    animationDelay: "0.05s",
                  }}
                />
                <div
                  className="h-14 w-3/4 animate-pulse rounded-2xl rounded-tl-sm"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    boxShadow: "0 0 10px 1px rgba(212,175,55,0.12)",
                    animationDelay: "0.1s",
                  }}
                />
              </div>

              {/* User bubble */}
              <div className="flex flex-row-reverse gap-3">
                <div
                  className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full"
                  style={{
                    background: "rgba(74,10,10,0.18)",
                    animationDelay: "0.15s",
                  }}
                />
                <div
                  className="h-10 w-1/2 animate-pulse rounded-2xl rounded-tr-sm"
                  style={{
                    background: "rgba(74,10,10,0.12)",
                    animationDelay: "0.2s",
                  }}
                />
              </div>

              {/* Bot bubble 2 */}
              <div className="flex gap-3">
                <div
                  className="mt-1 h-8 w-8 shrink-0 animate-pulse rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(212,175,55,0.1) 100%)",
                    boxShadow: "0 0 8px 1px rgba(212,175,55,0.2)",
                    animationDelay: "0.25s",
                  }}
                />
                <div
                  className="h-20 w-2/3 animate-pulse rounded-2xl rounded-tl-sm"
                  style={{
                    background: "rgba(212,175,55,0.1)",
                    boxShadow: "0 0 10px 1px rgba(212,175,55,0.12)",
                    animationDelay: "0.3s",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Input skeleton */}
          <div className="mt-3 flex items-end gap-2">
            <div
              className="h-12 w-12 shrink-0 animate-pulse rounded-full"
              style={{
                background: "rgba(255,247,230,0.8)",
                border: "1px solid rgba(74,10,10,0.12)",
                animationDelay: "0.35s",
              }}
            />
            <div
              className="h-12 flex-1 animate-pulse rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(74,10,10,0.12)",
                animationDelay: "0.4s",
              }}
            />
            <div
              className="h-12 w-12 shrink-0 animate-pulse rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(74,10,10,0.25) 0%, rgba(212,175,55,0.2) 100%)",
                boxShadow: "0 0 10px 2px rgba(212,175,55,0.18)",
                animationDelay: "0.45s",
              }}
            />
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
