"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

export function HireHero() {
  return (
    <section className="relative px-6 py-32">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(0,229,160,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <ScrollReveal>
          <h1
            className="font-playfair font-bold text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            홈페이지 필요하세요?
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="mt-6 text-lg font-light text-gray-400">
            기획부터 디자인, 개발, 배포까지 원스톱으로 해결해드립니다.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-chem px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
            >
              문의하기
            </a>
            <a
              href="#portfolio"
              className="rounded-full border border-chem px-8 py-3 font-medium text-chem transition-colors hover:bg-chem/10"
            >
              작업물 보기
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
