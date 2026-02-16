"use client";

import { type Career } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const phaseTopBorder: Record<string, string> = {
  chem: "border-t-chem",
  code: "border-t-code",
  ai: "border-t-ai",
};

const phaseText: Record<string, string> = {
  chem: "text-chem",
  code: "text-code",
  ai: "text-ai",
};

const phaseBadgeBg: Record<string, string> = {
  chem: "bg-chem/8",
  code: "bg-code/8",
  ai: "bg-ai/8",
};

interface CareerTimelineProps {
  careers: Career[];
}

export function CareerTimeline({ careers }: CareerTimelineProps) {
  return (
    <section aria-label="커리어 여정" className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Journey
          </span>
          <h2 className="mt-2 font-playfair text-3xl font-bold text-white">
            커리어 여정
          </h2>
        </div>
      </ScrollReveal>

      {/* Gradient progress bar */}
      <ScrollReveal delay={0.1}>
        <div className="mx-auto mt-12 mb-8 h-0.5 max-w-lg rounded-full bg-gradient-to-r from-chem via-code to-ai opacity-40" />
      </ScrollReveal>

      {/* Career phase cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {careers.map((career, i) => {
          const topBorder = phaseTopBorder[career.phase] ?? "border-t-code";
          const textColor = phaseText[career.phase] ?? "text-code";
          const badgeBg = phaseBadgeBg[career.phase] ?? "bg-code/8";
          const num = String(i + 1).padStart(2, "0");

          return (
            <ScrollReveal key={career.order} delay={i * 0.12} className="h-full">
              <div
                className={`h-full rounded-xl border border-card-border ${topBorder} border-t-2 bg-card p-6 transition-colors duration-300 hover:border-card-border/80 md:p-7`}
              >
                {/* Header: icon + phase number */}
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{career.icon}</span>
                  <span className="font-mono text-xs text-gray-600">{num}</span>
                </div>

                {/* Title */}
                <h3 className="mt-4 text-base font-bold text-white">
                  {career.title}
                </h3>

                {/* Period badge */}
                <span
                  className={`mt-1.5 inline-block rounded-md ${badgeBg} px-2 py-0.5 text-xs font-semibold ${textColor}`}
                >
                  {career.period}
                </span>

                {/* Description */}
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {career.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Motivation quote */}
      <ScrollReveal delay={0.4}>
        <div className="relative mt-12 rounded-xl border border-card-border bg-card/50 p-6 md:p-8">
          <div className="absolute -top-3 left-6 bg-dark px-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber/60">
              Motivation
            </span>
          </div>
          <p className="text-sm italic leading-relaxed text-gray-400">
            &ldquo;현장에서 반복되는 비효율을 보며 &lsquo;기술로 해결할 수
            있다&rsquo;는 확신이 생겼습니다.&rdquo;
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
