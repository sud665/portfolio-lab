"use client";

import { Download } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface StoryHeroProps {
  resumePdf: string;
}

export function StoryHero({ resumePdf }: StoryHeroProps) {
  return (
    <section className="relative px-6 py-32">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <ScrollReveal>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: "clamp(3rem, 5vw, 5rem)" }}
          >
            현장의 문제를 아는 개발자
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 text-lg font-light text-gray-400">
            화학공학 7년의 도메인 지식 위에 풀스택 개발 4년의 기술력을
            쌓았습니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href={resumePdf}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-yellow-500 px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            <Download size={18} />
            이력서 다운로드
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
