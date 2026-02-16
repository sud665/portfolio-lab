"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface Review {
  quote: string;
  name: string;
  role: string;
  accent: "chem" | "code" | "ai" | "amber";
}

const reviews: Review[] = [
  {
    quote: "현장 공정 데이터를 직접 분석해서 개선안까지 만들던 사람. 기술 전환 후에도 그 꼼꼼함은 그대로임",
    name: "김도윤",
    role: "KCC 선임 연구원",
    accent: "chem",
  },
  {
    quote: "프로젝트 팀장하면 새벽까지 코드리뷰 해주던 사람. 리뷰 코멘트가 항상 배울 점이 있음",
    name: "이서연",
    role: "공동 개발자",
    accent: "code",
  },
  {
    quote: "비전공인데 우리보다 빨리 이해하고 응용까지 해버림. 학습 속도가 비정상적",
    name: "박현우",
    role: "기술 스터디 동료",
    accent: "ai",
  },
  {
    quote: "제조업 7년 경험이 코드에 묻어남. 문제를 정의하는 것부터 남다름",
    name: "정민지",
    role: "스타트업 PM",
    accent: "amber",
  },
  {
    quote: "기획부터 배포까지 혼자 풀사이클을 돌릴 수 있는 몇 안 되는 개발자",
    name: "최준혁",
    role: "공동 개발자",
    accent: "chem",
  },
  {
    quote: "어려운 개념도 현장 비유로 설명해줘서 비개발 직군도 이해시킴",
    name: "한소율",
    role: "기술 스터디 동료",
    accent: "code",
  },
  {
    quote: "삽질해서 해결하면 노션에 트러블슈팅 문서까지 남기는 타입. 팀 전체가 혜택받음",
    name: "윤재민",
    role: "풀스택 교육과정 동기",
    accent: "ai",
  },
  {
    quote: "포기를 모르는 사람. 배포 장애 새벽 3시에도 끝까지 붙잡고 해결함",
    name: "송하은",
    role: "공동 개발자",
    accent: "amber",
  },
  {
    quote: "공장 자동화 경험이 있어서 시스템 설계할 때 실무 관점이 정확함",
    name: "임태현",
    role: "KCC 공정 엔지니어",
    accent: "chem",
  },
  {
    quote: "코드 퀄리티에 진심인 사람. PR 올리면 리팩토링 제안까지 같이 옴",
    name: "강예진",
    role: "기술 스터디 동료",
    accent: "code",
  },
  {
    quote: "모르면 모른다고 솔직하게 말하고 다음날 해결책 들고 옴",
    name: "오승민",
    role: "풀스택 교육과정 동기",
    accent: "ai",
  },
  {
    quote: "기술 발표를 시키면 비개발자도 고개를 끄덕이게 만드는 능력이 있음",
    name: "신유진",
    role: "공동 개발자",
    accent: "amber",
  },
  {
    quote: "LangChain 새 버전 나오면 항상 먼저 테스트하고 공유해줌. AI 트렌드 센서 같은 사람",
    name: "배성호",
    role: "AI 스터디 동료",
    accent: "chem",
  },
  {
    quote: "같이 하면 프로젝트 완성도가 확 올라감. 디테일을 놓치지 않음",
    name: "조은서",
    role: "공동 개발자",
    accent: "code",
  },
];

const accentMap: Record<
  string,
  {
    border: string;
    hoverBorder: string;
    quote: string;
    nameBg: string;
    glow: string;
    line: string;
  }
> = {
  chem: {
    border: "border-chem/10",
    hoverBorder: "group-hover:border-chem/30",
    quote: "text-chem/40",
    nameBg: "bg-chem/10 text-chem",
    glow: "group-hover:shadow-chem/8",
    line: "via-chem/40",
  },
  code: {
    border: "border-code/10",
    hoverBorder: "group-hover:border-code/30",
    quote: "text-code/40",
    nameBg: "bg-code/10 text-code",
    glow: "group-hover:shadow-code/8",
    line: "via-code/40",
  },
  ai: {
    border: "border-ai/10",
    hoverBorder: "group-hover:border-ai/30",
    quote: "text-ai/40",
    nameBg: "bg-ai/10 text-ai",
    glow: "group-hover:shadow-ai/8",
    line: "via-ai/40",
  },
  amber: {
    border: "border-amber/10",
    hoverBorder: "group-hover:border-amber/30",
    quote: "text-amber/40",
    nameBg: "bg-amber/10 text-amber",
    glow: "group-hover:shadow-amber/8",
    line: "via-amber/40",
  },
};

function ReviewCard({ review }: { review: Review }) {
  const accent = accentMap[review.accent];

  return (
    <div
      className={`group relative mx-2 flex w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-xl border ${accent.border} ${accent.hoverBorder} bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-card/80 hover:shadow-xl ${accent.glow} md:w-[340px]`}
    >
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div>
        <span
          className={`font-playfair text-3xl leading-none ${accent.quote}`}
        >
          &ldquo;
        </span>
        <p className="mt-1.5 text-[13px] leading-relaxed text-gray-300">
          {review.quote}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2.5">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${accent.nameBg}`}
        >
          {review.name.charAt(0)}
        </span>
        <div>
          <p className="text-xs font-medium text-white">{review.name}</p>
          <p className="text-[10px] text-gray-500">{review.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  speed = 60,
}: {
  items: Review[];
  direction: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items];
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const initializedRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || isPausedRef.current || !containerRef.current)
      return;

    const halfWidth = containerRef.current.scrollWidth / 2;

    if (!initializedRef.current) {
      if (direction === "right") x.set(-halfWidth);
      initializedRef.current = true;
      return;
    }

    const moveBy = (speed * delta) / 1000;

    if (direction === "left") {
      let newX = x.get() - moveBy;
      if (Math.abs(newX) >= halfWidth) newX += halfWidth;
      x.set(newX);
    } else {
      let newX = x.get() + moveBy;
      if (newX >= 0) newX -= halfWidth;
      x.set(newX);
    }
  });

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-dark to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-dark to-transparent md:w-28" />

      <motion.div
        ref={containerRef}
        style={{ x }}
        className="flex w-max py-1"
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </motion.div>
    </div>
  );
}

export function PeerReviews() {
  const firstRow = reviews.slice(0, 7);
  const secondRow = reviews.slice(7);

  return (
    <section aria-label="동료 추천" className="relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-glow-chem opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-14">
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-chem">
              Peer Reviews
            </p>
            <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
              동료들의 한마디
            </h2>
            <p className="mt-4 text-sm text-gray-500">
              함께 일하고 성장한 동료들의 이야기
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Marquee rows — full bleed */}
      <ScrollReveal>
        <div className="space-y-4">
          <MarqueeRow items={firstRow} direction="left" speed={55} />
          <MarqueeRow items={secondRow} direction="right" speed={45} />
        </div>
      </ScrollReveal>

      {/* Decorative large quote */}
      <div className="pointer-events-none absolute right-8 top-16 select-none font-playfair text-[200px] font-bold leading-none text-white/[0.02] md:right-16 md:text-[300px]">
        &rdquo;
      </div>
    </section>
  );
}
