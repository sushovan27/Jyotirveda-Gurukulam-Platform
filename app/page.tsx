import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { Ornament } from "@/components/site/Ornament";
import { Button } from "@/components/site/Button";
import { Card } from "@/components/site/Card";
import { SectionHeading } from "@/components/site/SectionHeading";
import { courses, ebooks } from "@/lib/content/catalog";

export default function Home() {
  return (
    <SiteShell>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#D4AF37]/18 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#4A0A0A]/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-[520px] w-[520px] rounded-full bg-[#E49B0F]/12 blur-3xl" />
          </div>

          <Container className="relative py-16 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full bg-white/70 px-3 py-1.5 ring-1 ring-[#4A0A0A]/10">
                  <span
                    className="text-sm text-[#4A0A0A]"
                    style={{ fontFamily: "var(--font-sanskrit)" }}
                  >
                    ज्योतिष • वेदान्त
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-[#4A0A0A]/70">
                    Premium digital gurukulam
                  </span>
                </div>

                <h1
                  className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[#4A0A0A] sm:text-5xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Learn Vedic Astrology with clarity, discipline, and sacred
                  aesthetics.
                </h1>

                <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-[#4A0A0A]/75">
                  Courses and eBooks designed for serious seekers—structured
                  learning, authentic principles, and a premium experience built
                  for trust and focus.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button href="/courses">Enroll Now</Button>
                  <Button variant="secondary" href="/ebooks">
                    Browse eBooks
                  </Button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Secure payments", value: "Trusted checkout" },
                    { label: "Instant access", value: "After purchase" },
                    { label: "Premium PDFs", value: "Study-ready" },
                    { label: "Authentic", value: "Sanātana focus" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="rounded-2xl bg-white/60 p-3 ring-1 ring-[#4A0A0A]/10"
                    >
                      <div className="text-xs font-semibold text-[#4A0A0A]">
                        {b.label}
                      </div>
                      <div className="mt-1 text-xs text-[#4A0A0A]/70">
                        {b.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <Card className="relative overflow-hidden p-6 sm:p-8">
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#D4AF37]/18 blur-2xl" />
                  <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-[#4A0A0A]/10 blur-2xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div
                          className="text-xs font-semibold tracking-widest text-[#4A0A0A]/60"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          GURUKULAM METHOD
                        </div>
                        <div
                          className="mt-2 text-2xl font-semibold text-[#4A0A0A]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Calm. Precise. Practical.
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[#4A0A0A]/75">
                          A modern learning space shaped by traditional rigor:
                          clean modules, guided study, and content crafted to be
                          revisited.
                        </p>
                      </div>
                      <div className="h-12 w-12 shrink-0 text-[#D4AF37]">
                        <Ornament className="h-full w-full" />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {[
                        "Vedic-first explanations (no noise)",
                        "Designed for focused self-study",
                        "Premium layout & typography",
                        "Built for mobile + desktop",
                      ].map((t) => (
                        <div
                          key={t}
                          className="rounded-2xl bg-[#FFF7E6]/70 p-3 ring-1 ring-[#4A0A0A]/10"
                        >
                          <div className="text-sm font-medium text-[#4A0A0A]">
                            {t}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#4A0A0A] px-5 py-4 text-[#FFF7E6] ring-1 ring-[#D4AF37]/35">
                      <div>
                        <div className="text-xs text-[#FFF7E6]/80">
                          Begin your study today
                        </div>
                        <div
                          className="text-base font-semibold"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          Explore Courses & eBooks
                        </div>
                      </div>
                      <Link
                        href="/courses"
                        className="rounded-full bg-[#FFF7E6] px-4 py-2 text-sm font-semibold text-[#4A0A0A] hover:bg-white"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        {/* Courses */}
        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Structured learning"
              title="Courses crafted like a guided sādhana"
              description="Short, focused modules with clear outcomes—built for serious learners."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {courses.slice(0, 3).map((c) => (
                <Card key={c.slug} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-[#4A0A0A]/70">
                      {c.level} • {c.duration}
                    </div>
                    <div className="rounded-full bg-[#D4AF37]/18 px-3 py-1 text-xs font-semibold text-[#4A0A0A] ring-1 ring-[#D4AF37]/25">
                      {c.priceLabel}
                    </div>
                  </div>

                  <div
                    className="mt-3 text-lg font-semibold text-[#4A0A0A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {c.title}
                  </div>
                  <p className="mt-2 text-sm text-[#4A0A0A]/75">{c.subtitle}</p>

                  <ul className="mt-4 grid gap-2 text-sm text-[#4A0A0A]/80">
                    {c.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="secondary"
                      href={`/courses/${c.slug}`}
                      className="w-full"
                    >
                      Details
                    </Button>
                    <Button href="/login" className="w-full">
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="ghost" href="/courses">
                View all courses →
              </Button>
            </div>
          </Container>
        </section>

        {/* eBooks */}
        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Study-ready PDFs"
              title="eBooks designed for reading & revision"
              description="Premium PDFs with clean structure—perfect for quick reference and deep study."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {ebooks.slice(0, 3).map((e) => (
                <Card key={e.slug} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-[#4A0A0A]/70">
                      {e.pages} pages
                    </div>
                    <div className="rounded-full bg-[#D4AF37]/18 px-3 py-1 text-xs font-semibold text-[#4A0A0A] ring-1 ring-[#D4AF37]/25">
                      {e.priceLabel}
                    </div>
                  </div>

                  <div
                    className="mt-3 text-lg font-semibold text-[#4A0A0A]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {e.title}
                  </div>
                  <p className="mt-2 text-sm text-[#4A0A0A]/75">{e.subtitle}</p>

                  <ul className="mt-4 grid gap-2 text-sm text-[#4A0A0A]/80">
                    {e.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#E49B0F]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex gap-2">
                    <Button
                      variant="secondary"
                      href={`/ebooks/${e.slug}`}
                      className="w-full"
                    >
                      Details
                    </Button>
                    <Button href="/login" className="w-full">
                      Buy
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="ghost" href="/ebooks">
                View all eBooks →
              </Button>
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <section className="py-14 sm:py-16">
          <Container>
            <SectionHeading
              eyebrow="Trust & tradition"
              title="A learning space that feels calm—and serious"
              description="A premium experience built for focus, not distraction."
              align="center"
            />

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  quote:
                    "The explanations feel traditional yet refreshingly clear. The layout makes revision effortless.",
                  name: "Student, Beginner track",
                },
                {
                  quote:
                    "A rare blend of aesthetics and rigor. It feels like a true gurukulam—online.",
                  name: "Student, Nakshatra track",
                },
                {
                  quote:
                    "The structure helps me stay consistent. Everything is designed for disciplined study.",
                  name: "Student, Advanced track",
                },
              ].map((t) => (
                <Card key={t.name} className="p-6">
                  <p className="text-sm leading-relaxed text-[#4A0A0A]/80">
                    "{t.quote}"
                  </p>
                  <div className="mt-4 text-xs font-semibold text-[#4A0A0A]/70">
                    {t.name}
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-16">
          <Container>
            <Card className="relative overflow-hidden p-7 sm:p-10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#D4AF37]/18 blur-3xl" />
              <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#4A0A0A]/10 blur-3xl" />

              <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-2xl">
                  <div
                    className="text-sm font-semibold text-[#4A0A0A]/70"
                    style={{ fontFamily: "var(--font-sanskrit)" }}
                  >
                    सत्यम् • शिवम् • सुन्दरम्
                  </div>
                  <div
                    className="mt-2 text-2xl font-semibold text-[#4A0A0A] sm:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Enter the digital gurukulam—start with one course or one PDF.
                  </div>
                  <p className="mt-2 text-sm text-[#4A0A0A]/75">
                    Create your account now. Purchase flow, instant access, and secure
                    viewing will be enabled as we complete the next steps.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                  <Button href="/signup" className="w-full md:w-auto">
                    Create Account
                  </Button>
                  <Button variant="secondary" href="/courses" className="w-full md:w-auto">
                    Explore
                  </Button>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}
