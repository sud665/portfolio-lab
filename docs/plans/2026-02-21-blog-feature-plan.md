# Blog Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 포트폴리오 사이트에 MD 기반 기술 블로그(`/blog`, `/blog/[slug]`)를 추가한다.

**Architecture:** 기존 `content/*.md` → `gray-matter` → 서버 컴포넌트 패턴을 그대로 확장. `remark` + `remark-html`(설치됨)로 Markdown→HTML 변환, `rehype-highlight`(추가 설치)로 코드 하이라이팅. 블로그 목록은 카테고리 필터가 있는 카드 그리드, 상세 페이지는 렌더링된 HTML 본문.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, gray-matter, remark, remark-html, rehype-highlight, Framer Motion

---

### Task 1: 의존성 설치

**Files:**
- Modify: `package.json`

**Step 1: rehype-highlight 및 관련 패키지 설치**

```bash
npm install rehype-highlight remark-rehype rehype-stringify
```

> `remark` → `remark-rehype` → `rehype-highlight` → `rehype-stringify` 파이프라인 구성에 필요.
> 기존 `remark-html`은 rehype 플러그인을 지원하지 않으므로 `remark-rehype` + `rehype-stringify` 조합으로 대체.

**Step 2: 설치 확인**

```bash
npm ls rehype-highlight remark-rehype rehype-stringify
```

Expected: 3개 패키지 모두 표시

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add rehype-highlight, remark-rehype, rehype-stringify for blog MD rendering"
```

---

### Task 2: BlogPost 타입 추가

**Files:**
- Modify: `lib/types.ts`

**Step 1: BlogPost 인터페이스 추가**

`lib/types.ts` 파일 끝에 추가:

```typescript
// ── Blog ──

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add BlogPost interface"
```

---

### Task 3: 블로그 콘텐츠 파싱 함수 추가

**Files:**
- Modify: `lib/content.ts`

**Step 1: import 추가**

`lib/content.ts` 상단 import에 추가:

```typescript
import { unified } from "unified";         // remark 내부에 있지만 직접 파이프라인 구성용
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

import type { BlogPost } from "./types";   // 기존 import 라인에 BlogPost 추가
```

> 참고: `remark`는 이미 설치됨. `unified`는 `remark` 의존성으로 자동 설치됨.

**Step 2: renderMarkdown 헬퍼 함수 추가**

`lib/content.ts`에 내부 헬퍼 추가 (export 하지 않음):

```typescript
async function renderMarkdown(md: string): Promise<string> {
  const result = await unified()
    .use(remark().freeze().Parser)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(md);
  return String(result);
}
```

> 주의: unified 파이프라인은 async. 서버 컴포넌트에서 await 가능.
> 위 코드가 동작하지 않으면 아래 대안 사용:

```typescript
import remarkParse from "remark-parse";

async function renderMarkdown(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(md);
  return String(result);
}
```

> `remark-parse`는 `remark` 패키지의 의존성으로 이미 설치되어 있음.

**Step 3: getBlogPosts() 함수 추가**

```typescript
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const dir = path.join(contentDir, "blog");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    const posts = await Promise.all(
      files.map(async (file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data, content } = matter(raw);
        const html = await renderMarkdown(content);

        return {
          id: data.id ?? file.replace(".md", ""),
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          date: data.date ?? "",
          category: data.category ?? "",
          tags: data.tags ?? [],
          summary: data.summary ?? "",
          content: html,
        } satisfies BlogPost;
      })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}
```

**Step 4: getBlogPostBySlug() 함수 추가**

```typescript
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.id === slug) ?? null;
}
```

**Step 5: 빌드 확인**

```bash
npx tsc --noEmit
```

Expected: 에러 없음

**Step 6: Commit**

```bash
git add lib/content.ts
git commit -m "feat: add getBlogPosts and getBlogPostBySlug with MD rendering pipeline"
```

---

### Task 4: 샘플 블로그 글 작성

**Files:**
- Create: `content/blog/_template.md`
- Create: `content/blog/postgresql-index-strategy.md`

**Step 1: 템플릿 파일 생성**

`content/blog/_template.md`:

```markdown
---
id: "slug-here"
title: "제목"
subtitle: "부제목"
date: "YYYY-MM-DD"
category: "DB | Network | OS | Algorithm | Architecture | Security"
tags: ["태그1", "태그2"]
summary: "한 줄 요약"
---

## 문제 상황

어떤 프로젝트에서 어떤 문제를 만났는지.

## CS 개념

