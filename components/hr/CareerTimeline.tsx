"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ProjectHighlight {
  icon: string;
  name: string;
  description: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
}

interface CareerEntry {
  company: string;
  role: string;
  period: string;
  status?: string;
  phase: "chem" | "code" | "ai";
  icon: string;
  details: string[];
  projects?: ProjectHighlight[];
}

const careers: CareerEntry[] = [
  {
    company: "KCC",
    role: "전착도료기술팀",
    period: "2014.07 ~ 2021.05",
    phase: "chem",
    icon: "⚗️",
    details: [
      "러시아 현대자동차 상트페테르부르크 해외파견 근무 (2020.01~2020.11)",
      "인도 기아자동차(KMI) 전착도료 신규 거래선 확보 (2018.01~2019.12)",
      "국내 자동차부품 도료 기술지원 (2017.01~2018.12)",
      "신규도료 개발로 거래선 확보 (2016.01~2017.12)",
      "수용성 첨가제 개발 참여",
    ],
  },
  {
    company: "요망진 연구소",
    role: "풀스택 개발자",
    period: "2022.06 ~ 재직중",
    status: "재직중",
    phase: "code",
    icon: "💻",
    details: [
      "Java Thymeleaf & PostgreSQL 기반 Back office 풀스택 구현",
    ],
    projects: [
      {
        icon: "🤖",
        name: "AI Agent 업무관리 시스템",
        description:
          "LangGraph 기반 멀티 에이전트 워크플로우 + 실시간 음성 인터랙션 AI 업무관리 SaaS",
        techStack: ["LangGraph", "LangChain", "Next.js", "Nest.js", "PostgreSQL"],
        metrics: [
          { label: "에이전트 도구", value: "29개" },
          { label: "LLM 프로바이더", value: "4개" },
          { label: "메모리 계층", value: "3계층" },
          { label: "테넌시 격리", value: "4레벨" },
        ],
      },
      {
        icon: "🔄",
        name: "SaaS 스위칭 플랫폼",
        description:
          "SaaS 서비스 간 데이터 마이그레이션과 스위칭을 자동화하는 플랫폼",
        techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL"],
        metrics: [
          { label: "전환 소요 시간", value: "3일→4h" },
          { label: "자동화율", value: "95%" },
          { label: "수동 작업 절감", value: "월 40h" },
        ],
      },
      {
        icon: "📸",
        name: "OCR 이벤트 시스템",
        description:
          "이미지에서 텍스트를 추출하여 이벤트 참여를 자동 검증하는 시스템",
        techStack: ["Python", "OCR", "Next.js", "AWS"],
        metrics: [
          { label: "인식 정확도", value: "97%" },
          { label: "처리 속도", value: "건당 2초" },
          { label: "효율 향상", value: "15배" },
        ],
      },
      {
        icon: "🏖️",
        name: "워케이션 플랫폼",
        description:
          "원격 근무자를 위한 워케이션 장소 검색 및 예약 플랫폼",
        techStack: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        metrics: [
          { label: "등록 장소", value: "200+" },
          { label: "예약 전환율", value: "12%" },
          { label: "만족도", value: "4.6/5" },
        ],
      },
    ],
  },
];

const phaseConfig: Record<
  string,
  { border: string; text: string; badge: string; dot: string; line: string; metricText: string }
> = {
  chem: {
    border: "border-chem/20",
    text: "text-chem",
    badge: "bg-chem/10 text-chem border-chem/20",
    dot: "bg-chem",
    line: "via-chem/30",
    metricText: "text-chem",
  },
  code: {
    border: "border-code/20",
    text: "text-code",
    badge: "bg-code/10 text-code border-code/20",
    dot: "bg-code",
    line: "via-code/30",
    metricText: "text-code",
  },
  ai: {
    border: "border-ai/20",
    text: "text-ai",
    badge: "bg-ai/10 text-ai border-ai/20",
    dot: "bg-ai",
    line: "via-ai/30",
    metricText: "text-ai",
  },
};

export function CareerTimeline() {
  return (
    <section aria-label="경력사항" className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Career
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            경력사항
          </h2>
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <div className="relative ml-4 border-l border-card-border pl-8 md:ml-8 md:pl-12">
        {careers.map((career, i) => {
          const config = phaseConfig[career.phase];

          return (
            <ScrollReveal
              key={career.company}
              delay={i * 0.12}
              className={i < careers.length - 1 ? "mb-12" : ""}
            >
              <div className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-[calc(2rem+6.5px)] top-1 h-3.5 w-3.5 rounded-full border-2 border-dark ${config.dot} md:-left-[calc(3rem+6.5px)]`}
                />

                {/* Connecting line glow */}
                <div
                  className={`absolute -left-[calc(2rem+0.5px)] top-4 h-full w-px bg-gradient-to-b from-transparent ${config.line} to-transparent md:-left-[calc(3rem+0.5px)]`}
                />

                {/* Card */}
                <div
                  className={`rounded-2xl border ${config.border} bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-opacity-40 hover:shadow-lg md:p-8`}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{career.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {career.company}
                        </h3>
                        <p className={`text-sm font-medium ${config.text}`}>
                          {career.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-lg border px-3 py-1 text-xs font-semibold ${config.badge}`}
                      >
                        {career.period}
                      </span>
                      {career.status && (
                        <span className="rounded-full bg-chem/10 px-2.5 py-0.5 text-[10px] font-bold text-chem">
                          {career.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Basic details */}
                  <ul className="mt-5 space-y-2.5">
                    {career.details.map((detail, di) => (
                      <li
                        key={di}
                        className="flex items-start gap-2.5 text-sm text-gray-400"
                      >
                        <span
                          className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${config.dot} opacity-50`}
                        />
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Project highlights */}
                  {career.projects && career.projects.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-card-border/60" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600">
                          주요 프로젝트
                        </span>
                        <div className="h-px flex-1 bg-card-border/60" />
                      </div>

                      {career.projects.map((project) => (
                        <div
                          key={project.name}
                          className="rounded-xl border border-card-border/60 bg-dark/40 p-5"
                        >
                          {/* Project header */}
                          <div className="flex items-start gap-2.5">
                            <span className="text-lg">{project.icon}</span>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-bold text-white">
                                {project.name}
                              </h4>
                              <p className="mt-1 text-xs leading-relaxed text-gray-500">
                                {project.description}
                              </p>
                            </div>
                          </div>

                          {/* Tech tags */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="rounded-md border border-card-border bg-card/60 px-2 py-0.5 font-mono text-[10px] text-gray-500"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Metrics */}
                          {project.metrics.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                              {project.metrics.map((m) => (
                                <div
                                  key={m.label}
                                  className="flex items-baseline gap-1.5"
                                >
                                  <span
                                    className={`font-outfit text-sm font-bold ${config.metricText}`}
                                  >
                                    {m.value}
                                  </span>
                                  <span className="text-[10px] text-gray-600">
                                    {m.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
