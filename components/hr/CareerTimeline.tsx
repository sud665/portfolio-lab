"use client";

import { Quote } from "lucide-react";
import { type Career } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const phaseColor: Record<string, string> = {
  chem: "bg-chem border-chem text-chem",
  code: "bg-code border-code text-code",
  ai: "bg-ai border-ai text-ai",
};

const phaseDot: Record<string, string> = {
  chem: "border-chem bg-chem",
  code: "border-code bg-code",
  ai: "border-ai bg-ai",
};

interface CareerTimelineProps {
  careers: Career[];
}

export function CareerTimeline({ careers }: CareerTimelineProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-16 text-center font-playfair text-3xl font-bold text-white">
          커리어 여정
        </h2>
      </ScrollReveal>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Gradient line */}
          <div className="absolute top-6 right-0 left-0 h-0.5 bg-gradient-to-r from-chem via-code to-ai" />

          <div className="flex justify-between">
            {careers.map((career, i) => {
              const colors = phaseColor[career.phase] ?? phaseColor.code;
              const dot = phaseDot[career.phase] ?? phaseDot.code;
              return (
                <ScrollReveal
                  key={career.order}
                  delay={i * 0.15}
                  className="flex w-1/3 flex-col items-center"
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 h-3 w-3 rounded-full border-2 ${dot}`}
                  />
                  {/* Card */}
                  <div className="mt-6 rounded-xl border border-card-border bg-card p-6 text-center">
                    <span className="text-3xl">{career.icon}</span>
                    <h3 className="mt-3 font-bold text-white">
                      {career.title}
                    </h3>
                    <span
                      className={`mt-1 inline-block text-sm ${colors.split(" ").pop()}`}
                    >
                      {career.period}
                    </span>
                    <p className="mt-3 text-sm text-gray-400">
                      {career.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="block md:hidden">
        <div className="relative border-l-2 border-gradient-to-b pl-8">
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b from-chem via-code to-ai" />

          {careers.map((career, i) => {
            const dot = phaseDot[career.phase] ?? phaseDot.code;
            const colors = phaseColor[career.phase] ?? phaseColor.code;
            return (
              <ScrollReveal
                key={career.order}
                delay={i * 0.1}
                className="relative mb-8"
              >
                <div
                  className={`absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 ${dot}`}
                />
                <div className="rounded-xl border border-card-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{career.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{career.title}</h3>
                      <span
                        className={`text-sm ${colors.split(" ").pop()}`}
                      >
                        {career.period}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">
                    {career.description}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Quote */}
      <ScrollReveal delay={0.3}>
        <div className="mt-12 rounded-xl border-l-4 border-amber bg-card p-6">
          <Quote size={24} className="mb-3 text-amber" />
          <p className="italic text-gray-300">
            &ldquo;현장에서 반복되는 비효율을 보며 &lsquo;기술로 해결할 수
            있다&rsquo;는 확신이 생겼습니다.&rdquo;
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
