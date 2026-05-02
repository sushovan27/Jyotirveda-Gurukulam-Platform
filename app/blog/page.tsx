import { Metadata } from "next";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { BlogListClient } from "@/components/blog/BlogListClient";
import { getPosts } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Jyotisha Vani | Jyotirveda Gurukulam",
  description: "Wisdom from the Stars. Read our latest articles on Vedic astrology, spirituality, and traditional wisdom.",
  alternates: {
    canonical: "https://jyotirvedantagurukulam.in/blog",
  },
};

export const revalidate = 3600;

async function BlogGrid() {
  const posts = await getPosts(100);

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-3xl bg-white/60 backdrop-blur-sm p-12 text-center ring-1 ring-brand-dark/8">
        <p className="text-brand-dark/60 font-medium">The cosmos is silent for now...</p>
        <p className="mt-2 text-sm text-brand-dark/40">Check back later for new articles.</p>
      </div>
    );
  }

  return <BlogListClient posts={posts} />;
}

export default function BlogListingPage() {
  return (
    <SiteShell>
      <main className="py-12 sm:py-16">
        <Container>
          <SectionHeading
            eyebrow="Jyotisha Vani"
            title="Wisdom from the Stars"
            description="Explore our articles on Vedic astrology, practical remedies, and deeper spiritual study."
            align="center"
          />

          <div className="mt-10">
            <Suspense>
              <BlogGrid />
            </Suspense>
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}
