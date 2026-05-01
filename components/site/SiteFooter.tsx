import Link from "next/link";
import { Container } from "@/components/site/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-dark/10 bg-brand-cream">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div
              className="text-base font-semibold text-brand-dark font-display"
            >
              Jyotirvedanta Gurukulam
            </div>
            <p className="mt-2 text-sm text-brand-dark/75">
              Authentic, disciplined learning—crafted as a modern digital gurukulam.
            </p>
            <p className="mt-4 text-xs text-brand-dark/60">
              © {new Date().getFullYear()} Jyotirvedanta Gurukulam. All rights reserved.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-brand-dark">Explore</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/kundli">
                AI Kundli Generator
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/horoscope">
                Daily Horoscope
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/chat">
                AI Astrologer Chat
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/courses">
                Courses
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/ebooks">
                eBooks
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/about">
                About Gurukulam
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-brand-dark">Legal</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="text-brand-dark/75 hover:text-brand-dark" href="/terms">
                Terms
              </Link>
            </div>
            <div className="mt-5 text-xs text-brand-dark/60">
              Secure payments • Instant access after purchase
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
