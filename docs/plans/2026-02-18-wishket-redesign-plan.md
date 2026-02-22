# Wishket 페이지 디자인 리뉴얼 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 기존 `/wishket` 페이지를 Portfolio-First, Clean Minimal Light 디자인으로 리뉴얼하여 위시켓 수주 경쟁력 강화

**Architecture:** 기존 7개 컴포넌트를 제자리에서 수정한다. 새 파일 생성 없음. 섹션 순서를 재배치(Portfolio를 2번째로)하고, 모든 컴포넌트에 그림자/여백/타이포그래피를 개선한다. 라이트 테마 CSS 변수는 기존 `wishket-light` 클래스 그대로 활용.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion (ScrollReveal), lucide-react

**Design Doc:** `docs/plans/2026-02-18-wishket-redesign-design.md`

---

### Task 1: WishketHero 리뉴얼

**Files:**
- Modify: `components/wishket/WishketHero.tsx`

**Step 1: WishketHero 컴포넌트 수정**

프로필 사진 제거, 여백 확대(py-20→py-28), 지표 카드에 배경 + 그림자 추가, CTA 버튼 크기 확대.

```tsx
import { ScrollReveal } from "@/components/common/ScrollReveal";

const stats = [
  { value: "11건", label: "프로젝트 완료" },
  { value: "2~3주", label: "평균 작업 기간" },
  { value: "1인", label: "기획~배포 완결" },
];

export function WishketHero() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-28 pt-36 text-center">
      <ScrollReveal>
        <p className="mb-6 font-mono text-sm uppercase tracking-widest text-chem">
          Web Development Partner
        </p>
        <h1 className="font-playfair text-5xl font-bold leading-tight text-foreground md:text-6xl">
          기획부터 배포까지,
          <br />
          혼자 다 합니다.
        </h1>
        <p className="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-muted">
          현장 7년 + 개발 4년. 소통부터 운영까지 한 사람이 책임집니다.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-14 grid grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-card p-6 shadow-sm"
            >
              <p className="text-3xl font-bold text-chem">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <a
          href="#contact"
          className="mt-12 inline-block rounded-full bg-chem px-12 py-4 text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110"
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
Expected: 빌드 성공

---

### Task 2: CompactPortfolio 리뉴얼 (핵심)

**Files:**
- Modify: `components/wishket/CompactPortfolio.tsx`

**Step 1: CompactPortfolio 컴포넌트 수정**

3열→2열 대형 카드, 기술스택 태그 노출, 그림자 추가, 여백 확대.

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
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-3 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          제작 사례
        </h2>
        <p className="mb-14 text-center text-muted">
          다양한 산업의 클라이언트와 함께 만든 웹사이트들입니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {portfolio.map((item, i) => (
          <ScrollReveal key={item.id} delay={i * 0.05}>
            <div
              onClick={() => setSelectedId(item.id)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getThumbnailPath(item.id)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs text-muted">
                  {item.category} · {item.client} · {item.year}
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.techStack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-chem/8 px-2 py-0.5 text-xs text-chem"
                    >
                      {tech}
                    </span>
                  ))}
                  {item.techStack.length > 4 && (
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-muted">
                      +{item.techStack.length - 4}
                    </span>
                  )}
                </div>
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
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-card-border bg-white shadow-2xl sm:inset-8 md:inset-12 lg:inset-x-[15%] lg:inset-y-8"
            >
              <div className="flex items-center justify-between border-b border-card-border px-6 py-4">
                <h3 className="font-playfair text-xl font-bold text-foreground">
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray-100 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {selectedItem.client}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {selectedItem.year}
                  </span>
                </div>
                <p className="mb-6 leading-relaxed text-muted">
                  {selectedItem.description}
                </p>
                <div className="mb-6">
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
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
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedItem.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-muted"
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
                    className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 font-semibold text-white transition-transform hover:scale-105"
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

**Step 2: 빌드 확인**

Run: `cd /Users/max/Desktop/max/portfolio-lab && npx next build 2>&1 | tail -20`
Expected: 빌드 성공

---

### Task 3: WhyMe 스타일 개선

**Files:**
- Modify: `components/wishket/WhyMe.tsx`

**Step 1: WhyMe 컴포넌트 수정**

아이콘 영역에 배경색 추가, 카드에 그림자 추가, 여백 확대.

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
  chem: "bg-chem/8 text-chem",
  code: "bg-code/8 text-code",
  ai: "bg-ai/8 text-ai",
};

export function WhyMe() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-14 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          왜 저를 선택해야 할까요?
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {strengths.map((s, i) => (
          <ScrollReveal key={s.title} delay={i * 0.1}>
            <div className="h-full rounded-2xl border border-card-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentStyles[s.accent]}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
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

### Task 4: PricingTable — 이모지→아이콘 + 그림자

**Files:**
- Modify: `components/wishket/PricingTable.tsx`

**Step 1: PricingTable 컴포넌트 수정**

이모지를 lucide-react 아이콘으로 교체, 카드에 그림자 추가, 여백 확대.

```tsx
import {
  Building2,
  Smartphone,
  ShoppingCart,
  LayoutDashboard,
  Bot,
  Wrench,
} from "lucide-react";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const pricing = [
  { service: "회사소개 홈페이지", price: "200~400만원", duration: "2~3주", icon: Building2 },
  { service: "랜딩페이지", price: "100~250만원", duration: "1~2주", icon: Smartphone },
  { service: "쇼핑몰", price: "400~800만원", duration: "4~6주", icon: ShoppingCart },
  { service: "관리자 페이지", price: "300~600만원", duration: "3~5주", icon: LayoutDashboard },
  { service: "AI 챗봇 연동", price: "150~400만원", duration: "2~4주", icon: Bot },
  { service: "기존 사이트 수정", price: "50~200만원", duration: "1~2주", icon: Wrench },
];

