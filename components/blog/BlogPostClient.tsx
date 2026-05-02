"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";

const ease = [0.22, 1, 0.36, 1] as const;

function parseContent(content: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const inlineTocs = doc.querySelectorAll(
      '#ez-toc-container, .lwptoc, .toc_container, #toc_container, .wp-block-table-of-contents, .uagb-toc__wrap, .yoast-table-of-contents, .ast-table-of-contents'
    );
    inlineTocs.forEach(toc => toc.remove());

    const manualTocHeadings = Array.from(doc.querySelectorAll('h2, h3, h4, strong, p')).filter(
      el => el.textContent?.toLowerCase().trim() === 'table of contents'
    );
    manualTocHeadings.forEach(heading => {
      let nextEl = heading.nextElementSibling;
      if (nextEl && (nextEl.tagName === 'UL' || nextEl.tagName === 'OL')) {
        nextEl.remove();
      }
      heading.remove();
    });

    const headingElements = doc.querySelectorAll("h2, h3");
    const toc: { id: string; text: string; level: number }[] = [];

    headingElements.forEach((el, index) => {
      const text = el.textContent || "";
      if (!text.trim()) return;

      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `heading-${index}`;
      el.id = el.id || id;

      toc.push({
        id: el.id,
        text,
        level: el.tagName === "H3" ? 3 : 2
      });
    });

    return { html: doc.body.innerHTML, toc };
  } catch {
    return { html: content, toc: [] };
  }
}