이 문제를 이해하기 위해 필요한 CS 지식.

## 해결 과정

코드와 함께 어떻게 해결했는지.

```sql
-- 코드 예시
SELECT * FROM users;
```

## 결과와 배운 점

정량적 결과와 인사이트.
```

**Step 2: 샘플 글 1개 작성**

`content/blog/postgresql-index-strategy.md`:

```markdown
---
id: "postgresql-index-strategy"
title: "멀티테넌시에서 쿼리 속도를 15배 올린 인덱스 전략"
subtitle: "PostgreSQL 복합 인덱스 설계와 실행계획 분석"
date: "2026-02-20"
category: "DB"
tags: ["PostgreSQL", "인덱스", "성능최적화", "멀티테넌시"]
summary: "테넌트별 조회가 3초에서 0.2초로 줄어든 과정을 공유합니다."
---

## 문제 상황

멀티테넌시 SaaS 플랫폼에서 테넌트별 데이터 조회가 점점 느려지고 있었다. 초기에는 데이터가 적어 문제가 없었지만, 테넌트 수가 50개를 넘어가면서 특정 쿼리가 3초 이상 걸리기 시작했다.

```sql
-- 문제가 된 쿼리
SELECT * FROM orders
WHERE tenant_id = $1
AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

## CS 개념: B-Tree 인덱스와 복합 인덱스

PostgreSQL의 기본 인덱스는 B-Tree 구조다. B-Tree는 정렬된 데이터를 효율적으로 탐색할 수 있게 해주는 자료구조로, O(log n) 시간 복잡도로 검색이 가능하다.

**복합 인덱스**는 여러 컬럼을 하나의 인덱스로 묶는 것이다. 핵심은 **컬럼 순서**가 성능에 결정적 영향을 미친다는 점이다.

## 해결 과정

먼저 `EXPLAIN ANALYZE`로 실행계획을 분석했다.

```sql
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE tenant_id = 'tenant_42'
AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;
```

Seq Scan이 발생하고 있었다. 복합 인덱스를 생성했다.

```sql
CREATE INDEX idx_orders_tenant_status_created
ON orders (tenant_id, status, created_at DESC);
```

## 결과와 배운 점

- 쿼리 시간: 3초 → 0.2초 (15배 개선)
- Seq Scan → Index Scan으로 변경
- 테넌트 100개에서도 안정적 성능 유지

인덱스 설계는 "어떤 쿼리를 자주 실행하는가"에서 출발해야 한다는 것을 배웠다.
```

**Step 3: Commit**

```bash
git add content/blog/
git commit -m "content: add blog template and sample post"
```

---

### Task 5: 블로그 카드 컴포넌트

**Files:**
- Create: `components/blog/BlogCard.tsx`

**Step 1: BlogCard 컴포넌트 생성**

`components/blog/BlogCard.tsx`:

```tsx
import Link from "next/link";

import { type BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <article className="h-full rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-code/30 hover:bg-code/[0.03]">
        {/* Category + Date */}
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-code/20 bg-code/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-code">
            {post.category}
          </span>
          <time className="font-mono text-xs text-gray-600">{post.date}</time>
        </div>

        {/* Title */}
        <h3 className="mt-4 font-playfair text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-code-light">
          {post.title}
        </h3>

        {/* Summary */}
        <p className="mt-2 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {post.summary}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-gray-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/blog/BlogCard.tsx
git commit -m "feat: add BlogCard component"
```

---

### Task 6: 블로그 그리드 컴포넌트 (카테고리 필터 포함)

**Files:**
- Create: `components/blog/BlogGrid.tsx`

**Step 1: BlogGrid 컴포넌트 생성**

`components/blog/BlogGrid.tsx` — 클라이언트 컴포넌트 (필터 상태 관리):

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { type BlogPost } from "@/lib/types";
import { BlogCard } from "@/components/blog/BlogCard";

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats.sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-20">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "border border-code/30 bg-code/10 text-code"
                : "border border-white/[0.06] text-gray-500 hover:border-white/10 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-gray-600">
          이 카테고리에 아직 글이 없습니다.
        </p>
      )}
    </section>
  );
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/blog/BlogGrid.tsx
git commit -m "feat: add BlogGrid component with category filter"
```

---

### Task 7: 블로그 히어로 컴포넌트

**Files:**
- Create: `components/blog/BlogHero.tsx`

**Step 1: BlogHero 컴포넌트 생성**

`components/blog/BlogHero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

