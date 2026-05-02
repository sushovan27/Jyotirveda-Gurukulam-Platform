"use client";

import { motion } from "framer-motion";
import { BlogCard } from "@/components/blog/BlogCard";
import { WPPost } from "@/types/wordpress";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

export function BlogListClient({ posts }: { posts: WPPost[] }) {
  if (!posts || posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-white/60 backdrop-blur-sm p-12 text-center ring-1 ring-brand-dark/8"
      >
        <p className="text-brand-dark/60 font-medium">The cosmos is silent for now...</p>
        <p className="mt-2 text-sm text-brand-dark/40">Check back later for new articles.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <motion.div key={post.id} variants={fadeUp} className="h-full">
          <BlogCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}
