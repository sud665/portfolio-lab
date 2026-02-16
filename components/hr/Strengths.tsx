"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const strengths = [
  {
    icon: "🔄",
    title: "빠른 학습력",
    highlight: "비전공 → AI Agent 4년",
    description:
      "화학공학 전공에서 독학으로 풀스택 개발자로 전환, 4년 만에 LangChain 기반 AI Agent 시스템까지 개발했습니다.",
    color: "chem" as const,
  },
  {
    icon: "🏭",
    title: "도메인 지식",
    highlight: "제조업 현장 7년",
    description:
      "7년간의 제조업 경험으로 기술과 비즈니스를 연결하는 관점을 갖고 있습니다.",
    color: "amber" as const,
  },
  {
    icon: "🚀",
    title: "자기주도 실행력",
    highlight: "기획 → 배포 단독 수행",
    description:
      "스타트업에서 기획부터 배포까지 직접 수행. 문제를 찾아 해결합니다.",
    color: "ai" as const,
  },
  {
    icon: "🤖",
    title: "최신 기술 적응",
    highlight: "LangChain · LangGraph 실전",
    description:
      "최신 AI 프레임워크를 실전에 적용. 기술 트렌드에 빠르게 대응합니다.",
    color: "code" as const,
  },
  {
    icon: "📋",
    title: "풀사이클 개발",
    highlight: "기획 ~ 운영 전 과정",
    description: "기획, 디자인, 개발, 배포, 운영까지 전체를 경험한 개발자입니다.",
    color: "chem" as const,
  },
];

const colorConfig: Record<
  string,
  {
    iconBg: string;
    pill: string;
    hoverBorder: string;
    hoverGlow: string;
    line: string;
  }
> = {
  chem: {
    iconBg: "border-chem/20 bg-chem/[0.07]",
    pill: "bg-chem/10 text-chem",
    hoverBorder: "group-hover:border-chem/30",
    hoverGlow: "group-hover:shadow-chem/10",
    line: "via-chem/40",
  },
  code: {
    iconBg: "border-code/20 bg-code/[0.07]",
    pill: "bg-code/10 text-code",
    hoverBorder: "group-hover:border-code/30",
    hoverGlow: "group-hover:shadow-code/10",
    line: "via-code/40",
  },
  ai: {
    iconBg: "border-ai/20 bg-ai/[0.07]",
    pill: "bg-ai/10 text-ai",
    hoverBorder: "group-hover:border-ai/30",
    hoverGlow: "group-hover:shadow-ai/10",
    line: "via-ai/40",
  },
  amber: {
    iconBg: "border-amber/20 bg-amber/[0.07]",
    pill: "bg-amber/10 text-amber",
    hoverBorder: "group-hover:border-amber/30",
    hoverGlow: "group-hover:shadow-amber/10",
    line: "via-amber/40",
  },
};

const gridClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-6",
  "md:col-span-6",
];

export function Strengths() {
  return (
    <section aria-label="핵심 강점" className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Strengths
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            핵심 강점
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {strengths.map((s, i) => {
          const config = colorConfig[s.color];
          const isHero = i === 0;
          const gridPos = gridClasses[i] ?? "md:col-span-6";

          return (
            <ScrollReveal
              key={s.title}
              delay={i * 0.08}
              className={gridPos}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${config.hoverGlow} ${config.hoverBorder} ${isHero ? "p-8 md:p-9" : "p-6"}`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${config.line} to-transparent`}
                />

                {/* Icon */}
                <div
                  className={`flex items-center justify-center rounded-xl border backdrop-blur-sm ${config.iconBg} ${isHero ? "h-16 w-16" : "h-12 w-12"}`}
                >
                  <span className={isHero ? "text-3xl" : "text-xl"}>
                    {s.icon}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`mt-4 font-semibold text-white ${isHero ? "font-playfair text-xl" : "text-base"}`}
                >
                  {s.title}
                </h3>

                {/* Evidence pill */}
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.pill}`}
                >
                  {s.highlight}
                </span>

                {/* Description */}
                <p
                  className={`mt-3 leading-relaxed text-gray-400 ${isHero ? "text-sm" : "text-xs"}`}
                >
                  {s.description}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
