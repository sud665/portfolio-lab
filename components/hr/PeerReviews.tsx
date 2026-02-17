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

const pairReviews: Review[] = [
  {
    quote:
      "여러 아이디어를 제공해 주시고 시도를 두려워 하지 않으시는 점이 되게 와 닿았습니다. 노력하시는 모습이 굉장히 좋았고 저 또한 페어님으로 인하여 동력 할 수 있는 힘을 얻은 것 같습니다.",
    name: "성재호",
    role: "페어 프로그래밍 동기",
    accent: "amber",
  },
  {
    quote:
      "세세한 부분을 놓치지 않고 알려주어 풀리지 않았던 문제를 풀 수 있게 해 주었습니다.",
    name: "임익환",
    role: "페어 프로그래밍 동기",
    accent: "code",
  },
  {
    quote:
      "주제에 대한 키워드와 활용법이 미리 숙지가 되어서 프로그램이 매끄럽게 진행되었어요",
    name: "임명섭",
    role: "페어 프로그래밍 동기",
    accent: "chem",
  },
  {
    quote: "문제해결을 위한 끈기와 침착한 태도가 뛰어났습니다",
    name: "김준영",
    role: "페어 프로그래밍 동기",
    accent: "ai",
  },
  {
    quote:
      "페어 진행하면서 막히는 부분에서도 계속해서 시도를 반복하면서 꾸준히 알아가려는 모습이 좋았습니다",
    name: "김현규",
    role: "페어 프로그래밍 동기",
    accent: "amber",
  },
  {
    quote:
      "제가 많이 부족한 수학적인 측면에서 많이 도움이 되었습니다. 친절하게 많이 알려주셔서 감사했습니다!",
    name: "박한우",
    role: "페어 프로그래밍 동기",
    accent: "code",
  },
  {
    quote:
      "차분하게 예외사항들을 꼼꼼히 체크하는 부분이 좋았습니다. 코딩이 익숙해지면 속도도 많이 빨라질 듯 하다.",
    name: "김수영",
    role: "페어 프로그래밍 동기",
    accent: "chem",
  },
  {
    quote:
      "문제가 생겨도 침착하게 원인을 찾아가고 결과가 도출될 때까지 차분하게 진행하는 모습이 인상적이었습니다",
    name: "조진형",
    role: "페어 프로그래밍 동기",
    accent: "ai",
  },
  {
    quote:
      "수도코드를 매우 상세하게 적는 능력이 있어 수월하게 코딩할 수 있었습니다.",
    name: "허진혁",
    role: "페어 프로그래밍 동기",
    accent: "amber",
  },
  {
    quote:
      "학습하신 내용을 이해를 잘 하고 계셔서 과제를 수월하게 잘 풀어나간 점이 좋았다",
    name: "김효중",
    role: "페어 프로그래밍 동기",
    accent: "code",
  },
  {
    quote: "문제해결에 있어 방향제시를 잘해줬습니다.",
    name: "이민호",
    role: "페어 프로그래밍 동기",
    accent: "chem",
  },
  {
    quote:
      "커뮤니케이션을 하면서 상대방을 배려한다는 느낌을 받았다",
    name: "강범규",
    role: "페어 프로그래밍 동기",
    accent: "ai",
  },
  {
    quote:
      "구글링을 통해 모르는 부분을 해결하려는 모습이 인상깊었습니다. 커뮤니케이션도 적극적이여서 문제를 수월하게 해결할 수 있었습니다.",
    name: "이희영",
    role: "페어 프로그래밍 동기",
    accent: "amber",
  },
  {
    quote:
      "재귀라는 개념 자체가 어려운데도 불구하고 열심히 스프린트 진행하시고 노력하셨어요. 성실한 태도가 꾸준하다면 원하시는 바 이루실 수 있을 거 같습니다.",
    name: "이민진",
    role: "페어 프로그래밍 동기",
    accent: "code",
  },
  {
    quote:
      "침착하게 진행하셨고, 스스로 더 찾아서 이것저것 시험해보시는게 도움이 많이 됐습니다.",
    name: "유건표",
    role: "페어 프로그래밍 동기",
    accent: "chem",
  },
  {
    quote: "신중하게 문제풀이의 문제점을 생각하는 부분이 좋았습니다",
    name: "강명우",
    role: "페어 프로그래밍 동기",
    accent: "ai",
  },
];

