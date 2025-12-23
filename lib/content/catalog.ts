export type CatalogCourse = {
  slug: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  highlights: string[];
  priceLabel: string;
};

export type CatalogEbook = {
  slug: string;
  title: string;
  subtitle: string;
  pages: number;
  highlights: string[];
  priceLabel: string;
};

export const courses: CatalogCourse[] = [
  {
    slug: "foundations-of-vedic-astrology",
    title: "Foundations of Vedic Astrology",
    subtitle: "A calm, structured journey into Jyotish principles.",
    level: "Beginner",
    duration: "6 modules",
    highlights: ["Grahas & Rashis", "Bhavas explained", "Practical chart reading"],
    priceLabel: "₹1,999",
  },
  {
    slug: "nakshatra-sadhana",
    title: "Nakshatra Sādhana",
    subtitle: "Understand the 27 lunar mansions with applied wisdom.",
    level: "Intermediate",
    duration: "8 modules",
    highlights: ["Deities & Shakti", "Padas & results", "Remedial insights"],
    priceLabel: "₹2,999",
  },
  {
    slug: "predictive-techniques-masterclass",
    title: "Predictive Techniques Masterclass",
    subtitle: "Dasha, transits, and timing—made disciplined and clear.",
    level: "Advanced",
    duration: "10 modules",
    highlights: ["Vimshottari flow", "Transit triggers", "Case-study practice"],
    priceLabel: "₹4,999",
  },
];

export const ebooks: CatalogEbook[] = [
  {
    slug: "graha-sutras-handbook",
    title: "Graha Sūtras Handbook (PDF)",
    subtitle: "Concise sutras with practical interpretation notes.",
    pages: 84,
    highlights: ["Quick reference", "Traditional logic", "Clean tables"],
    priceLabel: "₹499",
  },
  {
    slug: "bhava-phala-pocket-guide",
    title: "Bhāva Phala Pocket Guide (PDF)",
    subtitle: "House results explained with clarity and nuance.",
    pages: 112,
    highlights: ["Readable format", "Examples included", "Premium layout"],
    priceLabel: "₹699",
  },
  {
    slug: "nakshatra-essentials",
    title: "Nakshatra Essentials (PDF)",
    subtitle: "A grounded overview of meanings, deities, and applications.",
    pages: 96,
    highlights: ["Deities & themes", "Practical use", "Meditative tone"],
    priceLabel: "₹599",
  },
];

export function getCourseBySlug(slug: string): CatalogCourse | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getEbookBySlug(slug: string): CatalogEbook | undefined {
  return ebooks.find((e) => e.slug === slug);
}
