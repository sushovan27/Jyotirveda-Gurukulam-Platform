import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Kundli Generation | Janam Kundali by Date of Birth",
  description: "Generate your free highly accurate Vedic birth chart (Kundli). Discover your planetary positions, lagna, rashi, nakshatra, and current Mahadasha period.",
  keywords: ["Free Kundli", "Janam Kundali Online", "Birth Chart Calculator", "Vedic Astrology Chart", "Astrology Chart Reader"],
};

export default function KundliLayout({ children }: { children: React.ReactNode }) {
  return children;
}
