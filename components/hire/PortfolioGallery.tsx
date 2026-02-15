"use client";

import { type Project } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const friendlyDescs: Record<string, string> = {
  "ai-agent": "AI 기반 업무 자동화 도구",
  "saas-platform": "여러 회사 홈페이지를 한 곳에서 관리하는 플랫폼",
  "ocr-event": "영수증 사진으로 자동 참여하는 이벤트 시스템",
  workation: "원격 근무지 예약 시스템",
};

const gradients = [
  "from-chem/20 to-code/20",
  "from-code/20 to-ai/20",
  "from-ai/20 to-amber/20",
  "from-amber/20 to-chem/20",
];

interface PortfolioGalleryProps {
  projects: Project[];
}

export function PortfolioGallery({ projects }: PortfolioGalleryProps) {
  return (
    <section id="portfolio" className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          이런 사이트를 만들었어요
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ScrollReveal key={project.id} delay={i * 0.1}>
            <div className="overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-chem/10">
              {/* Placeholder screenshot */}
              <div
                className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}
              >
                <div className="text-center">
                  <span className="text-4xl">{project.icon}</span>
                  <p className="mt-2 text-xs text-gray-400">
                    스크린샷 준비중
                  </p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="mt-2 text-sm text-gray-400">
                  {friendlyDescs[project.id] ?? project.impact}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
