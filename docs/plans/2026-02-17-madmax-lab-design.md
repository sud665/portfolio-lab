# MADMAX LAB Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 포트폴리오에 `/madmax` 라우트를 추가하여 "매드맥스 연구실" 허브 페이지를 만든다.

**Architecture:** 기존 포트폴리오 패턴을 그대로 따른다. 데이터는 `lib/constants.ts`에 하드코딩, 타입은 `lib/types.ts`에 추가, 컴포넌트는 `components/madmax/`에 생성, 페이지는 `app/madmax/page.tsx`에서 조합만 수행.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (@theme), Framer Motion, lucide-react

---

### Task 1: 테마 색상 추가 (globals.css)

**Files:**
- Modify: `app/globals.css:3-18` (@theme 블록에 mad 색상 추가)
- Modify: `app/globals.css:61` (bg-glow-mad 클래스 추가)

**Step 1: @theme에 네온 그린 색상 추가**

`app/globals.css`의 `@theme` 블록 끝(line 14 `--color-amber` 뒤)에 추가:

```css
  --color-mad: #39FF14;
  --color-mad-light: #7fff5c;
```

**Step 2: bg-glow-mad CSS 클래스 추가**

파일 끝(`bg-glow-chem` 클래스 뒤)에 추가:

```css
.bg-glow-mad {
  background: radial-gradient(
    circle at 50% 40%,
    oklch(from var(--color-mad) l c h / 0.05) 0%,
    transparent 70%
  );
}
```

**Step 3: 커밋**

```bash
git add app/globals.css
git commit -m "style: add mad (neon green) theme color for madmax lab"
```

---

### Task 2: LabExperiment 타입 & 데이터 추가

**Files:**
- Modify: `lib/types.ts` (LabExperiment 인터페이스 추가)
- Modify: `lib/constants.ts` (LAB_EXPERIMENTS 배열 추가)

**Step 1: lib/types.ts에 LabExperiment 인터페이스 추가**

파일 끝(ChatMessage 인터페이스 뒤)에 추가:

```typescript
// ── Lab ──

export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "live" | "building" | "idea";
  href?: string;
}
```

**Step 2: lib/constants.ts에 LAB_EXPERIMENTS 배열 추가**

기존 `techStacks` 배열 뒤에 추가:

```typescript
import type { LabExperiment } from "./types";

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "jeju-realestate",
    title: "제주도 부동산 API",
    description: "제주 부동산 실거래가 데이터를 API로 제공하는 서비스",
    icon: "Building2",
    status: "idea",
  },
  {
    id: "future-delivery",
    title: "1년 뒤 배송",
    description: "미래의 나에게 보내는 타임캡슐 택배 서비스",
    icon: "Package",
    status: "idea",
  },
  {
    id: "req-to-code",
    title: "요구사항 → 코드",
    description: "요구사항을 입력하면 와이어프레임과 보일러플레이트를 생성",
    icon: "FileCode2",
    status: "idea",
  },
  {
    id: "homepage-builder",
    title: "홈페이지 빌더",
    description: "누구나 쉽게 만드는 원페이지 홈페이지",
    icon: "Globe",
    status: "idea",
  },
  {
    id: "chrome-ext-maker",
    title: "크롬 익스텐션 메이커",
    description: "아이디어만 입력하면 크롬 확장 프로그램을 생성",
    icon: "Puzzle",
    status: "idea",
  },
];
```

**Step 3: 커밋**

```bash
git add lib/types.ts lib/constants.ts
git commit -m "feat: add LabExperiment type and initial experiments data"
```

---

### Task 3: MadmaxHero 컴포넌트 생성

**Files:**
- Create: `components/madmax/MadmaxHero.tsx`

**Step 1: MadmaxHero 컴포넌트 작성**

기존 StoryHero 패턴(fadeUp 헬퍼, 뱃지 → 타이틀 → 서브 → 구분선)을 따르되, 네온 그린 테마 적용:

```tsx
"use client";

import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function MadmaxHero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* 네온 그린 앰비언트 글로우 */}
      <div className="absolute inset-0 bg-glow-mad" />

      {/* 도트 그리드 패턴 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(57,255,20,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* 뱃지 */}
        <motion.div {...fadeUp(0)}>
          <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
            Experiment Log
          </span>
        </motion.div>

        {/* 타이틀 */}
        <motion.h1
          {...fadeUp(0.08)}
          className="mt-8 font-playfair font-bold leading-tight tracking-tight text-white"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
        >
          MADMAX{" "}
          <span className="bg-gradient-to-r from-mad to-mad-light bg-clip-text text-transparent">
            LAB
          </span>
        </motion.h1>

        {/* 서브타이틀 */}
        <motion.p
          {...fadeUp(0.16)}
          className="mt-4 text-lg font-light text-gray-400"
        >
          희안한 거 만드는 연구실
        </motion.p>

        {/* 구분선 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-10 h-px w-20 origin-center bg-gradient-to-r from-transparent via-mad/40 to-transparent"
        />
      </div>
    </section>
  );
}
```

**Step 2: 커밋**

```bash
git add components/madmax/MadmaxHero.tsx
git commit -m "feat: add MadmaxHero component with neon green theme"
```

---

### Task 4: LabGrid 컴포넌트 생성

**Files:**
- Create: `components/madmax/LabGrid.tsx`

**Step 1: LabGrid 컴포넌트 작성**

기존 프로젝트 카드 패턴(스태거드 진입, 호버 스케일, 카드 스타일)을 따른다:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Package,
  FileCode2,
  Globe,
  Puzzle,
  type LucideIcon,
} from "lucide-react";

