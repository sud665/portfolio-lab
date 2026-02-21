import Link from "next/link";

import { type BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <article className="h-full rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-code/30 hover:bg-code/[0.03]">
        {/* Category + Date */}
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-code/20 bg-code/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-code">
            {post.category}
          </span>
          <time className="font-mono text-xs text-gray-600">{post.date}</time>
        </div>

        {/* Title */}
        <h3 className="mt-4 font-playfair text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-code-light">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {post.summary}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
