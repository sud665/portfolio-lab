import {
  MessageCircle,
  LayoutTemplate,
  Palette,
  Code2,
  Rocket,
} from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const steps = [
  {
    icon: MessageCircle,
    title: "상담",
    client: "어떤 사이트가 필요한지 말씀해주세요",
    dev: "요구사항을 정리하고 견적을 안내드립니다",
  },
  {
    icon: LayoutTemplate,
    title: "기획",
    client: "정리된 기획안을 확인해주세요",
    dev: "사이트 구조와 기능 목록을 설계합니다",
  },
  {
    icon: Palette,
    title: "디자인",
    client: "시안을 보고 피드백해주세요",
    dev: "시안을 제작하고 수정합니다",
  },
  {
    icon: Code2,
    title: "개발",
    client: "중간 결과물을 확인해주세요",
    dev: "코드를 작성하고 기능을 구현합니다",
  },
  {
    icon: Rocket,
    title: "배포",
    client: "최종 확인 후 오픈합니다",
    dev: "배포하고 사용법을 안내드립니다",
  },
];

export function WishketProcess() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          이렇게 진행돼요
        </h2>
      </ScrollReveal>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 0.08}>
            <div className="flex gap-5 rounded-2xl border border-card-border bg-card p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-chem/20 text-chem">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  <span className="mr-2 text-chem">0{i + 1}</span>
                  {step.title}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-500/5 px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      고객
                    </p>
                    <p className="mt-1 text-sm text-muted">{step.client}</p>
                  </div>
                  <div className="rounded-lg bg-chem/5 px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-chem/60">
                      개발자
                    </p>
                    <p className="mt-1 text-sm text-muted">{step.dev}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
