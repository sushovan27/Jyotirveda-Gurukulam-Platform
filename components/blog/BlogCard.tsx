import Link from "next/link";
import Image from "next/image";
import { WPPost } from "@/types/wordpress";
import DOMPurify from "isomorphic-dompurify";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

export function BlogCard({ post }: { post: WPPost }) {
  const title = post.title.rendered;
  const excerpt = stripHtml(post.excerpt.rendered);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = featuredMedia?.source_url || featuredMedia?.media_details?.sizes?.medium_large?.source_url;

  const author = post._embedded?.author?.[0];
  const authorName = author?.name || "Jyotirveda Gurukulam";

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full outline-none">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-dark/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/10 hover:ring-brand-gold/30">
        
        {/* Featured Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-brand-dark/5 to-brand-gold/5 shrink-0">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={featuredMedia?.alt_text || title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-brand-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          )}
          
          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-brand-gold shadow-sm">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Article
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Date */}
          <div className="mb-3 flex items-center gap-2 text-xs text-brand-dark/50">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{date}</span>
          </div>
          
          {/* Title */}
          <h3
            className="text-lg font-semibold leading-snug text-brand-dark font-display line-clamp-2 transition-colors duration-200 group-hover:text-brand-gold"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
          />
          
          {/* Excerpt */}
          <p className="mt-2.5 flex-1 text-sm text-brand-dark/65 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
          
          {/* Footer */}
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-brand-dark/5">
            <div className="flex items-center gap-2 text-xs text-brand-dark/50">
              <div className="h-6 w-6 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-brand-gold">{authorName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="truncate max-w-[100px]">{authorName}</span>
            </div>
            <span className="text-xs font-medium text-brand-gold transition-colors group-hover:text-brand-accent">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
