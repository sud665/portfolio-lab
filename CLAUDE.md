# CLAUDE.md — 포트폴리오 프로젝트 컨벤션

> Claude Code가 이 프로젝트에서 코드를 작성할 때 반드시 따라야 하는 규칙입니다.

---

## 프로젝트 스택 & 버전

| 패키지 | 버전 | 비고 |
|--------|------|------|
| **Next.js** | 16.1.6 | App Router, Turbopack 기본 번들러 |
| **React** | 19.2.3 | View Transitions, useEffectEvent 등 |
| **React DOM** | 19.2.3 | |
| **TypeScript** | ^5 | strict mode |
| **Tailwind CSS** | ^4 | ★ CSS-first 설정 (tailwind.config.js 없음) |
| **@tailwindcss/postcss** | ^4 | PostCSS 플러그인 |
| **Framer Motion** | latest | 애니메이션 |
| **lucide-react** | latest | 아이콘 |
| **gray-matter** | latest | MD frontmatter 파싱 |

---

## ⚠️ Next.js 16 주의사항

### Async Request APIs (필수)

Next.js 16에서 동기 접근이 완전 제거됨. params, searchParams는 **반드시 await**.

```tsx
// ✅ Next.js 16 — 반드시 async + await
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  return <h1>{slug}</h1>;
}

// ❌ 금지 — Next.js 16에서 동작하지 않음
export default function Page({ params }: { params: { slug: string } }) {
  return <h1>{params.slug}</h1>; // ❌ 동기 접근 불가
}
```

### 타입 헬퍼 사용

```tsx
// Next.js 16 글로벌 타입 헬퍼 활용
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params;
  const query = await props.searchParams;
  return <h1>{slug}</h1>;
}
```

### Turbopack (기본 번들러)

- Next.js 16부터 Turbopack이 기본
- `next dev`는 자동으로 Turbopack 사용
- 파일 시스템 캐싱 stable (16.1)

### Cache Components (선택)

```tsx
// next.config.ts에서 opt-in
// 현재 프로젝트에서는 사용하지 않음 — 정적 사이트이므로 불필요
```

### Middleware → proxy.ts

- Next.js 16에서 Middleware가 proxy.ts로 대체됨
- 이 프로젝트에서는 미들웨어/프록시 사용하지 않음

---

## ⚠️ Tailwind CSS v4 주의사항

### tailwind.config.js 없음

Tailwind v4는 **CSS-first 설정**. JavaScript 설정 파일이 없음.
모든 커스터마이징은 `globals.css`의 `@theme` 디렉티브에서 수행.

### globals.css 설정

```css
@import "tailwindcss";

/* ★ 커스텀 테마 — @theme 디렉티브 사용 */
@theme {
  /* 커스텀 색상 */
  --color-chem: #00e5a0;
  --color-chem-light: #00b894;
  --color-code: #6c5ce7;
  --color-code-light: #a29bfe;
  --color-ai: #ff6b6b;
  --color-ai-light: #ffa07a;
  --color-dark: #0a0a0f;
  --color-card: #16161f;
  --color-card-border: #222235;

  /* 커스텀 폰트 */
  --font-outfit: "Outfit", sans-serif;
  --font-playfair: "Playfair Display", serif;
  --font-mono: "JetBrains Mono", monospace;
}

/* 다크모드 기본 변수 */
:root {
  --background: #0a0a0f;
  --foreground: #f0f0f5;
  --muted: #8888a0;
}

/* 커스텀 스크롤바 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-dark);
}
::-webkit-scrollbar-thumb {
  background: var(--color-card-border);
  border-radius: 3px;
}

html {
  scroll-behavior: smooth;
}
```

### Tailwind v4 사용법

