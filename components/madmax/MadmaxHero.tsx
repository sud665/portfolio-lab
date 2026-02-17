"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function MadmaxHero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* 네온 그린 앰비언트 글로우 */}
      <div className="absolute inset-0 bg-glow-mad" />

      {/* 도트 그리드 패턴 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(57,255,20,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* 뱃지 */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
            Experiment Log
          </span>
        </motion.div>

        {/* 타이틀 */}
        <motion.h1
          {...fadeUp(0.08)}
          className="mt-8 font-playfair font-bold leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
        >
          MADMAX{" "}
          <span className="bg-gradient-to-r from-mad to-mad-light bg-clip-text text-transparent">
            LAB
          </span>
        </motion.h1>

        {/* 서브타이틀 */}
        <motion.p
          {...fadeUp(0.16)}
          className="mt-4 text-lg font-light text-gray-400"
        >
          희안한 거 만드는 연구실
        </motion.p>

        {/* 구분선 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 h-px w-20 origin-center bg-gradient-to-r from-transparent via-mad/40 to-transparent"
        />
      </div>
    </section>
  );
}
