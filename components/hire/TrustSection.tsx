"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { ScrollReveal } from "@/components/common/ScrollReveal";

function CountUp({
  target,
  suffix,
  duration = 1500,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="text-4xl font-bold text-chem">
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { target: 10, suffix: "+", label: "작업 완료 건수" },
  { target: 4, suffix: "년", label: "개발 경력" },
  { target: 100, suffix: "%", label: "기획~배포 가능" },
];

const reviews = [
  {
    stars: 5,
    text: "빠르고 정확하게 원하는 결과물을 만들어주셨습니다.",
    author: "고객 A",
  },
  {
    stars: 5,
    text: "소통이 원활하고 디자인 감각이 좋아서 만족스러운 결과를 얻었습니다.",
    author: "고객 B",
  },
];

export function TrustSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 text-center">
        {stats.map((stat) => (
          <ScrollReveal key={stat.label}>
            <div>
              <CountUp target={stat.target} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Reviews */}
      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        {reviews.map((review, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="rounded-xl border border-card-border bg-card p-6">
              <div className="mb-3 text-amber">
                {"⭐".repeat(review.stars)}
              </div>
              <p className="text-sm italic text-gray-300">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-3 text-xs text-gray-500">— {review.author}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