```tsx
// 커스텀 색상 사용 (v4: --color-* → 자동으로 유틸리티 생성)
className="text-chem"           // #00e5a0
className="bg-code"             // #6c5ce7
className="border-ai"           // #ff6b6b
className="bg-dark"             // #0a0a0f
className="bg-card"             // #16161f
className="border-card-border"  // #222235

// 투명도 (v4에서도 동일)
className="bg-chem/10"          // 10% 투명도
className="border-code/30"      // 30% 투명도

// 커스텀 폰트
className="font-outfit"         // Outfit
className="font-playfair"       // Playfair Display
className="font-mono"           // JetBrains Mono

// CSS 변수 직접 참조 (v4: 괄호 문법)
className="bg-(--color-chem)"   // v4 변수 참조 문법 (필요시)
```

### Tailwind v4에서 변경된 것

```tsx
// ❌ v3 문법 (사용 금지)
// tailwind.config.js → 존재하지 않음
// @tailwind base/components/utilities → @import "tailwindcss"로 대체
// theme.extend → @theme 디렉티브로 대체

// ❌ v3 임의값 CSS 변수 문법
className="bg-[var(--color)]"   // ❌ v3 문법

// ✅ v4 CSS 변수 문법 (괄호)
className="bg-(--color)"        // ✅ v4 문법
```

### 스페이싱 (v4 동적 생성)

```tsx
// v4에서는 모든 스페이싱 값이 동적 생성 (0.25rem 기반)
// mt-21 = 5.25rem 같은 값도 별도 설정 없이 사용 가능
className="mt-18"   // ✅ v4에서 자동 생성
className="p-13"    // ✅ 설정 없이 사용 가능
```

---

## 폴더 구조

```
portfolio/
│
├── app/                          # ★ 라우트 (페이지만, 로직 최소화)
│   ├── layout.tsx                #   루트 레이아웃 (서버 컴포넌트)
│   ├── page.tsx                  #   / 허브
│   ├── dev/page.tsx              #   /dev 개발자용
│   ├── hr/page.tsx               #   /hr 인사팀용
│   ├── hire/page.tsx             #   /hire 알바용
│   └── api/                      #   API Routes
│       └── contact/route.ts
│
├── components/                   # ★ UI 컴포넌트 (표시만, 로직 없음)
│   ├── common/                   #   공통 UI
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SectionHeader.tsx
│   ├── home/                     #   / 전용 UI
│   │   ├── RouteCards.tsx
│   │   ├── HeroTransition.tsx
│   │   ├── PhaseScene.tsx
│   │   └── ParticleBackground.tsx
│   ├── dev/                      #   /dev 전용 UI
│   │   ├── TerminalHero.tsx
│   │   ├── TechStack.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ArchitectureDiagram.tsx
│   │   └── GitHubGrid.tsx
│   ├── hr/                       #   /hr 전용 UI
│   │   ├── StoryHero.tsx
│   │   ├── CareerTimeline.tsx
│   │   ├── ImpactCards.tsx
│   │   ├── Strengths.tsx
│   │   └── HRDebate.tsx
│   ├── hire/                     #   /hire 전용 UI
│   │   ├── HireHero.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── ProcessFlow.tsx
│   │   ├── PortfolioGallery.tsx
│   │   ├── TrustSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/                       #   범용 재사용 UI 원자
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Tag.tsx
│       └── GlowBorder.tsx
│
├── hooks/                        # ★ 커스텀 훅 (로직만, UI 없음)
│   ├── useScrollProgress.ts
│   ├── useScrollDirection.ts
│   ├── useMediaQuery.ts
│   ├── useTypingAnimation.ts
│   ├── useCountUp.ts
│   ├── useIntersection.ts
│   └── useReducedMotion.ts
│
├── lib/                          # ★ 유틸리티 (순수 함수, React 금지)
│   ├── types.ts                  #   모든 TypeScript 타입
│   ├── content.ts                #   MD 파싱 함수
│   ├── constants.ts              #   상수값
│   ├── utils.ts                  #   범용 헬퍼 (cn 등)
│   └── validations.ts            #   폼 검증 (zod)
│
├── config/                       # ★ 전역 설정 (런타임 불변)
│   ├── site.ts                   #   메타데이터
│   ├── navigation.ts             #   네비게이션 링크
│   └── theme.ts                  #   색상/폰트 토큰
│
├── content/                      # ★ MD 콘텐츠 데이터
│   ├── profile.md
│   ├── projects/*.md
│   ├── career/*.md
│   └── hire/services.md
│
├── styles/
│   └── globals.css               # ★ @import "tailwindcss" + @theme
│
└── public/
    ├── images/
    └── files/
```

