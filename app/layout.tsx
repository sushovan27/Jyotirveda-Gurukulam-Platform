import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cinzel, Tiro_Devanagari_Sanskrit } from "next/font/google";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700"],
});

const tiro = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari"],
  variable: "--font-tiro",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Jyotirvedanta Gurukulam | Premium Vedic Astrology",
    template: "%s • Jyotirvedanta Gurukulam",
  },
  description:
    "A premium digital gurukulam for authentic Vedic astrology courses, accurate Kundli generation, online consultations, and traditional Jyotish knowledge.",
  keywords: [
    "Vedic Astrology", "Jyotish", "Kundli", "Online Astrology Courses", 
    "Vastu Shastra", "Numerology", "Astrology Consultations", 
    "Hindu Astrology", "Birth Chart", "Horoscope"
  ],
  authors: [{ name: "Jyotirvedanta Gurukulam" }],
  creator: "Jyotirvedanta Gurukulam",
  publisher: "Jyotirvedanta Gurukulam",
  metadataBase: new URL("https://jyotirvedantagurukulam.in"),
  openGraph: {
    title: "Jyotirvedanta Gurukulam | Authentic Vedic Astrology",
    description:
      "Master the science of Jyotish. Generate accurate birth charts, book expert consultations, and enroll in our premium online Vedic astrology masterclasses.",
    url: "https://jyotirvedantagurukulam.in",
    siteName: "Jyotirvedanta Gurukulam",
    type: "website",
    images: [{
      url: "/og-image.jpg", // Placeholder for future OG image
      width: 1200,
      height: 630,
      alt: "Jyotirvedanta Gurukulam Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotirvedanta Gurukulam | Vedic Astrology",
    description: "Authentic Vedic astrology courses, Kundli generation, and expert consultations.",
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
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
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
        ></script>
      </head>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          cinzel.variable,
          tiro.variable,
          "antialiased",
        ].join(" ")}
      >
        <NextTopLoader 
          color="#D4AF37"
          height={4}
          showSpinner={true}
          shadow="0 0 15px #D4AF37, 0 0 5px #D4AF37"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="om-spinner">ॐ</div></div>'
          zIndex={9999}
        />
        {children}
      </body>
    </html>
  );
}
