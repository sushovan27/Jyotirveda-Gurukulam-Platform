import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Vedic Horoscope | Accurate Predictions based on Moon Sign",
  description: "Read your free daily horoscope based on Vedic astrology. Discover precise predictions for your Rashi (moon sign) regarding love, career, health, and wealth.",
  keywords: ["Daily Horoscope", "Vedic Horoscope", "Rashifal", "Moon Sign Horoscope", "Astrology Predictions Today", "Zodiac Sign Horoscope"],
};

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