---

## 핵심 분리 원칙

### 1. UI 컴포넌트 (`components/`) — 표시만

```tsx
// ✅ props 받아서 표시만
export function ProjectCard({ project, variant }: ProjectCardProps) {
  return (
    <article className="rounded-2xl bg-card border border-card-border p-8">
      <h3 className="font-playfair text-xl font-bold">{project.title}</h3>
    </article>
  );
}

// ❌ 데이터 fetch 금지
export function ProjectCard() {
  const [data, setData] = useState([]); // ❌
}
```

### 2. 커스텀 훅 (`hooks/`) — 로직만

```tsx
// ✅ 값만 반환
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => { /* ... */ }, [ref]);
  return progress;
}

// ❌ JSX 반환 금지
```

### 3. 유틸리티 (`lib/`) — 순수 함수만

```tsx
// ✅ 순수 함수
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// ❌ React import 금지
import { useState } from 'react'; // ❌
```

### 4. 페이지 (`app/`) — 조합만

```tsx
// ✅ 서버 컴포넌트에서 데이터 → UI 전달
import { getProjects } from '@/lib/content';
import { ProjectCard } from '@/components/dev/ProjectCard';

export default function DevPage() {
  const projects = getProjects();
  return (
    <main>
      {projects.map(p => <ProjectCard key={p.id} project={p} />)}
    </main>
  );
}

// ❌ 50줄+ JSX / 직접 스타일 금지
```

---

## import 순서

```tsx
// 1. React / Next.js
import { useState } from 'react';
import Link from 'next/link';

// 2. 외부 라이브러리
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';

// 3. lib
import { type Project } from '@/lib/types';
import { cn } from '@/lib/utils';

// 4. config
import { navLinks } from '@/config/navigation';

// 5. hooks
import { useScrollProgress } from '@/hooks/useScrollProgress';

// 6. components
import { Badge } from '@/components/ui/Badge';
```

---

## 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase.tsx | `ProjectCard.tsx` |
| 훅 파일 | camelCase.ts | `useScrollProgress.ts` |
| 유틸/설정 | camelCase.ts | `content.ts` |
| 타입 | PascalCase | `Project` |
| 핸들러 | handle 접두사 | `handleClick` |
| boolean | is/has 접두사 | `isOpen` |

---

## 절대 금지

1. **`any` 타입** → 구체적 타입 또는 `unknown`
2. **`console.log` 남기기** → 디버깅 후 삭제
3. **하드코딩 색상** → Tailwind 유틸리티 또는 @theme
4. **컴포넌트에서 fs/path** → lib/content.ts 통해서만
5. **페이지에 50줄+ JSX** → 컴포넌트 분리
6. **한 파일에 컴포넌트 2개+** → 1파일 = 1export
7. **hooks/에서 JSX** → 값만 반환
8. **lib/에서 React** → 순수 함수만
9. **tailwind.config.js** → ❌ v4는 @theme 사용
10. **`<img>` 태그** → `next/image`만
11. **인라인 style={{}}** → Tailwind만
12. **CSS 모듈 / styled-components** → Tailwind만
13. **params 동기 접근** → `await props.params`
14. **@tailwind 디렉티브** → `@import "tailwindcss"`
15. **`bg-[var(--x)]`** → v4: `bg-(--x)`

---

## Git 커밋

```
feat: 새 기능       fix: 버그 수정
style: UI 변경      refactor: 구조 변경
content: MD 수정    chore: 설정/의존성
```