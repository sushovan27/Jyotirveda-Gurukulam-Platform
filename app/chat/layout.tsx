import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Astrologer | Chat with Vedic Astrology AI",
  description: "Chat with Jyotisha-GPT, our highly advanced AI Vedic astrologer. Get instant answers about your birth chart, planetary alignments, and spiritual guidance based on authentic Jyotish Shastra.",
  keywords: ["AI Astrologer", "Vedic Astrology Chatbot", "Jyotish GPT", "Free Astrology Chat", "Ask Astrologer Online", "Birth Chart Analysis AI"],
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return children;
}