export function PricingTable() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-28">
      <ScrollReveal>
        <h2 className="mb-3 text-center font-playfair text-3xl font-bold text-foreground md:text-4xl">
          견적 범위
        </h2>
        <p className="mb-14 text-center text-muted">
          프로젝트 규모와 요구사항에 따라 달라질 수 있습니다
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pricing.map((item, i) => (
          <ScrollReveal key={item.service} delay={i * 0.06}>
            <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chem/8 text-chem">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{item.service}</h3>
              <p className="mt-2 text-2xl font-bold text-chem">{item.price}</p>
              <p className="mt-1 text-sm text-muted">예상 기간: {item.duration}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
```

---

### Task 5: WishketProcess 여백 조정

**Files:**
- Modify: `components/wishket/WishketProcess.tsx`

**Step 1: WishketProcess 여백만 조정**

`py-20` → `py-28`, 제목 여백 확대. 나머지 구조 유지.

기존 코드에서 변경할 부분:
- `<section className="mx-auto max-w-4xl px-6 py-20">` → `py-28`
- `<h2 className="mb-12` → `mb-14`
- `text-3xl` → `text-3xl md:text-4xl`

---

### Task 6: FAQ 여백 조정

**Files:**
- Modify: `components/wishket/FAQ.tsx`

**Step 1: FAQ 여백만 조정**

`py-20` → `py-28`, 제목 크기 조정.

기존 코드에서 변경할 부분:
- `<section className="mx-auto max-w-3xl px-6 py-20">` → `py-28`
- `<h2 className="mb-12` → `mb-14`
- `text-3xl` → `text-3xl md:text-4xl`

---

### Task 7: WishketCTA 스타일 개선

**Files:**
- Modify: `components/wishket/WishketCTA.tsx`

**Step 1: WishketCTA 여백 + 그림자 추가**

연락처 카드에 그림자 추가, CTA 버튼 그림자 추가, 여백 확대.

기존 코드에서 변경할 부분:
- `<section ... className="mx-auto max-w-4xl px-6 py-20">` → `py-28`
- 연락처 카드: `rounded-xl border border-card-border bg-card p-6` → 끝에 `shadow-sm` 추가
- CTA 버튼: `rounded-full bg-chem px-12 py-4 text-lg font-medium text-white` → `font-medium` → `font-semibold`, `shadow-md hover:shadow-lg hover:brightness-110` 추가

---

### Task 8: 페이지 섹션 순서 재배치 + 빌드 검증

**Files:**
- Modify: `app/wishket/page.tsx`

**Step 1: page.tsx 섹션 순서 변경**

Portfolio를 WhyMe 앞으로 이동.

```tsx
import type { Metadata } from "next";

import { getProfile, getPortfolio } from "@/lib/content";
import { WishketHero } from "@/components/wishket/WishketHero";
import { CompactPortfolio } from "@/components/wishket/CompactPortfolio";
import { WhyMe } from "@/components/wishket/WhyMe";
import { PricingTable } from "@/components/wishket/PricingTable";
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
      <WishketHero />
      <CompactPortfolio portfolio={portfolio} />
      <WhyMe />
      <PricingTable />
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
git add components/wishket/ app/wishket/page.tsx
git commit -m "style: wishket 페이지 디자인 리뉴얼 — Portfolio-First, 그림자/여백/아이콘 개선"
```
