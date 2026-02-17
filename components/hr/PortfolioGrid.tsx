"use client";

import { ExternalLink } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface PortfolioProject {
  name: string;
  description: string;
  url?: string;
  accent: "chem" | "code" | "ai" | "amber";
}

const services: PortfolioProject[] = [
  {
    name: "AI Agent",
    description: "태권도 도장 AI 자동 관리 서비스",
    url: "https://stepai.stepnext.us/",
    accent: "ai",
  },
  {
    name: "태권도 SaaS 플랫폼",
    description: "태권도 도장 디지털 전환 플랫폼",
    url: "https://www.world-tkdlab.com/",
    accent: "ai",
  },
  {
    name: "꿀트립",
    description: "여행 편의 서비스 플랫폼",
    url: "https://kkultrip.com",
    accent: "amber",
  },
  {
    name: "꿀복지",
    description: "기업 워케이션 플랫폼",
    url: "https://workaction.kkultrip.com/",
    accent: "amber",
  },
  {
    name: "클로빌",
    description: "영수증 기반 경품 추첨 이벤트 솔루션",
    url: "https://www.clobill.com/",
    accent: "code",
  },
  {
    name: "TS 스마트 통제 시스템",
    description: "IoT 기반 스마트 통제 시스템",
    accent: "code",
  },
];

const sites: PortfolioProject[] = [
  {
    name: "요망진 홈페이지",
    description: "여행 솔루션 기업 사이트",
    url: "https://ymjlab.com/",
    accent: "code",
  },
  {
    name: "법무법인 H&K",
    description: "종합 법률 자문 법무법인",
    url: "https://lawfirmhk.co.kr/",
    accent: "amber",
  },
  {
    name: "이비즈클라우드",
    description: "클라우드 인프라 IT 기업",
    url: "https://ebizcloud.co.kr/",
    accent: "code",
  },
  {
    name: "신지게임즈",
    description: "게임 개발 및 운영 회사",
    url: "https://shinzigames.com/",
    accent: "chem",
  },
  {
    name: "티포러스",
    description: "노코드 AI 교육 솔루션",
    url: "https://www.tforus.com/",
    accent: "ai",
  },
  {
    name: "와우시스템",
    description: "AI·IoT·반도체 첨단기술 기업",
    url: "https://test.wowsystem.co.kr/",
    accent: "code",
  },
  {
    name: "모델릭",
    description: "3D 모델링·공간 저작 도구",
    url: "https://www.modelic.xyz/",
    accent: "chem",
  },
  {
    name: "KTL 협회",
    description: "미국 태권도 연맹 협회",
    url: "https://www.ktl.family/",
    accent: "amber",
  },
  {
    name: "브릿지스퀘어",
    description: "기업 소개 사이트",
    accent: "code",
  },
  {
    name: "니에프스 스튜디오",
    description: "XR·디지털 버추얼 프로덕션 스튜디오",
    url: "https://niepce.co.kr/",
    accent: "ai",
  },
  {
    name: "모코모코투어",
    description: "관광 투어 예약 서비스",
    url: "https://mokomokotour.com/",
    accent: "amber",
  },
];

const accentMap: Record<
  string,
  { border: string; hoverBorder: string; dot: string; line: string; glow: string }
> = {
  chem: {
    border: "border-chem/12",
    hoverBorder: "hover:border-chem/30",
    dot: "bg-chem",
    line: "via-chem/30",
    glow: "hover:shadow-chem/8",
  },
  code: {
    border: "border-code/12",
    hoverBorder: "hover:border-code/30",
    dot: "bg-code",
    line: "via-code/30",
    glow: "hover:shadow-code/8",
  },
  ai: {
    border: "border-ai/12",
    hoverBorder: "hover:border-ai/30",
    dot: "bg-ai",
    line: "via-ai/30",
    glow: "hover:shadow-ai/8",
  },
  amber: {
    border: "border-amber/12",
    hoverBorder: "hover:border-amber/30",
    dot: "bg-amber",
    line: "via-amber/30",
    glow: "hover:shadow-amber/8",
  },
};

function ServiceCard({ project, index }: { project: PortfolioProject; index: number }) {
  const accent = accentMap[project.accent];
  const Tag = project.url ? "a" : "div";
  const linkProps = project.url
    ? { href: project.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <ScrollReveal delay={index * 0.06}>
      <Tag
        {...linkProps}
        className={`group relative block h-full overflow-hidden rounded-xl border ${accent.border} ${accent.hoverBorder} bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${accent.glow}`}
      >
        {/* Top accent line */}
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        />

        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white">{project.name}</h4>
            <p className="mt-1 text-xs text-gray-500">{project.description}</p>
          </div>
          {project.url && (
            <ExternalLink
              size={13}
              className="mt-0.5 shrink-0 text-gray-600 transition-colors group-hover:text-amber"
            />
          )}
        </div>

        {/* Live badge */}
        {project.url && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-chem opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-chem" />
            </span>
            <span className="font-mono text-[9px] text-gray-600">LIVE</span>
          </div>
        )}
      </Tag>
    </ScrollReveal>
  );
}

function SiteCard({ project, index }: { project: PortfolioProject; index: number }) {
  const accent = accentMap[project.accent];
  const Tag = project.url ? "a" : "div";
  const linkProps = project.url
    ? { href: project.url, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <ScrollReveal delay={index * 0.04}>
      <Tag
        {...linkProps}
        className={`group flex items-center justify-between gap-3 rounded-lg border ${accent.border} ${accent.hoverBorder} bg-card/40 px-4 py-3 transition-all duration-200 hover:bg-card/70 ${accent.glow}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
          <div className="min-w-0">
            <span className="block truncate text-xs font-semibold text-white">
              {project.name}
            </span>
            <span className="block truncate text-[10px] text-gray-600">
              {project.description}
            </span>
          </div>
        </div>
        {project.url && (
          <ExternalLink
            size={11}
            className="shrink-0 text-gray-700 transition-colors group-hover:text-amber"
          />
        )}
      </Tag>
    </ScrollReveal>
  );
}

export function PortfolioGrid() {
  return (
    <section aria-label="포트폴리오" className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Portfolio
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            포트폴리오
          </h2>
          <p className="mt-4 text-sm text-gray-500">
            요망진 연구소에서 기획·개발·배포한 {services.length + sites.length}개 프로젝트
          </p>
        </div>
      </ScrollReveal>

      {/* Services */}
      <ScrollReveal>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-amber" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber">
            서비스 / SaaS
          </h3>
          <span className="text-[10px] text-gray-600">— {services.length}개</span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {services.map((project, i) => (
          <ServiceCard key={project.name} project={project} index={i} />
        ))}
      </div>

      {/* Sites */}
      <ScrollReveal>
        <div className="mb-4 mt-10 flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-code" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-code">
            기업 사이트 / 랜딩페이지
          </h3>
          <span className="text-[10px] text-gray-600">— {sites.length}개</span>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {sites.map((project, i) => (
          <SiteCard key={project.name} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
