"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

export function HRDebate() {
  return (
    <section aria-label="후보자 평가" className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Assessment
          </span>
          <h2 className="mt-2 font-playfair text-3xl font-bold text-white">
            후보자 평가
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
            커리어 전환 후보자에 대한 객관적 시각
          </p>
        </div>
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Positive assessment */}
        <ScrollReveal delay={0.1}>
          <div className="h-full rounded-xl border border-chem/15 bg-chem/5 p-7">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-chem" />
              <span className="text-xs font-bold uppercase tracking-wider text-chem">
                긍정 평가
              </span>
            </div>
            <p className="mt-5 text-sm italic leading-relaxed text-gray-300">
              &ldquo;화학공학 7년 + 풀스택 4년 + AI Agent 경험. 이 조합은
              시장에서 찾기 어렵습니다. 단순히 코드를 짜는 개발자가 아니라,
              산업의 문제를 이해하고 기술로 해결하는 사람입니다. 특히 AI
              Agent를 실전에 적용한 경험은 상위 역량입니다.&rdquo;
            </p>
          </div>
        </ScrollReveal>

        {/* Concern */}
        <ScrollReveal delay={0.2}>
          <div className="h-full rounded-xl border border-ai/15 bg-ai/5 p-7">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-ai" />
              <span className="text-xs font-bold uppercase tracking-wider text-ai">
                우려 사항
              </span>
            </div>
            <p className="mt-5 text-sm italic leading-relaxed text-gray-300">
              &ldquo;개발 경력 4년은 시니어로 보기엔 짧습니다. 다만 KCC
              7년이 도메인 지식으로 연결된다면 설득력이 있고, SaaS 멀티테넌트
              설계와 AI Agent 시스템은 기술적 깊이를 보여줍니다.&rdquo;
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Conclusion */}
      <ScrollReveal delay={0.3}>
        <div className="mt-5 rounded-xl border border-amber/15 bg-amber/5 p-6 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber/70">
            결론
          </span>
          <p className="mt-2 text-sm font-medium leading-relaxed text-gray-300">
            전환 스토리가 탄탄하다면 오히려{" "}
            <span className="text-amber">차별화 포인트</span>입니다.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
