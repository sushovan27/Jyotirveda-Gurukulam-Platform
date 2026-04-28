import type { Metadata } from "next";
import localFont from "next/font/local";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