export function BlogPostClient({
  title,
  content,
  date,
  authorName,
  imageUrl,
  altText,
}: {
  title: string;
  content: string;
  date: string;
  authorName: string;
  imageUrl?: string;
  altText?: string;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const readTime = React.useMemo(() => {
    const wordsPerMinute = 200;
    const noOfWords = content.replace(/<[^>]*>?/gm, "").split(/\s/g).length;
    return Math.ceil(noOfWords / wordsPerMinute);
  }, [content]);

  const { html: parsedContent, toc } = React.useMemo(() => parseContent(content), [content]);
  const [activeId, setActiveId] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState("");
  const [tocOpen, setTocOpen] = React.useState(false);
  const [mobileTocOpen, setMobileTocOpen] = React.useState(false);

  React.useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  React.useEffect(() => {
    if (toc.length === 0) return;

    const handleScroll = () => {
      const headings = toc.map(t => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
      const scrollPosition = window.scrollY + 120;
      let current = "";

      for (const el of headings) {
        if (el.offsetTop <= scrollPosition) {
          current = el.id;
        } else {
          break;
        }
      }

      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
    }
  };

  const tocNav = (
    <nav className="flex flex-col gap-0.5">
      {toc.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`group rounded-lg px-3 py-1.5 text-[13px] leading-snug transition-all duration-200 ${
            activeId === item.id
              ? "text-brand-dark font-semibold bg-brand-gold/8"
              : "text-brand-dark/50 hover:text-brand-gold hover:bg-brand-gold/5"
          } ${item.level === 3 ? "pl-6" : "pl-3"}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToHeading(item.id);
          }}
        >
          <span className="flex items-start gap-2">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
              activeId === item.id ? 'bg-brand-gold' : 'bg-brand-dark/15 group-hover:bg-brand-gold/50'
            }`} />
            <span className="line-clamp-2">{item.text}</span>
          </span>
        </a>
      ))}
    </nav>
  );

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold via-brand-accent to-brand-gold origin-left z-50"
        style={{ scaleX }}
      />

      <article className="relative pb-16 mt-8 sm:mt-12">
        {/* Header */}
        <header className="text-center mx-auto max-w-[1200px] px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-brand-dark/60 bg-white/70 backdrop-blur-sm px-5 py-2 rounded-full ring-1 ring-brand-dark/5"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date}
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-dark/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readTime} min read
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-dark/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {authorName}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="text-balance text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tight text-brand-dark font-display"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
          />
        </header>

        {/* Featured Image */}
        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mt-10 mb-12 mx-auto relative aspect-[16/9] w-full max-w-[1200px] overflow-hidden rounded-2xl bg-brand-dark/5 ring-1 ring-brand-dark/5"
          >
            <Image
              src={imageUrl}
              alt={altText || "Featured image"}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </motion.div>
        )}

        {/* Content Area */}
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          {/* Mobile/Tablet TOC Toggle Button (floating) */}
          {toc.length > 0 && (
            <div className="lg:hidden">
              {/* Floating TOC button */}
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-brand-cream shadow-lg shadow-brand-dark/20 ring-2 ring-brand-gold/30 transition-all hover:scale-105 active:scale-95 lg:hidden"
                aria-label="Toggle table of contents"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>

              {/* Mobile/Tablet TOC Panel */}
              {mobileTocOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileTocOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="fixed bottom-24 right-4 left-4 z-50 max-h-[60vh] overflow-hidden rounded-2xl bg-white shadow-2xl shadow-brand-dark/10 ring-1 ring-brand-dark/10"
                  >
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-brand-dark/5">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <h4 className="text-sm font-bold text-brand-dark">Table of Contents</h4>
                        <span className="text-xs text-brand-dark/40 bg-brand-dark/5 px-2 py-0.5 rounded-full">{toc.length}</span>
                      </div>
                      <button
                        onClick={() => setMobileTocOpen(false)}
                        className="rounded-full p-1.5 text-brand-dark/40 hover:text-brand-dark hover:bg-brand-dark/5"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="overflow-y-auto max-h-[calc(60vh-3.5rem)] p-3">
                      {tocNav}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          )}

          {/* Desktop TOC + Content Grid */}
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
            {/* Desktop Sidebar TOC */}
            {toc.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  {/* TOC Card */}
                  <div className="rounded-xl bg-white ring-1 ring-brand-dark/5 overflow-hidden">
                    {/* Header with gold accent */}
                    <div className="px-4 py-3.5 border-b border-brand-dark/5 bg-gradient-to-r from-brand-gold/5 to-transparent">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-brand-dark/80">Contents</h4>
                          <p className="text-[10px] text-brand-dark/35">{toc.length} sections</p>
                        </div>
                      </div>
                    </div>

                    {/* TOC Links */}
                    <div className="p-3 overflow-y-auto max-h-[calc(100vh-16rem)]">
                      {tocNav}
                    </div>

                    {/* Progress indicator */}
                    {toc.length > 0 && (
                      <div className="px-4 py-2.5 border-t border-brand-dark/5 bg-brand-cream/30">
                        <div className="flex items-center gap-2 text-[10px] text-brand-dark/40">
                          <svg className="w-3 h-3 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {activeId ? (
                            <span className="font-medium text-brand-dark/60 truncate">
                              {toc.find(t => t.id === activeId)?.text}
                            </span>
                          ) : (
                            <span>Start reading to see progress</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}

            {/* Article Content */}
            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="rounded-2xl bg-white p-6 sm:p-10 lg:p-12 ring-1 ring-brand-dark/5"
              >
                <div
                  className="prose prose-base sm:prose-lg max-w-none
                    prose-headings:font-display prose-headings:font-bold prose-headings:text-brand-dark prose-headings:scroll-mt-28 prose-headings:mt-10 prose-headings:mb-4 prose-headings:leading-tight
                    prose-h2:text-2xl sm:prose-h2:text-[1.75rem] prose-h2:border-b prose-h2:border-brand-gold/15 prose-h2:pb-2 prose-h2:mt-12 prose-h2:first:mt-0
                    prose-h3:text-xl sm:prose-h3:text-[1.35rem] prose-h3:text-brand-dark/90
                    prose-p:text-brand-dark/80 prose-p:leading-[1.8] prose-p:my-4
                    prose-a:text-brand-gold prose-a:no-underline prose-a:font-semibold hover:prose-a:text-brand-accent
                    prose-strong:text-brand-dark prose-strong:font-semibold
                    prose-li:text-brand-dark/80 prose-li:leading-[1.7] prose-li:marker:text-brand-gold prose-li:my-1
                    prose-ul:my-6 prose-ol:my-6
                    prose-img:rounded-xl prose-img:ring-1 prose-img:ring-brand-dark/10 prose-img:shadow-md prose-img:my-8
                    prose-figure:my-8 prose-figcaption:mt-2 prose-figcaption:text-sm prose-figcaption:text-brand-dark/50 prose-figcaption:italic
                    prose-blockquote:border-l-[3px] prose-blockquote:border-brand-gold prose-blockquote:bg-brand-gold/[0.04] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:text-brand-dark/75 prose-blockquote:not-italic prose-blockquote:leading-relaxed
                    prose-hr:border-brand-gold/15 prose-hr:my-10
                    prose-code:text-brand-accent prose-code:bg-brand-gold/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
                    prose-pre:bg-brand-dark prose-pre:text-brand-cream prose-pre:rounded-xl prose-pre:ring-1 prose-pre:ring-brand-dark/10 prose-pre:my-6
                    prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-table:text-sm
                    prose-th:border prose-th:border-brand-dark/10 prose-th:bg-brand-dark/[0.03] prose-th:px-3 prose-th:py-2.5 prose-th:text-left prose-th:font-semibold prose-th:text-brand-dark
                    prose-td:border prose-td:border-brand-dark/10 prose-td:px-3 prose-td:py-2.5 prose-td:text-brand-dark/75"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(parsedContent) }}
                />
              </motion.div>

              {/* Share & Author Footer */}
              <div className="mt-12 pt-8 border-t border-brand-dark/5">
                {/* Share */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-brand-dark/50">
                    Share
                  </span>
                  <button
                    onClick={copyLink}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark/50 ring-1 ring-brand-dark/10 transition-all hover:bg-brand-gold hover:text-white hover:ring-brand-gold"
                  >
                    {copied ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )}
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark/50 ring-1 ring-brand-dark/10 transition-all hover:bg-brand-gold hover:text-white hover:ring-brand-gold"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-dark/50 ring-1 ring-brand-dark/10 transition-all hover:bg-brand-gold hover:text-white hover:ring-brand-gold"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>
                </div>

                {/* Author Card */}
                <div className="rounded-xl bg-brand-cream/50 p-6 ring-1 ring-brand-dark/5 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="h-16 w-16 shrink-0 rounded-full bg-brand-gold/10 ring-2 ring-white flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-brand-gold font-display">{authorName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-1">Written By</div>
                    <h3 className="text-lg font-bold font-display text-brand-dark mb-1">{authorName}</h3>
                    <p className="text-sm text-brand-dark/60 leading-relaxed">
                      Sharing traditional Vedic wisdom, astrology insights, and spiritual guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
