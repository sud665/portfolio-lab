# Wishket 전용 페이지 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 위시켓 프로젝트 지원 시 포트폴리오 링크로 첨부할 `/wishket` 전용 페이지 구현

**Architecture:** 기존 포트폴리오 사이트의 다크 테마 + Tailwind v4 + ScrollReveal 패턴을 유지하면서, 정보 밀도와 신뢰감 중심의 심플한 페이지를 구성한다. 기존 `getProfile()`, `getPortfolio()` 데이터를 재활용하고, 견적/FAQ/강점 데이터는 컴포넌트 내 상수로 정의한다.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion (ScrollReveal만), lucide-react

**Design Doc:** `docs/plans/2026-02-18-wishket-page-design.md`

---

### Task 1: WishketHero 컴포넌트

**Files:**
- Create: `components/wishket/WishketHero.tsx`

**Step 1: WishketHero 컴포넌트 작성**

프로필 사진 + 이름 + 포지션 + 한 줄 요약 + 핵심 지표 3개 + CTA 버튼.

```tsx
import Image from "next/image";

import { type Profile } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const stats = [
  { value: "11건", label: "프로젝트 완료" },
  { value: "2~3주", label: "평균 작업 기간" },
  { value: "1인", label: "기획~배포 완결" },
];

interface WishketHeroProps {
  profile: Profile;
}

export function WishketHero({ profile }: WishketHeroProps) {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-20 pt-32 text-center">
      <ScrollReveal>
        <Image
          src="/images/profile.jpg"
          alt={profile.name}
          width={96}
          height={96}
          className="mx-auto rounded-full border-2 border-card-border"
        />
        <h1 className="mt-6 font-playfair text-4xl font-bold text-white md:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-lg text-chem">{profile.position}</p>
        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-gray-400">
          현장 7년 + 개발 4년, 기획부터 배포까지 혼자 다 합니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-12 grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-chem">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <a
          href="#contact"
          className="mt-10 inline-block rounded-full bg-chem px-10 py-3.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          견적 문의하기
        </a>
      </ScrollReveal>
    </section>
  );
}
```

**Step 2: 빌드 확인**

Run: `cd /Users/max/Desktop/max/portfolio-lab && npx next build 2>&1 | tail -20`
Expected: 빌드 성공 (아직 page.tsx에서 import하지 않으므로 에러 없음)

---

### Task 2: WhyMe 컴포넌트

**Files:**
- Create: `components/wishket/WhyMe.tsx`

**Step 1: WhyMe 컴포넌트 작성**

강점 3가지 카드. lucide-react 아이콘 사용.

```tsx
import { Factory, Code2, Bot } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const strengths = [
  {
    icon: Factory,
    title: "현장을 아는 개발자",
    description:
      "화학공학 7년 현장 경험으로 비즈니스 맥락을 이해합니다. 개발자와 소통이 어려웠던 경험이 있으시다면, 저는 다릅니다.",
    accent: "chem" as const,
  },
  {
    icon: Code2,
    title: "1인 풀스택",
    description:
      "기획, 디자인, 프론트엔드, 백엔드, 배포까지 혼자 처리합니다. 여러 명 조율할 필요 없이 한 사람과만 소통하면 됩니다.",
    accent: "code" as const,
  },
  {
    icon: Bot,
    title: "AI 연동 가능",
    description:
      "단순 웹사이트를 넘어 AI 챗봇, 업무 자동화 시스템까지 확장할 수 있습니다. 미래를 위한 투자입니다.",
    accent: "ai" as const,
  },
];

const accentStyles = {
  chem: "border-chem/20 text-chem",
  code: "border-code/20 text-code",
  ai: "border-ai/20 text-ai",
};

export function WhyMe() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          왜 저를 선택해야 할까요?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {strengths.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-card-border bg-card p-8">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accentStyles[s.accent]}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {s.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

---

### Task 3: PricingTable 컴포넌트

**Files:**
- Create: `components/wishket/PricingTable.tsx`

**Step 1: PricingTable 컴포넌트 작성**

견적 범위표. 카드 형태로 6개 서비스.

```tsx
import { ScrollReveal } from "@/components/common/ScrollReveal";

const pricing = [
  { service: "회사소개 홈페이지", price: "200~400만원", duration: "2~3주", icon: "🏢" },
  { service: "랜딩페이지", price: "100~250만원", duration: "1~2주", icon: "📱" },
  { service: "쇼핑몰", price: "400~800만원", duration: "4~6주", icon: "🛒" },
  { service: "관리자 페이지", price: "300~600만원", duration: "3~5주", icon: "📋" },
  { service: "AI 챗봇 연동", price: "150~400만원", duration: "2~4주", icon: "🤖" },
  { service: "기존 사이트 수정", price: "50~200만원", duration: "1~2주", icon: "🔧" },
];

