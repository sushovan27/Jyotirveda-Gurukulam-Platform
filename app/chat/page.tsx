"use client";

import * as React from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Button } from "@/components/site/Button";
import { ConsultationModal } from "@/components/chat/ConsultationModal";
import { TokenRechargeCard } from "@/components/chat/TokenRechargeCard";
import type { ConsultationDetails } from "@/components/chat/ConsultationModal";
import {
  AI_DISCLAIMER,
  BOOKING_URL,
  CHAT_SESSION_KEY,
  REDIRECT_MESSAGE,
  readStoredKundali,
  readStoredKundaliRequest,
  saveStoredKundali,
  saveStoredKundaliRequest,
  type StoredKundaliRequest
} from "@/lib/jyotirveda";
import type { KundaliResponse } from "@/types/kundali";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** WhatsApp number for astrologer consultations (E.164 without '+') */
const ASTROLOGER_WHATSAPP = "918697332855";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MessageMetadata = {
  isConsultationStart?: boolean;
  name?: string;
  dob?: string;
  tob?: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: MessageMetadata;
  stage?: number;
  showBooking?: boolean;
};

// ---------------------------------------------------------------------------
// Suggested questions
// ---------------------------------------------------------------------------

const SUGGESTED = [
  "What does my Lagna reveal about my personality?",
  "Which current dasha influences my career path?",
  "How are Rahu and Ketu affecting my chart right now?",
  "What practical remedies support balance in my horoscope?"
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const meta = message.metadata;

  // Build a safe WhatsApp URL when consultation metadata is present
  const whatsappUrl = React.useMemo(() => {
    if (!meta?.isConsultationStart) return null;
    const text = `Namaste! I'd like a consultation.\nName: ${meta.name ?? ""}\nDate of Birth: ${meta.dob ?? ""}\nTime of Birth: ${meta.tob ?? ""}`;
    return `https://wa.me/${ASTROLOGER_WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [meta]);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
          isUser
            ? "bg-brand-dark text-brand-cream"
            : "bg-brand-gold/20 text-brand-dark ring-1 ring-brand-gold/40"
        }`}
      >
        {isUser ? "You" : "Jy"}
      </div>

      <div className="flex max-w-[86%] flex-col gap-2 sm:max-w-[78%]">
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-brand-dark text-brand-cream"
              : "rounded-tl-sm bg-white/85 text-[#1b1b1b] ring-1 ring-brand-dark/10"
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content || <TypingIndicator />}</div>
        </div>

        {/* WhatsApp redirect button — only on consultation-start bot message */}
        {!isUser && whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 self-start rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
          >
            📲 Send to Astrologer on WhatsApp
          </a>
        )}

        {!isUser && !whatsappUrl ? (
          <p className="max-w-[34rem] text-[11px] leading-relaxed text-brand-dark/45">{AI_DISCLAIMER}</p>
        ) : null}

        {!isUser && message.showBooking ? (
          <Button href={BOOKING_URL} className="w-fit bg-brand-gold text-brand-dark hover:bg-brand-accent">
            Book Now
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-2 w-2 rounded-full bg-brand-gold animate-bounce"
          style={{ animationDelay: `${index * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste. I am Jyoti, your Vedic astrology guide. Generate your Kundali first so I can answer using your actual Lagna, Moon sign, dasha flow, and planetary placements."
    }
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [exchangeCount, setExchangeCount] = React.useState(0);
  const [kundali, setKundali] = React.useState<KundaliResponse | null>(null);
  const [storedRequest, setStoredRequest] = React.useState<StoredKundaliRequest | null>(null);
  const [chartLoading, setChartLoading] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const storedCount = window.sessionStorage.getItem(CHAT_SESSION_KEY);
    setExchangeCount(storedCount ? Number.parseInt(storedCount, 10) || 0 : 0);
    setKundali(readStoredKundali());
    setStoredRequest(readStoredKundaliRequest());
    
    // Auto-trigger modal on first load if no kundali
    if (!readStoredKundali()) {
        setShowModal(true);
    }
  }, []);

  const resolveKundaliFromApi = React.useCallback(
    async (requestPayload?: StoredKundaliRequest | null) => {
      const sourceRequest = requestPayload ?? storedRequest ?? readStoredKundaliRequest();
      if (!sourceRequest) {
        return null;
      }

      const response = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sourceRequest)
      });

      const json = await response.json();
      if (!response.ok || json.error) {
        throw new Error(json.error?.message || json.error || "Unable to load your Kundali from the API.");
      }

      const payload = json.interpretation as KundaliResponse;
      saveStoredKundali(payload);
      saveStoredKundaliRequest(sourceRequest);
      setStoredRequest(sourceRequest);
      setKundali(payload);
      return payload;
    },
    [storedRequest]
  );

  React.useEffect(() => {
    if (kundali || !storedRequest) {
      return;
    }

    setChartLoading(true);
    resolveKundaliFromApi(storedRequest)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load your Kundali from the API.");
      })
      .finally(() => {
        setChartLoading(false);
      });
  }, [kundali, resolveKundaliFromApi, storedRequest]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const remainingQuestions = Math.max(0, 4 - exchangeCount);
  const chatLocked = exchangeCount >= 5;
  const displayName = kundali?.name ?? storedRequest?.name ?? null;

  const addAssistantMessage = React.useCallback((content: string, stage?: number, metadata?: MessageMetadata) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content,
        stage,
        metadata,
        showBooking: typeof stage === "number" && stage >= 3
      }
    ]);
  }, []);

  const handleGenerateChart = async (details: ConsultationDetails) => {
    setShowModal(false);
    setChartLoading(true);
    setError(null);

    try {
      const payload = await resolveKundaliFromApi({
        name: details.name,
        dob: details.dob,
        tob: details.tob,
        pob: details.pob
      });
      if (!payload) {
        throw new Error("Unable to generate your Kundali right now.");
      }
      
      // Auto-send a user message with birth details
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: `My name is ${details.name}, born on ${details.dob} at ${details.tob} in ${details.pob}`,
      };
      setMessages((prev) => [...prev, userMsg]);

      addAssistantMessage(
        `Namaste ${details.name} 🙏! Your Kundali is ready. I can now answer using your ${payload.lagna} Lagna, ${payload.moonSign} Moon sign, and ${payload.dasha.mahadasha.lord} Mahadasha. Your astrological chart holds profound wisdom. Ask your first question whenever you are ready.`,
        0,
        {
          isConsultationStart: true,
          name: details.name,
          dob: details.dob,
          tob: details.tob,
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate your Kundali right now.");
    } finally {
      setChartLoading(false);
    }
  };

  const sendMessage = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading || chartLoading) return;

    setError(null);

    let activeKundali = kundali;
    if (!activeKundali) {
      if (!storedRequest) {
        setShowModal(true);
        setError("Generate your Kundali first so the chatbot can use your actual chart data.");
        return;
      }

      setChartLoading(true);
      try {
        activeKundali = await resolveKundaliFromApi(storedRequest);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load your Kundali from the API.");
        return;
      } finally {
        setChartLoading(false);
      }
    }

    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const nextCount = exchangeCount + 1;
    window.sessionStorage.setItem(CHAT_SESSION_KEY, String(nextCount));
    setExchangeCount(nextCount);

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed
      }
    ]);

    if (nextCount >= 5) {
      addAssistantMessage(REDIRECT_MESSAGE, 5);
      return;
    }

    setLoading(true);
    try {
      const history = [...messages, { id: `user-${Date.now()}`, role: "user" as const, content: trimmed }]
        .filter((message) => message.id !== "welcome")
        .map((message) => ({ role: message.role, content: message.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          exchangeNumber: nextCount,
          kundali: activeKundali,
          birthDetails: storedRequest
        })
      });

      const json = await response.json();
      if (!response.ok || json.error) {
        throw new Error(json.error || "Unable to get a response right now.");
      }

      addAssistantMessage(json.content as string, nextCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <SiteShell>
      <main className="flex flex-col" style={{ height: "calc(100vh - 65px)" }}>
        <Container className="flex flex-1 flex-col overflow-hidden py-6">
          <div className="mb-4 flex flex-col gap-3 rounded-3xl bg-white/70 p-4 ring-1 ring-brand-dark/10 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-dark text-brand-cream">
              <span className="font-display">Jy</span>
              </div>
              <div>
                <div className="text-base font-semibold text-brand-dark font-display">Jyoti AI Astrology Guide</div>
                <div className="text-xs text-brand-dark/60">
                  {chatLocked ? "Free session limit reached" : `${exchangeCount} of 4 free questions used`}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full bg-brand-gold text-brand-dark hover:bg-brand-accent sm:w-auto"
              >
                {kundali ? "Update Birth Details" : "Generate Free Kundali"}
              </Button>
              <Button href={BOOKING_URL} className="w-full sm:w-auto">Book Consultation</Button>
            </div>
          </div>

          {!kundali ? (
            <div className="mb-4 rounded-2xl bg-white/80 p-4 ring-1 ring-brand-dark/10">
              <p className="text-sm leading-relaxed text-brand-dark/75">
                Personalised answers start with your chart. Enter your full name, date of birth, time of birth, and place of birth so I can read your Lagna, Moon sign, planetary placements, and active dasha correctly.
              </p>
            </div>
          ) : (
            <div className="mb-4 rounded-2xl bg-white/80 p-4 ring-1 ring-brand-dark/10">
              <div className="flex flex-wrap items-center gap-4 text-sm text-brand-dark/75">
                <span><strong className="text-brand-dark">Chart loaded:</strong> {kundali.name}</span>
                <span><strong className="text-brand-dark">Lagna:</strong> {kundali.lagna}</span>
                <span><strong className="text-brand-dark">Moon:</strong> {kundali.moonSign}</span>
                <span><strong className="text-brand-dark">Dasha:</strong> {kundali.dasha.mahadasha.lord}</span>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto rounded-2xl bg-brand-cream/50 p-3 ring-1 ring-brand-dark/10 sm:p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {loading ? (
                <div className="flex gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gold/20 text-sm font-semibold text-brand-dark ring-1 ring-brand-gold/40">
                    Jy
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/85 px-4 py-3 ring-1 ring-brand-dark/10">
                    <TypingIndicator />
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            {chatLocked ? (
              <div className="mt-6">
                <TokenRechargeCard userName={displayName} compact />
              </div>
            ) : null}

            {messages.length === 1 ? (
              <div className="mt-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-dark p-4 text-sm font-semibold text-brand-cream shadow-lg ring-1 ring-brand-gold/40 transition hover:bg-[#3A0808]"
                >
                  Generate Free Kundali First
                </button>

                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="col-span-full text-xs font-semibold text-brand-dark/50">
                    Suggested chart questions:
                  </p>
                  {SUGGESTED.map((question) => (
                    <button
                      key={question}
                      onClick={() => void sendMessage(question)}
                      className="rounded-xl bg-white/70 px-3 py-2.5 text-left text-sm text-brand-dark/80 ring-1 ring-brand-dark/10 transition hover:bg-white hover:text-brand-dark"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-3 flex items-end gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-dark ring-1 ring-brand-dark/15 shadow-sm transition hover:bg-white"
              title="Enter birth details"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="flex-1 rounded-2xl bg-white ring-1 ring-brand-dark/15 focus-within:ring-2 focus-within:ring-brand-gold/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  event.target.style.height = "auto";
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder={chatLocked ? "Free session complete. Recharge tokens or book a consultation." : "Ask about your chart, dasha, yogas, or remedies..."}
                rows={1}
                disabled={chatLocked || loading || chartLoading}
                className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-[#1b1b1b] outline-none placeholder:text-brand-dark/40 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ minHeight: "48px", maxHeight: "160px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || loading || chartLoading || chatLocked}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-dark text-brand-cream shadow ring-1 ring-brand-gold/40 transition hover:bg-[#3A0707] disabled:opacity-40"
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>

          <p className="mt-2 text-center text-xs text-brand-dark/40">
            {remainingQuestions > 0 && !chatLocked
              ? `${remainingQuestions} free question${remainingQuestions === 1 ? "" : "s"} remaining in this session`
              : "Further guidance continues through token recharge or booked consultations"}
          </p>
        </Container>

        <ConsultationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={(details) => {
            void handleGenerateChart(details);
          }}
        />
      </main>
    </SiteShell>
  );
}
