"use client";

import { motion } from "framer-motion";

import { type Phase } from "@/lib/types";

import { ChemistryIllustration } from "@/components/home/ChemistryIllustration";
import { CodeIllustration } from "@/components/home/CodeIllustration";
import { AiIllustration } from "@/components/home/AiIllustration";

const illustrations = [ChemistryIllustration, CodeIllustration, AiIllustration];

const badgeClass: Record<string, string> = {
  chem: "text-chem border-chem/20 bg-chem/5",
  code: "text-code border-code/20 bg-code/5",
  ai: "text-ai border-ai/20 bg-ai/5",
};

interface PhaseSectionProps {
  phase: Phase;
  index: number;
  isLast: boolean;
}

export function PhaseSection({ phase, index, isLast }: PhaseSectionProps) {
  const Illustration = illustrations[index];
  const isReversed = index % 2 !== 0;

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-16 md:py-20">
      {/* Phase ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at ${isReversed ? "30%" : "70%"} 50%, ${phase.hex}0a 0%, transparent 70%)`,
        }}
      />

      {/* Noise texture */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.012]"
        aria-hidden="true">
        <filter id={`noise-${index}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#noise-${index})`}
        />
      </svg>

      {/* Content — alternating layout on desktop */}
      <div
        className={`relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-20 ${isReversed ? "md:flex-row-reverse" : ""}`}>
        {/* Illustration */}
        <motion.div
          className="relative flex-shrink-0"
          initial={{ opacity: 0, scale: 0.88 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <Illustration />
        </motion.div>

        {/* Text */}
        <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
          {/* Number watermark */}
          <span className="pointer-events-none absolute -top-10 right-0 select-none font-playfair text-[7rem] font-bold leading-none text-white/[0.02] md:-top-14 md:text-[10rem]">
            {phase.num}
          </span>

          {/* Category badge */}
          <motion.span
            className={`rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${badgeClass[phase.color]}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}>
            Chapter {phase.num} — {phase.category}
          </motion.span>

          {/* Title */}
          <motion.h2
            className="mt-6 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}>
            {phase.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="mt-4 max-w-md text-sm leading-relaxed text-gray-400 md:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}>
            {phase.desc}
          </motion.p>
        </div>
      </div>

      {/* Section divider */}
      {!isLast && (
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 flex-col items-center">
          <div
            className="h-16 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${phase.hex}30)`,
            }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: phase.hex, opacity: 0.4 }}
          />
        </div>
      )}
    </section>
  );
}
