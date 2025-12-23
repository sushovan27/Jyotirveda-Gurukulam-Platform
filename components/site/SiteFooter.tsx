import Link from "next/link";
import { Container } from "@/components/site/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#4A0A0A]/10 bg-[#FFF7E6]">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div
              className="text-base font-semibold text-[#4A0A0A]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Jyotirvedanta Gurukulam
            </div>
            <p className="mt-2 text-sm text-[#4A0A0A]/75">
              Authentic, disciplined learning—crafted as a modern digital gurukulam.
            </p>
            <p className="mt-4 text-xs text-[#4A0A0A]/60">
              © {new Date().getFullYear()} Jyotirvedanta Gurukulam. All rights reserved.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#4A0A0A]">Explore</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/courses">
                Courses
              </Link>
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/ebooks">
                eBooks
              </Link>
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/about">
                About Gurukulam
              </Link>
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-[#4A0A0A]">Legal</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/privacy">
                Privacy Policy
              </Link>
              <Link className="text-[#4A0A0A]/75 hover:text-[#4A0A0A]" href="/terms">
                Terms
              </Link>
            </div>
            <div className="mt-5 text-xs text-[#4A0A0A]/60">
              Secure payments • Instant access after purchase
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
