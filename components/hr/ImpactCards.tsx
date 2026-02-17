"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ProjectTask {
  title: string;
  details: string[];
}

interface ResumeProject {
  name: string;
  description: string;
  period: string;
  team: string;
  role: string;
  tools: string[];
  tasks: ProjectTask[];
  review: string;
  links: { label: string; url: string }[];
  accent: "chem" | "code" | "amber";
}

const projects: ResumeProject[] = [
  {
    name: "Film Storage",
    description:
      "필름카메라 사용자를 위한 위치기반 + 필름 추천 + 커뮤니티 서비스",
    period: "2022.03 - 2022.04",
    team: "코드스테이츠 Final 프로젝트 (4인 / 4주)",
    role: "팀원, Front-end",
    tools: ["React", "React Hooks", "Responsive Web", "styled_components"],
    tasks: [
      {
        title: "취향 알고리즘 기능 구현",
        details: [
          "27장 필름사진 중 선택된 9장의 정보를 토대로 필름 추천 서비스 구현",
          "흑백·컬러·특이 사진 객체 기반 통계 알고리즘 구현",
        ],
      },
      {
        title: "필름로그 페이지 완성",
        details: [
          "React-slick 이미지 carousel 랜더링",
          "React-select 필름 종류별 필터링",
          "Intersection API 무한스크롤 구현",
        ],
      },
      {
        title: "좋아요 버튼 & 모달창 구현",
        details: [
          "CSS selector 마우스오버 좋아요 버튼",
          "FileReader Blob 이미지 미리보기",
          "카카오 지도 API 장소 지정",
        ],
      },
      {
        title: "날씨 기반 필름 추천",
        details: [
          "OpenWeather API + Geolocation API 활용",
          "날씨에 적합한 필름 추천 기능",
        ],
      },
      {
        title: "반응형 웹 구현",
        details: [
          "Styled component 미디어 쿼리 활용",
          "테블릿 & 모바일 기기 특성에 맞춘 UI 변경",
        ],
      },
    ],
    review:
      "기획 의도에 맞게 필름 카메라 사용자를 위한 웹서비스를 제작했습니다. 2주간 기획을 진행하며 아이디어 회의, 요구사항, API, Flow chart 등 웹 개발의 흐름을 익혔습니다. 생산성을 높이기 위해 관련 라이브러리를 적극 활용했습니다.",
    links: [
      { label: "GitHub", url: "https://github.com/codestates/FilmStorage" },
    ],
    accent: "amber",
  },
  {
    name: "33plan",
    description: "메타인지 기반 학습 도우미 서비스",
    period: "2022.02 - 2022.03",
    team: "코드스테이츠 First 프로젝트 (4인 / 2주)",
    role: "팀원, Front-end",
    tools: ["React", "React Hooks", "Responsive Web"],
    tasks: [
      {
        title: "회원정보 관리 기능 구현",
        details: [
          "정규식을 통한 유효성검사 (이메일, 비밀번호)",
          "Axios를 이용한 로그인/로그아웃/회원정보 CRUD",
        ],
      },
      {
        title: "메타인지 알고리즘 구현",
        details: [
          "setInterval & setTimeout으로 1분간 30개 단어 2초마다 랜더링",
          "입력 결과값과 예측 결과를 비교하여 결과 도출",
        ],
      },
      {
        title: "반응형 웹 구현",
        details: ["CSS 미디어 쿼리를 이용한 모바일 반응형 웹"],
      },
    ],
    review:
      "2주 동안 빠르게 프로젝트를 진행하면서 기획의 중요성, git 관리, 주석 처리, 반응형 웹 등 좋은 프로젝트의 조건을 배웠습니다.",
    links: [
      { label: "GitHub", url: "https://github.com/codestates/33Plan" },
    ],
    accent: "code",
  },
];

const accentConfig: Record<string, { border: string; hoverBorder: string; tag: string; dot: string; taskBg: string; line: string }> = {
  chem: {
    border: "border-chem/15",
    hoverBorder: "hover:border-chem/30",
    tag: "bg-chem/10 text-chem border-chem/15",
    dot: "bg-chem",
    taskBg: "bg-chem/[0.04]",
    line: "via-chem/30",
  },
  code: {
    border: "border-code/15",
    hoverBorder: "hover:border-code/30",
    tag: "bg-code/10 text-code border-code/15",
    dot: "bg-code",
    taskBg: "bg-code/[0.04]",
    line: "via-code/30",
  },
  amber: {
    border: "border-amber/15",
    hoverBorder: "hover:border-amber/30",
    tag: "bg-amber/10 text-amber border-amber/15",
    dot: "bg-amber",
    taskBg: "bg-amber/[0.04]",
    line: "via-amber/30",
  },
};

function ProjectCard({ project, index }: { project: ResumeProject; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const accent = accentConfig[project.accent] ?? accentConfig.code;

  return (
    <ScrollReveal delay={index * 0.15}>
      <div
        className={`group relative overflow-hidden rounded-2xl border ${accent.border} bg-card/60 backdrop-blur-sm transition-all duration-300 ${accent.hoverBorder} hover:shadow-xl`}
      >
        {/* Top accent line */}
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent`}
        />

        {/* Header */}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-gray-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-playfair text-xl font-bold text-white md:text-2xl">
                  {project.name}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {project.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span
                className={`rounded-lg border px-3 py-1 text-xs font-semibold ${accent.tag}`}
              >
                {project.period}
              </span>
              <span className="text-[10px] text-gray-500">{project.team}</span>
            </div>
          </div>

          {/* Role */}
          <p className="mt-3 text-xs font-medium text-amber/80">
            [{project.role}]
          </p>

          {/* Tool tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="rounded-md border border-card-border bg-card px-2.5 py-1 font-mono text-[10px] text-gray-400"
              >
                {tool}
              </span>
            ))}
          </div>

          {/* Links */}
          {project.links.length > 0 && (
            <div className="mt-4 flex gap-2">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-amber"
                >
                  <ExternalLink size={11} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Expandable tasks */}
        <div className="border-t border-card-border/50">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-gray-400 transition-colors hover:text-white md:px-8"
          >
            <span>수행 업무 ({project.tasks.length})</span>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-4 px-6 pb-6 md:px-8 md:pb-8">
                  {project.tasks.map((task, ti) => (
                    <div
                      key={ti}
                      className={`rounded-xl ${accent.taskBg} p-4`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${accent.dot}`}
                        />
                        <h4 className="text-sm font-semibold text-white">
                          {task.title}
                        </h4>
                      </div>
                      <ul className="mt-2 space-y-1 pl-4">
                        {task.details.map((detail, di) => (
                          <li
                            key={di}
                            className="text-xs leading-relaxed text-gray-400"
                          >
                            <span className="mr-1.5 text-gray-600">→</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Review */}
        <div className="border-t border-card-border/50 px-6 py-5 md:px-8">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 font-playfair text-lg text-amber/30">
              &ldquo;
            </span>
            <p className="text-xs italic leading-relaxed text-gray-400">
              {project.review}
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ImpactCards() {
  return (
    <section aria-label="프로젝트" className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Projects
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            프로젝트
          </h2>
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