const projectReviews: Review[] = [
  {
    quote:
      "팀 내 분위기 메이커로 다들 피로할 때 환기시켜줄 무언가를 하나씩 보여주셔서 탄력받아 프로젝트 진행할 수 있었어요! 반응형 웹까지 완성도 있게 만들어주셔서 너무 마음에 듭니다.",
    name: "김현규",
    role: "33plan 프로젝트 팀원",
    accent: "amber",
  },
  {
    quote:
      "팀의 분위기 메이커 역할을 해주셔서 지치고 힘든 와중에도 웃으면서 프로젝트를 진행할 수 있었고, 프론트엔드 기능 구현에서 어려운 부분 같이 의견나누고 고민해주셔서 많은 도움이 되었습니다.",
    name: "정다인",
    role: "33plan 프로젝트 팀원",
    accent: "code",
  },
  {
    quote:
      "팀 분위기를 밝게 만들어주셔서 즐겁게 프로젝트를 진행할 수 있었습니다. 프론트엔드에서 기능구현을 잘해주셨고 끝까지 아쉬운 부분을 해결하려 노력하시는 모습이 인상적이었습니다.",
    name: "이현걸",
    role: "33plan 프로젝트 팀원",
    accent: "chem",
  },
  {
    quote:
      "마지막에 마지막까지 반응형 웹과 싸우시는 끈기 보고 저도 본받아야겠다 생각들었어요! First부터 Final까지 6주간 너무 고생많으셨어요. 영상 편집 너무 굳입니다!",
    name: "김현규",
    role: "Film Storage 프로젝트 팀원",
    accent: "ai",
  },
  {
    quote:
      "재미있는 아이디어를 많이 제시해주시고, 다양한 기능을 구현해주셔서 콘텐츠가 풍부한 프로젝트를 완성할 수 있었습니다. 새로운 모듈이나 라이브러리를 적극적으로 활용해주셨습니다. 외구님 덕분에 너무 유쾌하게 프로젝트를 진행할 수 있었습니다.",
    name: "정다인",
    role: "Film Storage 프로젝트 팀원",
    accent: "amber",
  },
  {
    quote:
      "새로운 기능을 빠르게 학습하시고 만들어내시는 모습을 보면서 진짜 개발자가 되기 위한 능력은 저것이구나 라는 생각을 했었습니다. 필름취향테스트, 무한스크롤 기능을 빠르게 구현하셨고 커뮤니케이션도 훌륭하셔서 회사에 가서도 매우 잘 적응하실 것 같습니다.",
    name: "이현걸",
    role: "Film Storage 프로젝트 팀원",
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
  const pairFirst = pairReviews.slice(0, 8);
  const pairSecond = pairReviews.slice(8);

  return (
    <section aria-label="동료 리뷰" className="relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-glow-chem opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-14">
            <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
              Peer Reviews
            </p>
            <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
              동료들의 한마디
            </h2>
            <p className="mt-4 text-sm text-gray-500">
              코드스테이츠에서 매 스프린트마다 함께 진행한 페어·프로젝트 팀원들의 자율 리뷰
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Pair reviews marquee */}
      <ScrollReveal>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-code" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-code/70">
              Pair Programming
            </span>
            <span className="text-[10px] text-gray-600">
              — {pairReviews.length}명의 페어
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <MarqueeRow items={pairFirst} direction="left" speed={50} />
          <MarqueeRow items={pairSecond} direction="right" speed={40} />
        </div>
      </ScrollReveal>

      {/* Project member reviews marquee */}
      <ScrollReveal>
        <div className="relative mx-auto mt-12 max-w-6xl px-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber/70">
              Project Members
            </span>
            <span className="text-[10px] text-gray-600">
              — 33plan · Film Storage 팀원
            </span>
          </div>
        </div>
        <MarqueeRow items={projectReviews} direction="left" speed={35} />
      </ScrollReveal>

      {/* Decorative large quote */}
      <div className="pointer-events-none absolute right-8 top-16 select-none font-playfair text-[200px] font-bold leading-none text-white/[0.02] md:right-16 md:text-[300px]">
        &rdquo;
      </div>
    </section>
  );
}
