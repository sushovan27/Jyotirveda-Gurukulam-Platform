"use client";

import * as React from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// ---------------------------------------------------------------------------
// Suggested questions
// ---------------------------------------------------------------------------

const SUGGESTED = [
  "What does my Lagna say about my personality?",
  "Which period is favourable for career growth?",
  "Tell me about Rahu-Ketu and their effects.",
  "What remedies can reduce the effects of Shani?",
  "How do I calculate my Vimshottari Mahadasha?",
  "What is the spiritual significance of Karka lagna?",
];

// ---------------------------------------------------------------------------
// Loading dots animation
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-[#D4AF37] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
          isUser
            ? "bg-[#4A0A0A] text-[#FFF7E6]"
            : "bg-[#D4AF37]/20 text-[#4A0A0A] ring-1 ring-[#D4AF37]/40"
        }`}
      >
        {isUser ? "You" : "ॐ"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-[#4A0A0A] text-[#FFF7E6]"
            : "rounded-tl-sm bg-white/80 text-[#1b1b1b] ring-1 ring-[#4A0A0A]/10"
        }`}
      >
        {message.content || <TypingIndicator />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Namaste 🙏 I am your Vedic astrology guide. I can help you understand Jyotish principles, planetary influences, Kundli interpretations, remedies, and spiritual guidance. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const sendMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || streaming) return;

    setError(null);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const assistantId = `assistant-${Date.now()}`;
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    const updatedMessages = [...messages, userMsg];
    setMessages([...updatedMessages, assistantMsg]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const json = (await res.json()) as { error?: string };
        throw new Error(json.error ?? "Failed to get response");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const finalAccumulated = accumulated;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: finalAccumulated } : m
          )
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      // Remove the empty assistant message
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <SiteShell>
      <main className="flex flex-col" style={{ height: "calc(100vh - 65px)" }}>
        <Container className="flex flex-1 flex-col overflow-hidden py-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#4A0A0A] text-[#FFF7E6]">
              <span style={{ fontFamily: "var(--font-display)" }}>ॐ</span>
            </div>
            <div>
              <div
                className="text-base font-semibold text-[#4A0A0A]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Jyotisha AI Astrologer
              </div>
              <div className="text-xs text-[#4A0A0A]/60">
                Vedic wisdom · Always available
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-[#4A0A0A]/60">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-2xl bg-[#FFF7E6]/50 p-4 ring-1 ring-[#4A0A0A]/10">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {streaming && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#D4AF37]/20 text-sm font-semibold text-[#4A0A0A] ring-1 ring-[#D4AF37]/40">
                    ॐ
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/80 px-4 py-3 ring-1 ring-[#4A0A0A]/10">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (only when only welcome message) */}
            {messages.length === 1 && (
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <p className="col-span-full text-xs font-semibold text-[#4A0A0A]/50">
                  Suggested questions:
                </p>
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => void sendMessage(q)}
                    className="rounded-xl bg-white/70 px-3 py-2.5 text-left text-sm text-[#4A0A0A]/80 ring-1 ring-[#4A0A0A]/10 hover:bg-white hover:text-[#4A0A0A] transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-200">
              {error}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="mt-3 flex items-end gap-2"
          >
            <div className="flex-1 rounded-2xl bg-white ring-1 ring-[#4A0A0A]/15 focus-within:ring-2 focus-within:ring-[#D4AF37]/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Jyotish, your chart, or planetary remedies…"
                rows={1}
                className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-[#1b1b1b] outline-none placeholder:text-[#4A0A0A]/40"
                style={{ minHeight: "48px", maxHeight: "160px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#4A0A0A] text-[#FFF7E6] shadow ring-1 ring-[#D4AF37]/40 hover:bg-[#3A0707] disabled:opacity-40 transition"
              aria-label="Send message"
            >
              {streaming ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </form>

          <p className="mt-2 text-center text-xs text-[#4A0A0A]/40">
            Press Enter to send · Shift+Enter for new line
          </p>
        </Container>
      </main>
    </SiteShell>
  );
}
