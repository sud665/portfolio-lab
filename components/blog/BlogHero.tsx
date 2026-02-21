"use client";

import { motion } from "framer-motion";

interface BlogHeroProps {
  postCount: number;
}

export function BlogHero({ postCount }: BlogHeroProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-code/60">
          <span className="inline-block h-1 w-1 rounded-full bg-code" />
          Blog
        </span>
        <h1 className="mt-3 font-playfair text-4xl font-bold text-white md:text-5xl">
          실전에서 배운{" "}
          <span className="text-code">CS 개념들</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
          프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록.
          문제 상황, 핵심 개념, 해결 과정을 공유합니다.
        </p>
        <p className="mt-2 font-mono text-xs text-gray-600">
          {postCount} posts
        </p>
      </motion.div>
    </section>
  );
}
