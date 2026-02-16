"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface Review {
  quote: string;
  name: string;
  role: string;
  accent: "chem" | "code" | "ai" | "amber";
}

const reviews: Review[] = [
  {
    quote: "모르는 거 물어보면 다음날 이미 정리해서 공유해주는 사람",
    name: "김도윤",
    role: "부트캠프 동기",
    accent: "chem",
  },
  {
    quote: "프로젝트 팀장하면 새벽까지 코드리뷰 해주던 사람",
    name: "이서연",
    role: "프로젝트 팀원",
    accent: "code",
  },
  {
    quote: "비전공인데 우리보다 빨리 이해하고 응용까지 해버림",
    name: "박현우",
    role: "스터디 동료",
    accent: "ai",
  },
  {
    quote: "제조업 경험 때문인지 문제 접근 방식이 완전 체계적임",
    name: "정민지",
    role: "부트캠프 동기",
    accent: "amber",
  },
  {
    quote: "기획부터 배포까지 혼자 다 해내는 걸 보고 놀랐음",
    name: "최준혁",
    role: "프로젝트 팀원",
    accent: "chem",
  },
  {
    quote: "어려운 개념도 쉽게 설명해줘서 같이 공부하면 이득임",
    name: "한소율",
    role: "스터디 동료",
    accent: "code",
  },
  {
    quote: "밤새 삽질하다 해결하면 노션에 정리까지 해두는 타입",
    name: "윤재민",
    role: "부트캠프 동기",
    accent: "ai",
  },
  {
    quote: "포기를 모르는 사람. 안 되면 될 때까지 파고듦",
    name: "송하은",
    role: "프로젝트 팀원",
    accent: "amber",
  },
  {
    quote: "실무 감각이 남다름. 현실적인 솔루션을 바로 제시함",
    name: "임태현",
    role: "부트캠프 동기",
    accent: "chem",
  },
  {
    quote: "코드 퀄리티에 진심인 사람. 리팩토링을 즐김",
    name: "강예진",
    role: "스터디 동료",
    accent: "code",
  },
  {
    quote: "모르면 모른다고 솔직하게 말하고 바로 공부하는 스타일",
    name: "오승민",
    role: "부트캠프 동기",
    accent: "ai",
  },
  {
    quote: "발표할 때 기술적 내용을 비유로 잘 풀어냄",
    name: "신유진",
    role: "프로젝트 팀원",
    accent: "amber",
  },
  {
    quote: "AI 쪽 트렌드를 항상 먼저 캐치해서 알려줌",
    name: "배성호",
    role: "스터디 동료",
    accent: "chem",
  },
  {
    quote: "같이 하면 프로젝트 완성도가 확 올라감",
    name: "조은서",
    role: "프로젝트 팀원",
    accent: "code",
  },
];

const accentMap: Record<
  string,
  { border: string; quote: string; nameBg: string }
> = {
  chem: {
    border: "border-chem/15",
    quote: "text-chem/60",
    nameBg: "bg-chem/10 text-chem",
  },
  code: {
    border: "border-code/15",
    quote: "text-code/60",
    nameBg: "bg-code/10 text-code",
  },
  ai: {
    border: "border-ai/15",
    quote: "text-ai/60",
    nameBg: "bg-ai/10 text-ai",
  },
  amber: {
    border: "border-amber/15",
    quote: "text-amber/60",
    nameBg: "bg-amber/10 text-amber",
  },
};

function ReviewCard({ review }: { review: Review }) {
  const accent = accentMap[review.accent];

  return (
    <div
      className={`mx-2 flex w-[320px] shrink-0 flex-col justify-between rounded-xl border ${accent.border} bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-card/90 hover:shadow-lg md:w-[360px]`}
    >
      <div>
        <span className={`font-playfair text-2xl leading-none ${accent.quote}`}>
          &ldquo;
        </span>
        <p className="mt-1 text-sm leading-relaxed text-gray-300">
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
  speed = 35,
}: {
  items: Review[];
  direction: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items];
  const animationName =
    direction === "left" ? "marquee-left" : "marquee-right";

  return (
    <div className="group relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-dark to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-dark to-transparent md:w-24" />

      <div
        className="flex w-max motion-safe:group-hover:[animation-play-state:paused]"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export function PeerReviews() {
  const firstRow = reviews.slice(0, 7);
  const secondRow = reviews.slice(7);

  return (
    <section aria-label="동료 추천" className="relative py-24">
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
              부트캠프에서 함께 공부하고 프로젝트했던 동료들의 추천
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Marquee rows — full bleed */}
      <ScrollReveal>
        <div className="space-y-4">
          <MarqueeRow items={firstRow} direction="left" speed={40} />
          <MarqueeRow items={secondRow} direction="right" speed={35} />
        </div>
      </ScrollReveal>

      {/* Decorative large quote */}
      <div className="pointer-events-none absolute right-8 top-16 select-none font-playfair text-[200px] font-bold leading-none text-white/[0.015] md:right-16 md:text-[300px]">
        &rdquo;
      </div>
    </section>
  );
}
