import { Factory, Code2, Bot } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const strengths = [
  {
    icon: Factory,
    title: "현장을 아는 개발자",
    description:
      "화학공학 7년 현장 경험으로 비즈니스 맥락을 이해합니다. 개발자와 소통이 어려웠던 경험이 있으시다면, 저는 다릅니다.",
    accent: "chem" as const,
  },
  {
    icon: Code2,
    title: "1인 풀스택",
    description:
      "기획, 디자인, 프론트엔드, 백엔드, 배포까지 혼자 처리합니다. 여러 명 조율할 필요 없이 한 사람과만 소통하면 됩니다.",
    accent: "code" as const,
  },
  {
    icon: Bot,
    title: "AI 연동 가능",
    description:
      "단순 웹사이트를 넘어 AI 챗봇, 업무 자동화 시스템까지 확장할 수 있습니다. 미래를 위한 투자입니다.",
    accent: "ai" as const,
  },
];

const accentStyles = {
  chem: "bg-chem/8 text-chem",
  code: "bg-code/8 text-code",
  ai: "bg-ai/8 text-ai",
};

export function WhyMe() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          왜 저를 선택해야 할까요?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {strengths.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-card-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[s.accent]}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {s.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
