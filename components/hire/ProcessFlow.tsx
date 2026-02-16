"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MessageCircle,
  LayoutTemplate,
  Palette,
  Code2,
  Rocket,
  type LucideIcon,
} from "lucide-react";

import { type HireProcess } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const stepIcons: LucideIcon[] = [
  MessageCircle,
  LayoutTemplate,
  Palette,
  Code2,
  Rocket,
];

const stepAccents = ["chem", "chem", "code", "code", "ai"] as const;

const accentClasses: Record<
  string,
  { text: string; border: string; glow: string; numColor: string }
> = {
  chem: {
    text: "text-chem",
    border: "border-chem/25",
    glow: "shadow-chem/20",
    numColor: "text-chem/[0.08]",
  },
  code: {
    text: "text-code",
    border: "border-code/25",
    glow: "shadow-code/20",
    numColor: "text-code/[0.08]",
  },
  ai: {
    text: "text-ai",
    border: "border-ai/25",
    glow: "shadow-ai/20",
    numColor: "text-ai/[0.08]",
  },
};

interface ProcessFlowProps {
  process: HireProcess[];
}

export function ProcessFlow({ process }: ProcessFlowProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-16 text-center">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-chem">
            Process
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            이렇게 진행돼요
          </h2>
        </div>
      </ScrollReveal>

      {/* ━━ Desktop ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[10%] right-[10%] top-7 z-0 h-[2px]">
            <div className="h-full rounded-full bg-gradient-to-r from-chem/25 via-code/25 to-ai/25" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-chem/10 via-code/10 to-ai/10 blur-md" />

            {/* Animated shimmer */}
            {!prefersReducedMotion && (
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["0%", "700%"] }}
                  transition={{
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="relative z-10 flex justify-between">
            {process.map((step, i) => {
              const Icon = stepIcons[i % stepIcons.length];
              const accentKey = stepAccents[i % stepAccents.length];
              const accent = accentClasses[accentKey];

              return (
                <ScrollReveal
                  key={step.step}
                  delay={i * 0.12}
                  className="group flex flex-1 flex-col items-center px-2 lg:px-4"
                >
                  {/* Indicator circle */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border ${accent.border} bg-card shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${accent.glow}`}
                  >
                    <Icon className={`h-5 w-5 ${accent.text}`} />
                  </div>

                  {/* Glass card */}
                  <div className="relative mt-6 w-full overflow-hidden rounded-xl border border-card-border/50 bg-card/50 p-5 text-center backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-card-border group-hover:bg-card/80 group-hover:shadow-lg">
                    {/* Watermark number */}
                    <span
                      className={`pointer-events-none absolute -right-1 -top-3 font-playfair text-7xl font-bold ${accent.numColor}`}
                    >
                      {step.step}
                    </span>

                    {/* Step label */}
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-widest ${accent.text}`}
                    >
                      Step 0{step.step}
                    </span>

                    <h3 className="mt-2.5 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* ━━ Mobile ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="block md:hidden">
        <div className="relative pl-14">
          {/* Gradient timeline line */}
          <div className="absolute bottom-0 left-[18px] top-0 w-[2px]">
            <div className="h-full rounded-full bg-gradient-to-b from-chem/30 via-code/30 to-ai/30" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-chem/10 via-code/10 to-ai/10 blur-sm" />
          </div>

          {process.map((step, i) => {
            const Icon = stepIcons[i % stepIcons.length];
            const accentKey = stepAccents[i % stepAccents.length];
            const accent = accentClasses[accentKey];

            return (
              <ScrollReveal
                key={step.step}
                delay={i * 0.08}
                className="relative mb-10 last:mb-0"
              >
                {/* Circle indicator on the line */}
                <div
                  className={`absolute -left-9 flex h-10 w-10 items-center justify-center rounded-full border ${accent.border} bg-card shadow-md ${accent.glow}`}
                >
                  <Icon className={`h-4 w-4 ${accent.text}`} />
                </div>

                {/* Content card */}
                <div className="overflow-hidden rounded-xl border border-card-border/50 bg-card/50 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-widest ${accent.text}`}
                    >
                      Step 0{step.step}
                    </span>
                    <div className="h-px flex-1 bg-card-border" />
                  </div>
                  <h3 className="mt-2 font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-400">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
