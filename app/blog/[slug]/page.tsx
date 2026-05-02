import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/SiteShell";
import { Container } from "@/components/site/Container";
import { BlogPostClient } from "@/components/blog/BlogPostClient";
import { getPostBySlug, getAllPostSlugs } from "@/lib/wordpress";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.title.rendered.replace(/<[^>]*>?/gm, "");
  const description = post.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim();
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const ogImage = featuredMedia?.source_url || featuredMedia?.media_details?.sizes?.medium_large?.source_url;

  return {
    title: `${title} | Jyotirveda Gurukulam`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `https://jyotirvedantagurukulam.in/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = post.title.rendered;
  const content = post.content.rendered;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const authorName = post._embedded?.author?.[0]?.name || "Jyotirveda Gurukulam";
  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url || featuredMedia?.media_details?.sizes?.large?.source_url;

  return (
    <SiteShell>
      <main className="py-12 sm:py-20">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center text-sm font-medium text-brand-dark/60 transition-colors hover:text-brand-gold"
          >
            ← Back to Blog
          </Link>

          <BlogPostClient
            title={title}
            content={content}
            date={date}
            authorName={authorName}
            imageUrl={imageUrl}
            altText={featuredMedia?.alt_text}
          />
        </Container>
      </main>
    </SiteShell>
  );
}