import { type LabExperiment } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Building2,
  Package,
  FileCode2,
  Globe,
  Puzzle,
};

const statusConfig = {
  live: {
    dot: "bg-mad",
    pulse: true,
    label: "LIVE",
    labelClass: "text-mad",
  },
  building: {
    dot: "bg-amber",
    pulse: true,
    label: "BUILDING",
    labelClass: "text-amber",
  },
  idea: {
    dot: "bg-gray-600",
    pulse: false,
    label: "IDEA",
    labelClass: "text-gray-500",
  },
};

interface LabGridProps {
  experiments: LabExperiment[];
}

export function LabGrid({ experiments }: LabGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((exp, i) => {
          const Icon = iconMap[exp.icon];
          const status = statusConfig[exp.status];

          const card = (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={
                exp.status === "live" ? { scale: 1.03, y: -4 } : undefined
              }
              className={`group rounded-2xl border border-card-border bg-card p-8 transition-all duration-300 ${
                exp.status === "live"
                  ? "cursor-pointer hover:border-mad/30 hover:shadow-[0_0_24px_rgba(57,255,20,0.06)]"
                  : ""
              }`}
            >
              {/* 상태 표시 */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {status.pulse && (
                    <span
                      className={`absolute inline-flex h-full w-full animate-ping rounded-full ${status.dot} opacity-75`}
                    />
                  )}
                  <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`}
                  />
                </span>
                <span
                  className={`font-mono text-[10px] font-bold uppercase tracking-widest ${status.labelClass}`}
                >
                  {status.label}
                </span>
              </div>

              {/* 아이콘 */}
              {Icon && (
                <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-xl border border-card-border bg-dark">
                  <Icon size={22} className="text-mad/70" />
                </div>
              )}

              {/* 제목 & 설명 */}
              <h3 className="mt-4 text-lg font-bold tracking-tight text-white">
                {exp.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                {exp.description}
              </p>

              {/* CTA */}
              <div className="mt-6">
                {exp.status === "live" ? (
                  <span className="font-mono text-xs font-medium text-mad transition-colors duration-200 group-hover:text-mad-light">
                    Enter Lab →
                  </span>
                ) : (
                  <span className="font-mono text-xs text-gray-600">
                    Coming Soon
                  </span>
                )}
              </div>
            </motion.div>
          );

          if (exp.status === "live" && exp.href) {
            return (
              <Link key={exp.id} href={exp.href} className="block">
                {card}
              </Link>
            );
          }

          return card;
        })}
      </div>
    </section>
  );
}
```

**Step 2: 커밋**

```bash
git add components/madmax/LabGrid.tsx
git commit -m "feat: add LabGrid component with experiment cards"
```

---

### Task 5: /madmax 페이지 생성

**Files:**
- Create: `app/madmax/page.tsx`

**Step 1: 페이지 컴포넌트 작성**

기존 `app/dev/page.tsx` 패턴을 따른다 (메타데이터 + 서버 컴포넌트에서 데이터 → UI 전달):

```tsx
import type { Metadata } from "next";

import { LAB_EXPERIMENTS } from "@/lib/constants";

import { MadmaxHero } from "@/components/madmax/MadmaxHero";
import { LabGrid } from "@/components/madmax/LabGrid";

export const metadata: Metadata = {
  title: "MADMAX LAB — 희안한 거 만드는 연구실",
  description:
    "매드맥스 연구실. 실험적인 웹서비스 아이디어를 만들고 검증하는 공간.",
  openGraph: {
    title: "MADMAX LAB",
    description: "희안한 거 만드는 연구실",
  },
};

export default function MadmaxPage() {
  return (
    <>
      <MadmaxHero />
      <LabGrid experiments={LAB_EXPERIMENTS} />
    </>
  );
}
```

**Step 2: 커밋**

```bash
git add app/madmax/page.tsx
git commit -m "feat: add /madmax hub page"
```

---

### Task 6: Navbar에 /madmax 라우트 추가

**Files:**
- Modify: `components/common/Navbar.tsx:8-34`

**Step 1: routes 배열에 Lab 추가**

`routes` 배열(line 8-13)에 추가:

```typescript
const routes = [
  { href: "/", label: "Index" },
  { href: "/dev", label: "Developer" },
  { href: "/hr", label: "Career" },
  { href: "/hire", label: "Hire Me" },
  { href: "/madmax", label: "Lab" },
];
```

**Step 2: 악센트 매핑에 /madmax 추가**

`accentText`(line 15-20)에 추가:
```typescript
"/madmax": "text-mad",
```

`accentPill`(line 22-27)에 추가:
```typescript
"/madmax": "bg-mad/10",
```

`accentDot`(line 29-34)에 추가:
```typescript
"/madmax": "bg-mad",
```

**Step 3: 커밋**

```bash
git add components/common/Navbar.tsx
git commit -m "feat: add Lab route to navbar with mad accent"
```

---

### Task 7: 수동 검증

**Step 1: 개발 서버 실행**

```bash
npm run dev
```

**Step 2: 브라우저에서 검증**

1. `http://localhost:3000/madmax` 접속 — 히어로 + 카드 그리드 표시 확인
2. 네비게이션 바에 "Lab" 항목 표시 확인, 클릭 시 네온 그린 악센트 확인
3. 카드 호버 시 효과 확인
4. 모바일 반응형 확인 (DevTools → 모바일 뷰)
5. 다른 페이지(`/dev`, `/hr`, `/hire`) 정상 동작 확인

**Step 3: 최종 커밋 (필요시)**

검증 중 발견한 이슈 수정 후 커밋.
