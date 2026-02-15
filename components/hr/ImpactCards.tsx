"use client";

import { type Project } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const friendlyTitles: Record<string, string> = {
  "ai-agent": "AI 업무 자동화 시스템",
  "saas-platform": "SaaS 올인원 플랫폼",
  "ocr-event": "영수증 자동 인식 이벤트",
  workation: "워케이션 예약 플랫폼",
};

interface ImpactCardsProps {
  projects: Project[];
}

export function ImpactCards({ projects }: ImpactCardsProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          핵심 성과
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 0.1}>
            <div className="rounded-2xl border border-card-border bg-card p-8 transition-all duration-300 hover:border-amber/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
              <span className="text-5xl">{project.icon}</span>
              <h3 className="mt-4 text-lg font-bold text-white">
                {friendlyTitles[project.id] ?? project.title}
              </h3>
              {project.impact && (
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {project.impact}
                </p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
