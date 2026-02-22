import { Globe, TrendingUp, Bot, Server, GitBranch } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const skills = [
  {
    icon: Globe,
    title: "Next.js 풀스택",
    description:
      "SSR/SSG 최적화, 반응형 디자인, SEO까지 기획부터 배포까지 한 번에 해결합니다. 빠르고 안정적인 웹사이트를 만듭니다.",
    accent: "chem" as const,
    tags: ["React", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    icon: TrendingUp,
    title: "마케팅 전략",
    description:
      "기술을 아는 마케터. SEO 세팅, 전환율 최적화, 퍼포먼스 마케팅까지 직접 설계하고 구현합니다.",
    accent: "amber" as const,
    tags: ["SEO", "GA4", "GTM", "CRO"],
  },
  {
    icon: Server,
    title: "NestJS 백엔드",
    description:
      "NestJS 기반 백엔드 API를 설계하고 구축합니다. 인증, 데이터베이스, 파일 관리 등 서버 측 로직을 안정적으로 구현합니다.",
    accent: "code" as const,
    tags: ["NestJS", "PostgreSQL", "Prisma", "REST API"],
  },
  {
    icon: GitBranch,
    title: "CI/CD 자동화",
    description:
      "GitHub Actions로 테스트, 빌드, 배포를 자동화합니다. 코드 푸시만 하면 자동으로 검증되고 배포되는 파이프라인을 구축합니다.",
    accent: "code" as const,
    tags: ["GitHub Actions", "Docker", "Vercel", "AWS"],
  },
  {
    icon: Bot,
    title: "AI Agent AX 구축",
    description:
      "AI 에이전트 경험(AX)을 설계하고 구축합니다. 챗봇, 자동화 워크플로우, AI 연동 시스템을 비즈니스에 맞게 만듭니다.",
    accent: "ai" as const,
    tags: ["OpenAI", "Claude", "RAG", "MCP"],
  },
];

const accentStyles = {
  chem: "bg-chem/8 text-chem",
  code: "bg-code/8 text-code",
  amber: "bg-amber/8 text-amber",
  ai: "bg-ai/8 text-ai",
};

const tagStyles = {
  chem: "bg-chem/10 text-chem/80",
  code: "bg-code/10 text-code/80",
  amber: "bg-amber/10 text-amber/80",
  ai: "bg-ai/10 text-ai/80",
};

export function CoreSkills() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <p className="mb-3 text-center font-mono text-sm uppercase tracking-widest text-chem">
          Core Skills
        </p>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          핵심 역량
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {skills.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.1}>
            <div className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[s.accent]}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {s.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${tagStyles[s.accent]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
