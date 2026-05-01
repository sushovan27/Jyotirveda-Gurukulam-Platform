import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cinzel, Tiro_Devanagari_Sanskrit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"]
});

const tiro = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  variable: "--font-tiro",
  weight: "400"
});

import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Jyotirveda Gurukulam | Vedic Astrology, Kundali and Consultations",
    template: "%s | Jyotirveda Gurukulam"
  },
  description:
    "Jyotirveda Gurukulam offers Vedic astrology guidance, free Kundali generation, AI chart insights, Jyotisha courses, and personal consultations rooted in traditional wisdom.",
  keywords: [
    "Vedic Astrology",
    "Jyotish",
    "Kundli",
    "Kundali",
    "Birth Chart Reading",
    "Vimshottari Dasha",
    "Numerology",
    "Vastu Shastra",
    "Astrology Consultation",
    "Online Astrology Courses",
    "AI Astrology Chat",
    "Horoscope"
  ],
  authors: [{ name: "Jyotirveda Gurukulam" }],
  creator: "Jyotirveda Gurukulam",
  publisher: "Jyotirveda Gurukulam",
  metadataBase: new URL("https://jyotirvedantagurukulam.in"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Jyotirveda Gurukulam | Authentic Vedic Astrology and Kundali Guidance",
    description:
      "Generate your Kundali, understand your dashas, study Jyotisha, and book personalised consultations through a focused digital gurukulam.",
    url: "https://jyotirvedantagurukulam.in",
    siteName: "Jyotirveda Gurukulam",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jyotirveda Gurukulam Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotirveda Gurukulam | Vedic Astrology",
    description: "Free Kundali generation, chart-based astrology guidance, courses, and personalised consultations.",
    creator: "@jyotirveda"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png"
  },
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2213817145109266"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          cinzel.variable,
          tiro.variable,
          "antialiased"
        ].join(" ")}
      >
        <NextTopLoader
          color="#D4AF37"
          height={3}
          showSpinner={true}
          shadow="0 0 10px #D4AF37, 0 0 5px #D4AF37"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="modern-spinner"><div class="modern-spinner-inner"></div><div class="modern-spinner-inner2"></div></div></div>'
          zIndex={9999}
        />
        {children}
      </body>
    </html>
  );
}