interface BlogHeroProps {
  postCount: number;
}

export function BlogHero({ postCount }: BlogHeroProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-code/60">
          <span className="inline-block h-1 w-1 rounded-full bg-code" />
          Blog
        </span>
        <h1 className="mt-3 font-playfair text-4xl font-bold text-white md:text-5xl">
          실전에서 배운{" "}
          <span className="text-code">CS 개념들</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
          프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록.
          문제 상황, 핵심 개념, 해결 과정을 공유합니다.
        </p>
        <p className="mt-2 font-mono text-xs text-gray-600">
          {postCount} posts
        </p>
      </motion.div>
    </section>
  );
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/blog/BlogHero.tsx
git commit -m "feat: add BlogHero component"
```

---

### Task 8: 블로그 상세 컴포넌트

**Files:**
- Create: `components/blog/BlogDetail.tsx`

**Step 1: BlogDetail 컴포넌트 생성**

`components/blog/BlogDetail.tsx` — ProjectDetail 패턴을 참고:

```tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { type BlogPost } from "@/lib/types";

interface BlogDetailProps {
  post: BlogPost;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function BlogDetail({ post }: BlogDetailProps) {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      {/* Back link */}
      <motion.div {...fadeUp(0)}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-code"
        >
          <ArrowLeft size={14} />
          블로그 목록으로
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div {...fadeUp(0.1)} className="mt-8">
        <span className="rounded-full border border-code/20 bg-code/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-code">
          {post.category}
        </span>

        <h1 className="mt-4 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="mt-2 text-lg text-gray-400">{post.subtitle}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          <time className="font-mono text-sm text-gray-500">{post.date}</time>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.hr
        {...fadeUp(0.15)}
        className="mt-8 border-card-border"
      />

      {/* Content */}
      <motion.article
        {...fadeUp(0.2)}
        className="blog-content mt-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Back to list */}
      <motion.div {...fadeUp(0.3)} className="mt-16 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-code/20 px-6 py-3 text-sm font-medium text-code transition-colors hover:border-code/40 hover:bg-code/5"
        >
          <ArrowLeft size={14} />
          블로그 목록으로 돌아가기
        </Link>
      </motion.div>
    </section>
  );
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add components/blog/BlogDetail.tsx
git commit -m "feat: add BlogDetail component"
```

---

### Task 9: 블로그 본문 CSS 스타일

**Files:**
- Modify: `app/globals.css`

**Step 1: `.blog-content` 타이포그래피 스타일 추가**

`app/globals.css` 파일 끝에 추가:

```css
/* ━━ Blog content typography ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.blog-content {
  line-height: 1.8;
  color: #c4c8d4;
}

.blog-content h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-family: var(--font-playfair);
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f4fb;
}

.blog-content h3 {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-outfit);
  font-size: 1.25rem;
  font-weight: 600;
  color: #e0e4eb;
}

.blog-content p {
  margin-bottom: 1.25rem;
  font-size: 0.9375rem;
}

.blog-content strong {
  font-weight: 600;
  color: #f0f4fb;
}

.blog-content a {
  color: var(--color-code);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.blog-content a:hover {
  color: var(--color-code-light);
}

.blog-content ul,
.blog-content ol {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.blog-content ul {
  list-style-type: disc;
}

.blog-content ol {
  list-style-type: decimal;
}

.blog-content li {
  margin-bottom: 0.375rem;
  font-size: 0.9375rem;
}

.blog-content blockquote {
  margin: 1.5rem 0;
  border-left: 3px solid var(--color-code);
  padding: 0.75rem 1rem;
  background: rgba(4, 150, 255, 0.05);
  border-radius: 0 0.5rem 0.5rem 0;
  color: #a0a4b0;
}

.blog-content pre {
  margin: 1.5rem 0;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-card-border);
  background: var(--color-card) !important;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
}

.blog-content :not(pre) > code {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: rgba(4, 150, 255, 0.1);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-code-light);
}

.blog-content hr {
  margin: 2rem 0;
  border-color: var(--color-card-border);
}

.blog-content img {
  margin: 1.5rem 0;
  border-radius: 0.75rem;
  max-width: 100%;
}

/* ━━ highlight.js theme (dark, code-blue accent) ━━━━━━━━━━━ */
.hljs {
  color: #c4c8d4;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-built_in {
  color: #c792ea;
}

.hljs-string,
.hljs-attr {
  color: #c3e88d;
}

.hljs-number,
.hljs-literal {
  color: #f78c6c;
}

.hljs-comment {
  color: #546e7a;
  font-style: italic;
}

.hljs-function .hljs-title,
.hljs-title.function_ {
  color: #82aaff;
}

.hljs-variable,
.hljs-template-variable {
  color: #f07178;
}

.hljs-type,
.hljs-class .hljs-title {
  color: #ffcb6b;
}

.hljs-meta {
  color: #89ddff;
}

.hljs-punctuation {
  color: #89ddff;
}

.hljs-operator {
  color: #89ddff;
}
```

**Step 2: 개발 서버에서 시각 확인 (수동)**

```bash
npm run dev
```

브라우저에서 확인.

**Step 3: Commit**

```bash
git add app/globals.css
git commit -m "style: add blog content typography and code highlighting styles"
```

---

### Task 10: `/blog` 목록 페이지

**Files:**
- Create: `app/blog/page.tsx`

**Step 1: 목록 페이지 생성**

`app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";

import { getBlogPosts } from "@/lib/content";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — 실전에서 배운 CS 개념들",
  description:
    "프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록. DB, 네트워크, OS 등.",
  openGraph: {
    title: "Blog — 실전에서 배운 CS 개념들",
    description: "프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogHero postCount={posts.length} />
      <BlogGrid posts={posts} />
    </>
  );
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: add /blog list page"
```

---

### Task 11: `/blog/[slug]` 상세 페이지

**Files:**
- Create: `app/blog/[slug]/page.tsx`

**Step 1: 상세 페이지 생성**

`app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { BlogDetail } from "@/components/blog/BlogDetail";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "글을 찾을 수 없습니다" };

  return {
    title: `${post.title} — Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  return <BlogDetail post={post} />;
}
```

**Step 2: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 3: Commit**

```bash
git add app/blog/
git commit -m "feat: add /blog/[slug] detail page"
```

---

### Task 12: 네비게이션 업데이트

**Files:**
- Modify: `components/common/Navbar.tsx`
- Modify: `components/common/Footer.tsx`

**Step 1: Navbar에 Blog 라우트 추가**

`components/common/Navbar.tsx`의 `routes` 배열에 추가:

```typescript
const routes = [
  { href: "/", label: "Index" },
  { href: "/dev", label: "Developer" },
  { href: "/hr", label: "Career" },
  { href: "/hire", label: "Hire Me" },
  { href: "/blog", label: "Blog" },
  { href: "/madmax", label: "Lab" },
];
```

`accentText`, `accentPill`, `accentDot` 객체에 `/blog` 추가:

```typescript
// accentText에 추가
"/blog": "text-code",

// accentPill에 추가
"/blog": "bg-code/10",

// accentDot에 추가
"/blog": "bg-code",
```

**Step 2: Footer에 Blog 링크 추가**

`components/common/Footer.tsx`의 `navLinks` 배열에 추가:

```typescript
const navLinks = [
  { href: "/dev", label: "Developer" },
  { href: "/hr", label: "Career" },
  { href: "/hire", label: "Hire Me" },
  { href: "/blog", label: "Blog" },
];
```

**Step 3: 빌드 확인**

```bash
npx tsc --noEmit
```

**Step 4: Commit**

```bash
git add components/common/Navbar.tsx components/common/Footer.tsx
git commit -m "feat: add Blog to navigation"
```

---

### Task 13: 개발 서버에서 통합 테스트

**Step 1: 개발 서버 실행**

```bash
npm run dev
```

**Step 2: 확인 사항**

1. `/blog` 접속 → 히어로 + 카드 그리드 표시
2. 카테고리 필터 클릭 → 카드 필터링 작동
3. 카드 클릭 → `/blog/postgresql-index-strategy` 이동
4. 상세 페이지 → Markdown 렌더링 + 코드 하이라이팅 확인
5. 뒤로가기 버튼 → `/blog`로 복귀
6. Navbar에 Blog 링크 표시 + 활성 상태 표시
7. Footer에 Blog 링크 표시
8. 모바일 반응형 확인

**Step 3: 문제가 있으면 수정 후 커밋**

```bash
git add -A
git commit -m "fix: resolve blog integration issues"
```

---

### Task 14: 빌드 확인

**Step 1: 프로덕션 빌드 실행**

```bash
npm run build
```

Expected: 빌드 성공, `/blog`와 `/blog/[slug]` 정적 생성

**Step 2: 문제가 있으면 수정 후 커밋**

```bash
git add -A
git commit -m "fix: resolve blog build issues"
```
