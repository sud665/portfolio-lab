"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { type BlogPost } from "@/lib/types";

interface BlogDetailProps {
  post: BlogPost;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function BlogDetail({ post }: BlogDetailProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      {/* Back link */}
      <motion.div {...fadeUp(0)}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-code"
        >
          <ArrowLeft size={14} />
          블로그 목록으로
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div {...fadeUp(0.1)} className="mt-8">
        <span className="rounded-full border border-code/20 bg-code/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-code">
          {post.category}
        </span>

        <h1 className="mt-4 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="mt-2 text-lg text-gray-400">{post.subtitle}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          <time className="font-mono text-sm text-gray-500">{post.date}</time>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.hr
        {...fadeUp(0.15)}
        className="mt-8 border-card-border"
      />

      {/* Content */}
      <motion.article
        {...fadeUp(0.2)}
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Back to list */}
      <motion.div {...fadeUp(0.3)} className="mt-16 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-code/20 px-6 py-3 text-sm font-medium text-code transition-colors hover:border-code/40 hover:bg-code/5"
        >
          <ArrowLeft size={14} />
          블로그 목록으로 돌아가기
        </Link>
      </motion.div>
    </section>
  );
}
