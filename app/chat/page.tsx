"use client";

import * as React from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const kundliFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date"),
  tob: z.string().regex(/^\d{2}:\d{2}$/, "Enter a valid time (HH:MM)"),
  pob: z.string().min(2, "Place of birth is required").max(150, "Too long"),
});
type KundliFormValues = z.infer<typeof kundliFormSchema>;

const inputCls = "w-full rounded-xl border border-brand-dark/20 bg-white px-3 py-2.5 text-sm text-[#1b1b1b] outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 placeholder:text-brand-dark/40";

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-brand-dark">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

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
          className="h-2 w-2 rounded-full bg-brand-gold animate-bounce"
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
            ? "bg-brand-dark text-brand-cream"
            : "bg-brand-gold/20 text-brand-dark ring-1 ring-brand-gold/40"
        }`}
      >
        {isUser ? "You" : "ॐ"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-brand-dark text-brand-cream"
            : "rounded-tl-sm bg-white/80 text-[#1b1b1b] ring-1 ring-brand-dark/10"
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
  const [showModal, setShowModal] = React.useState(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors }
  } = useForm<KundliFormValues>({
    resolver: zodResolver(kundliFormSchema),
  });

  const onDetailsSubmit = (data: KundliFormValues) => {
    const text = `Here are my birth details for analysis:
Name: ${data.name}
Date of Birth: ${data.dob}
Time of Birth: ${data.tob}
City of Birth: ${data.pob}

Please generate my chart and provide a comprehensive reading.`;
    setShowModal(false);
    reset();
    void sendMessage(text);
  };

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
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-dark text-brand-cream">
              <span style={{ fontFamily: "var(--font-display)" }}>ॐ</span>
            </div>
            <div>
              <div
                className="text-base font-semibold text-brand-dark font-display"
              >
                Jyotisha AI Astrologer
              </div>
              <div className="text-xs text-brand-dark/60">
                Vedic wisdom · Always available
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-xs text-brand-dark/60">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto rounded-2xl bg-brand-cream/50 p-4 ring-1 ring-brand-dark/10">
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {streaming && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gold/20 text-sm font-semibold text-brand-dark ring-1 ring-brand-gold/40">
                    ॐ
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white/80 px-4 py-3 ring-1 ring-brand-dark/10">
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions (only when only welcome message) */}
            {messages.length === 1 && (
              <div className="mt-6 flex flex-col gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-brand-dark p-4 text-sm font-semibold text-brand-cream shadow-lg ring-1 ring-brand-gold/40 hover:bg-[#3A0808] transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    <path d="M19 3v4" />
                    <path d="M21 5h-4" />
                  </svg>
                  Enter Birth Details to Generate Kundli
                </button>

                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="col-span-full text-xs font-semibold text-brand-dark/50">
                    Or ask a question:
                  </p>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => void sendMessage(q)}
                      className="rounded-xl bg-white/70 px-3 py-2.5 text-left text-sm text-brand-dark/80 ring-1 ring-brand-dark/10 hover:bg-white hover:text-brand-dark transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
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
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-cream text-brand-dark ring-1 ring-brand-dark/15 hover:bg-white shadow-sm transition"
              title="Enter Birth Details"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <div className="flex-1 rounded-2xl bg-white ring-1 ring-brand-dark/15 focus-within:ring-2 focus-within:ring-brand-gold/50">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Jyotish, your chart, or planetary remedies…"
                rows={1}
                className="block w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-[#1b1b1b] outline-none placeholder:text-brand-dark/40"
                style={{ minHeight: "48px", maxHeight: "160px" }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-dark text-brand-cream shadow ring-1 ring-brand-gold/40 hover:bg-[#3A0707] disabled:opacity-40 transition"
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

          <p className="mt-2 text-center text-xs text-brand-dark/40">
            Press Enter to send · Shift+Enter for new line
          </p>
        </Container>

        {/* Birth Details Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-brand-cream shadow-2xl ring-1 ring-brand-dark/10"
              >
                <div className="flex items-center justify-between border-b border-brand-dark/10 bg-white/50 px-6 py-5 backdrop-blur-md">
                  <h2 className="text-xl font-bold text-brand-dark font-display">
                    Enter Birth Details
                  </h2>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="rounded-full bg-brand-dark/5 p-2 text-brand-dark/60 hover:bg-brand-dark/10 hover:text-brand-dark"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                <form onSubmit={handleFormSubmit(onDetailsSubmit)} className="p-6">
                  <div className="grid gap-4">
                    <FormField label="Full Name" error={errors.name?.message}>
                      <input {...register("name")} type="text" placeholder="e.g. Arjun Sharma" className={inputCls} />
                    </FormField>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField label="Date of Birth" error={errors.dob?.message}>
                        <input {...register("dob")} type="date" className={inputCls} />
                      </FormField>
                      <FormField label="Time of Birth" error={errors.tob?.message}>
                        <input {...register("tob")} type="time" className={inputCls} />
                      </FormField>
                    </div>
                    <FormField label="Place of Birth" error={errors.pob?.message}>
                      <input {...register("pob")} type="text" placeholder="e.g. Mumbai, Maharashtra" className={inputCls} />
                    </FormField>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="rounded-full px-5 py-2.5 text-sm font-semibold text-brand-dark ring-1 ring-brand-dark/20 hover:bg-brand-dark/5"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="rounded-full bg-brand-dark px-5 py-2.5 text-sm font-semibold text-brand-cream hover:bg-[#3A0808] shadow-md"
                    >
                      Send Details
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </SiteShell>
  );
}
