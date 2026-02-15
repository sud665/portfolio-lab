"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

export function HRDebate() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="rounded-2xl border border-card-border bg-card p-10">
          <h2 className="mb-8 text-center font-playfair text-2xl font-bold text-white">
            긍정 HR vs 부정 HR — 이 후보자 평가
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Positive */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-chem/15 bg-chem/5 p-7">
                <span className="text-xs font-medium uppercase tracking-widest text-chem">
                  긍정 HR
                </span>
                <p className="mt-4 text-sm italic leading-relaxed text-gray-300">
                  &ldquo;화학공학 7년 + 풀스택 4년 + AI Agent 경험. 이 조합은
                  시장에서 찾기 어렵습니다. 단순히 코드를 짜는 개발자가 아니라,
                  산업의 문제를 이해하고 기술로 해결하는 사람입니다. 특히 AI
                  Agent를 실전에 적용한 경험은 2025년 기준 상위
                  역량입니다.&rdquo;
                </p>
              </div>
            </ScrollReveal>

            {/* Negative */}
            <ScrollReveal delay={0.2}>
              <div className="rounded-xl border border-ai/15 bg-ai/5 p-7">
                <span className="text-xs font-medium uppercase tracking-widest text-ai">
                  부정 HR
                </span>
                <p className="mt-4 text-sm italic leading-relaxed text-gray-300">
                  &ldquo;개발 경력 4년은 시니어로 보기엔 짧습니다. 다만 KCC
                  7년이 도메인 지식으로 연결된다면 설득력이 있고, SaaS 멀티테넌트
                  설계와 AI Agent 시스템은 기술적 깊이를 보여줍니다. 결론: 전환
                  스토리가 탄탄하다면 오히려 차별화 포인트입니다.&rdquo;
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
