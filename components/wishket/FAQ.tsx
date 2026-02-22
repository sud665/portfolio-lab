"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const faqs = [
  {
    q: "수정은 몇 번까지 가능한가요?",
    a: "무한 수정입니다. 1차 기획안대로 배포한 뒤에도 만족하실 때까지 수정해드리고, 이후 운영까지 함께 도와드립니다.",
  },
  {
    q: "소스코드 인수인계 되나요?",
    a: "네, 프로젝트 완료 후 소스코드 전체를 GitHub 또는 ZIP으로 전달드립니다.",
  },
  {
    q: "유지보수는 어떻게 되나요?",
    a: "배포 후 1개월간 무상 유지보수를 제공합니다. 이후에는 월 단위 유지보수 계약이 가능합니다.",
  },
  {
    q: "디자인도 해주시나요?",
    a: "네, 기획부터 디자인까지 직접 진행합니다. 별도 디자이너 없이 한 번에 해결됩니다.",
  },
  {
    q: "호스팅/도메인은 어떻게 하나요?",
    a: "Vercel, AWS 등 최적의 호스팅을 추천드리고 세팅까지 해드립니다. 도메인 구매도 안내해드립니다.",
  },
  {
    q: "작업 기간은 얼마나 걸리나요?",
    a: "일반 홈페이지 기준 2~3주, 기능이 많은 프로젝트는 4~6주 정도 소요됩니다. 정확한 기간은 상담 시 안내드립니다.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          자주 묻는 질문
        </h2>
      </ScrollReveal>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="overflow-hidden rounded-xl border border-card-border bg-card">
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-medium text-foreground">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-card-border px-6 py-4">
                      <p className="text-sm leading-relaxed text-muted">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
