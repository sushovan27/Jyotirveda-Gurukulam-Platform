export type CatalogCourse = {
  slug: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  highlights: string[];
  whoItsFor?: string;
  outcome?: string;
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
    slug: "vedic-astrology-mastery",
    title: "Vedic Astrology Mastery",
    subtitle: "Master the complete science of Jyotish and chart reading",
    level: "Intermediate",
    duration: "8 Weeks",
    highlights: ["Complete Jyotish Science", "Chart Reading Mastery", "Predictive Techniques"],
    whoItsFor: "Astrology enthusiasts, spiritual seekers, and practitioners who want to offer chart reading services",
    outcome: "Students can independently read and interpret full birth charts and make predictions",
    priceLabel: "₹23,999",
  },
  {
    slug: "numerology-mastery",
    title: "Numerology Mastery",
    subtitle: "Unlock the power of numbers and their influence on destiny",
    level: "Advanced",
    duration: "16 Weeks",
    highlights: ["Life Path Numbers", "Name Correction", "Destiny Calculation"],
    whoItsFor: "Coaches, healers, and anyone drawn to number-based guidance and personal transformation",
    outcome: "Students can offer professional numerology consultations and name correction services",
    priceLabel: "₹4,999",
  },
  {
    slug: "vastu-shastra",
    title: "Vastu Shastra",
    subtitle: "Harmonize spaces with ancient architectural wisdom",
    level: "Intermediate",
    duration: "Self-paced",
    highlights: ["Space Harmonization", "Directional Remedies", "Energy Optimization"],
    whoItsFor: "Homeowners, architects, interior designers, and spiritual consultants",
    outcome: "Students can conduct Vastu audits and recommend remedies for homes, offices, and commercial spaces",
    priceLabel: "₹5,999",
  },
];

export const services = [
  {
    id: "personal-consultation",
    title: "Personal Consultation",
    duration: "60 minutes",
    originalPrice: 4040,
    price: 2020,
    description: "Complete Vedic chart analysis with detailed insights into your life path, career, relationships, and spiritual journey.",
    includes: ["Birth chart analysis", "Life predictions", "Remedial suggestions", "Career guidance"]
  },
  {
    id: "quick-question",
    title: "Quick Question",
    duration: "15 minutes",
    originalPrice: 1000,
    price: 500,
    description: "Get immediate answers to specific questions about love, career, or important life decisions.",
    includes: ["One specific question", "Instant clarity", "Practical advice", "Quick solutions"]
  },
  {
    id: "numerology-reading",
    title: "Numerology Reading",
    duration: "45 minutes",
    originalPrice: 2040,
    price: 1020,
    description: "Discover your life path number, destiny, and hidden potential through the ancient science of numbers.",
    includes: ["Life path analysis", "Name compatibility", "Lucky numbers", "Timing guidance"]
  },
  {
    id: "vastu-consultation",
    title: "Vastu Consultation",
    duration: "Site Visit",
    originalPrice: 20000,
    price: 10000,
    description: "Harmonize your living and working spaces with ancient Vastu principles for prosperity and peace.",
    includes: ["Space analysis", "Energy optimization", "Remedial measures", "Prosperity enhancement"]
  }
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
