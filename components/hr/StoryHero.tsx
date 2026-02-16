"use client";

import { motion } from "framer-motion";
import { Download, Mail, ChevronDown } from "lucide-react";

interface StoryHeroProps {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resumePdf: string;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const metrics = [
  { value: "7년", label: "도메인 전문성", detail: "화학공학 · KCC" },
  { value: "4년", label: "풀스택 개발", detail: "기획→배포 전과정" },
  { value: "Now", label: "AI Agent", detail: "LangChain · LangGraph" },
];

export function StoryHero({
  name,
  title,
  tagline,
  email,
  resumePdf,
}: StoryHeroProps) {
  return (
    <section
      aria-label="프로필 요약"
      className="relative overflow-hidden px-6 py-28 md:py-36"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-glow-amber" />

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Badge */}
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="inline-block border-b border-amber/30 pb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-amber/70">
            Career Brief
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-8 text-center font-playfair font-bold tracking-tight text-white"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
        >
          {name}
        </motion.h1>

        {/* Title & Tagline */}
        <motion.div {...fadeUp(0.2)} className="mt-4 text-center">
          <p className="text-lg font-medium text-amber">{title}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
            {tagline}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto mt-10 h-px w-16 origin-center bg-amber/30"
        />

        {/* Metrics strip */}
        <motion.div
          {...fadeUp(0.4)}
          className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3"
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-card-border bg-card/50 px-3 py-5 text-center backdrop-blur-sm transition-colors duration-300 hover:border-amber/20 md:px-5 md:py-6"
            >
              <div className="font-outfit text-2xl font-bold text-white md:text-3xl">
                {m.value}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-amber md:text-xs">
                {m.label}
              </div>
              <div className="mt-0.5 hidden text-[10px] text-gray-600 md:block">
                {m.detail}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          {...fadeUp(0.55)}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href={resumePdf}
            className="flex items-center gap-2 rounded-full bg-amber px-7 py-3 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.3)]"
          >
            <Download size={15} aria-hidden="true" />
            이력서 다운로드
          </a>
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 rounded-full border border-amber/20 px-7 py-3 text-sm font-medium text-amber transition-colors duration-300 hover:border-amber/40 hover:bg-amber/5"
            >
              <Mail size={15} aria-hidden="true" />
              이메일 보내기
            </a>
          )}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.5, duration: 1.2 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown size={18} className="text-gray-600" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
