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
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const tiroDevanagari = Tiro_Devanagari_Sanskrit({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-sanskrit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jyotirvedanta Gurukulam",
    template: "%s • Jyotirvedanta Gurukulam",
  },
  description:
    "A premium digital gurukulam for Vedic astrology courses and eBooks. Authentic knowledge, secure payments, instant access.",
  metadataBase: new URL("https://jyotirvedantagurukulam.in"),
  openGraph: {
    title: "Jyotirvedanta Gurukulam",
    description:
      "A premium digital gurukulam for Vedic astrology courses and eBooks. Authentic knowledge, secure payments, instant access.",
    url: "https://jyotirvedantagurukulam.in",
    siteName: "Jyotirvedanta Gurukulam",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
          tiroDevanagari.variable,
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
