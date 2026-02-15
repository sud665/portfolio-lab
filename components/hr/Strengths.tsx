"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const strengths = [
  {
    icon: "🔄",
    title: "빠른 학습력",
    description: "비전공에서 4년 만에 AI Agent까지",
  },
  {
    icon: "🏭",
    title: "도메인 지식",
    description: "7년간 쌓은 제조업 현장 이해",
  },
  {
    icon: "🚀",
    title: "자기주도 실행력",
    description: "스타트업에서 기획부터 배포까지 전 과정",
  },
  {
    icon: "🤖",
    title: "최신 기술 적응",
    description: "LangChain/LangGraph 실전 적용",
  },
  {
    icon: "📋",
    title: "풀사이클 개발",
    description: "기획, 디자인, 개발, 배포, 운영 전체",
  },
];

export function Strengths() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          핵심 강점
        </h2>
      </ScrollReveal>

      <div className="flex flex-wrap justify-center gap-6">
        {strengths.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.08}>
            <div className="w-56 rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-amber/40">
              <span className="text-3xl">{s.icon}</span>
              <h3 className="mt-3 font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{s.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