export function PricingTable() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-4 text-center font-playfair text-3xl font-bold text-white">
          견적 범위
        </h2>
        <p className="mb-12 text-center text-sm text-gray-400">
          프로젝트 규모와 요구사항에 따라 달라질 수 있습니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.map((item, i) => (
          <ScrollReveal key={item.service} delay={i * 0.06}>
            <div className="rounded-2xl border border-card-border bg-card p-6 transition-colors hover:border-chem/30">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 font-semibold text-white">{item.service}</h3>
              <p className="mt-2 text-2xl font-bold text-chem">{item.price}</p>
              <p className="mt-1 text-sm text-gray-400">예상 기간: {item.duration}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

---

### Task 4: CompactPortfolio 컴포넌트

**Files:**
- Create: `components/wishket/CompactPortfolio.tsx`

**Step 1: CompactPortfolio 컴포넌트 작성**

3열 심플 그리드. 기존 PortfolioGallery의 모달 로직을 간소화하여 재구현.
기존 `PortfolioItem` 타입과 `getPortfolio()` 데이터 사용.

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Building2, Calendar } from "lucide-react";

import { type PortfolioItem } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

function getThumbnailPath(id: string): string {
  return `/images/portfolio/${id}.png`;
}

interface CompactPortfolioProps {
  portfolio: PortfolioItem[];
}

export function CompactPortfolio({ portfolio }: CompactPortfolioProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = portfolio.find((p) => p.id === selectedId);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-4 text-center font-playfair text-3xl font-bold text-white">
          제작 사례
        </h2>
        <p className="mb-12 text-center text-sm text-gray-400">
          다양한 산업의 클라이언트와 함께 만든 웹사이트들입니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portfolio.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.05}>
            <div
              onClick={() => setSelectedId(item.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-card-border bg-card transition-all hover:-translate-y-1 hover:border-chem/30 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getThumbnailPath(item.id)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-gray-500">{item.category} · {item.client}</p>
                <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-card-border bg-card sm:inset-8 md:inset-12 lg:inset-x-[15%] lg:inset-y-8"
            >
              <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                <h3 className="font-playfair text-xl font-bold text-white">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {selectedItem.client}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selectedItem.year}
                  </span>
                </div>
                <p className="mb-6 leading-relaxed text-gray-300">
                  {selectedItem.description}
                </p>
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-chem/10 px-3 py-1 text-sm text-chem"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedItem.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedItem.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-gray-300"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chem" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedItem.url && selectedItem.url !== "#" && (
                  <a
                    href={selectedItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-semibold text-dark transition-transform hover:scale-105"
                  >
                    사이트 방문
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
```

---

### Task 5: WishketProcess 컴포넌트

**Files:**
- Create: `components/wishket/WishketProcess.tsx`

**Step 1: WishketProcess 컴포넌트 작성**

클라이언트 관점의 5단계 프로세스. 각 단계에 "고객이 할 일 / 제가 할 일" 구분.

```tsx
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
    <section className="mx-auto max-w-4xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          이렇게 진행돼요
        </h2>
      </ScrollReveal>

      <div className="space-y-6">
        {steps.map((step, i) => (
          <ScrollReveal key={step.title} delay={i * 0.08}>
            <div className="flex gap-5 rounded-2xl border border-card-border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-chem/20 text-chem">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  <span className="mr-2 text-chem">0{i + 1}</span>
                  {step.title}
                </h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-white/5 px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      고객
                    </p>
                    <p className="mt-1 text-sm text-gray-300">{step.client}</p>
                  </div>
                  <div className="rounded-lg bg-chem/5 px-4 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-chem/60">
                      개발자
                    </p>
                    <p className="mt-1 text-sm text-gray-300">{step.dev}</p>
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
```

---

### Task 6: FAQ 컴포넌트

**Files:**
- Create: `components/wishket/FAQ.tsx`

**Step 1: FAQ 컴포넌트 작성**

아코디언 형태 FAQ 6개.

```tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const faqs = [
  {
    q: "수정은 몇 번까지 가능한가요?",
    a: "디자인 시안 단계에서 2회, 개발 완료 후 1회 수정이 기본 포함됩니다. 추가 수정은 협의 후 진행합니다.",
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
    <section className="mx-auto max-w-3xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
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
                <span className="font-medium text-white">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="border-t border-card-border px-6 py-4">
                  <p className="text-sm leading-relaxed text-gray-400">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

---

### Task 7: WishketCTA 컴포넌트

**Files:**
- Create: `components/wishket/WishketCTA.tsx`

**Step 1: WishketCTA 컴포넌트 작성**

연락처 카드 3개 + CTA 버튼.

```tsx
import { MessageCircle, Phone, Mail } from "lucide-react";

import { type Profile } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface WishketCTAProps {
  profile: Profile;
}

export function WishketCTA({ profile }: WishketCTAProps) {
  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          프로젝트를 시작해볼까요?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ScrollReveal>
          <a
            href={profile.kakao || "#"}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-colors hover:border-chem/40"
          >
            <MessageCircle className="h-7 w-7 text-chem" />
            <span className="font-semibold text-white">카카오톡</span>
            <span className="text-sm text-gray-400">가장 빠른 상담</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <a
            href={`tel:${profile.phone}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-colors hover:border-chem/40"
          >
            <Phone className="h-7 w-7 text-chem" />
            <span className="font-semibold text-white">전화</span>
            <span className="text-sm text-gray-400">{profile.phone}</span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href={`mailto:${profile.email}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-card-border bg-card p-6 text-center transition-colors hover:border-chem/40"
          >
            <Mail className="h-7 w-7 text-chem" />
            <span className="font-semibold text-white">이메일</span>
            <span className="text-sm text-gray-400">{profile.email}</span>
          </a>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={0.3}>
        <div className="mt-10 text-center">
          <a
            href={`mailto:${profile.email}`}
            className="inline-block rounded-full bg-chem px-12 py-4 text-lg font-medium text-white transition-opacity hover:opacity-90"
          >
            무료 상담받기
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
```

---

### Task 8: 페이지 조립 + 빌드 검증

**Files:**
- Create: `app/wishket/page.tsx`

**Step 1: page.tsx 작성**

서버 컴포넌트에서 데이터를 가져와 각 컴포넌트에 전달.

```tsx
import type { Metadata } from "next";

import { getProfile, getPortfolio } from "@/lib/content";
import { WishketHero } from "@/components/wishket/WishketHero";
import { WhyMe } from "@/components/wishket/WhyMe";
import { PricingTable } from "@/components/wishket/PricingTable";
import { CompactPortfolio } from "@/components/wishket/CompactPortfolio";
import { WishketProcess } from "@/components/wishket/WishketProcess";
import { FAQ } from "@/components/wishket/FAQ";
import { WishketCTA } from "@/components/wishket/WishketCTA";

export const metadata: Metadata = {
  title: "서외구 — 웹사이트 제작 파트너",
  description:
    "프로젝트 11건 완료. 기획부터 배포까지 1인 풀스택 개발. 견적 범위, 포트폴리오, 작업 프로세스를 확인하세요.",
};

export default function WishketPage() {
  const profile = getProfile();
  const portfolio = getPortfolio();

  return (
    <>
      <WishketHero profile={profile} />
      <WhyMe />
      <PricingTable />
      <CompactPortfolio portfolio={portfolio} />
      <WishketProcess />
      <FAQ />
      <WishketCTA profile={profile} />
    </>
  );
}
```

**Step 2: 빌드 검증**

Run: `cd /Users/max/Desktop/max/portfolio-lab && npx next build 2>&1 | tail -30`
Expected: 빌드 성공, `/wishket` 라우트 생성 확인

**Step 3: 커밋**

```bash
git add app/wishket/page.tsx components/wishket/
git commit -m "feat: 위시켓 전용 페이지 추가"
```

---

### Task 9: 시각적 검증 + 최종 수정

**Step 1: dev 서버에서 확인**

Run: `cd /Users/max/Desktop/max/portfolio-lab && npx next dev`
브라우저에서 `http://localhost:3000/wishket` 접속하여 확인:
- [ ] Hero 섹션: 프로필 사진, 이름, 지표 표시
- [ ] WhyMe: 3카드 정상 렌더
- [ ] PricingTable: 6개 견적 카드 표시
- [ ] CompactPortfolio: 3열 그리드 + 클릭 시 모달
- [ ] WishketProcess: 5단계 표시, 고객/개발자 구분
- [ ] FAQ: 아코디언 동작
- [ ] WishketCTA: 연락처 + CTA 버튼
- [ ] 모바일 반응형 정상

**Step 2: 발견된 문제 수정 후 커밋**
