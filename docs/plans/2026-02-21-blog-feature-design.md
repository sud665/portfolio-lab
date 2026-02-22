# Blog Feature Design

## Overview

포트폴리오 사이트에 기술 블로그 `/blog` 추가. 비전공 부트캠프 출신으로서 실전 프로젝트에서 겪은 문제를 CS 개념으로 풀어낸 경험을 공유하는 블로그.

**컨셉:** "실전 문제 → CS 개념 발견 → 해결" 스토리텔링

## 기술 스택

- 기존 MD + gray-matter 패턴 확장
- remark + remark-html (설치됨) → Markdown → HTML 변환
- rehype-highlight (추가 설치) → 코드 하이라이팅
- 색상 테마: code 파랑 계열 (`--color-code: #0496ff`)

## 데이터 구조

### Frontmatter (`content/blog/*.md`)

```yaml
---
id: "postgresql-index-strategy"
title: "멀티테넌시에서 쿼리 속도를 15배 올린 인덱스 전략"
subtitle: "PostgreSQL 인덱스 설계와 실행계획 분석"
date: "2026-02-20"
category: "DB"
tags: ["PostgreSQL", "인덱스", "성능최적화", "멀티테넌시"]
summary: "테넌트별 조회가 3초에서 0.2초로 줄어든 과정을 공유합니다."
---
```

### TypeScript 타입

```typescript
interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  content: string; // remark으로 렌더링된 HTML
}
```

### 카테고리

frontmatter `category` 필드로 자유 지정. 고정 목록 없이 글에서 자동 수집.

## 페이지 구조

### `/blog` 목록 페이지

- 히어로: "Blog" + "실전에서 배운 CS 개념들"
- 카테고리 필터 버튼 (All, DB, Network, OS 등 — 글에서 자동 수집)
- 2열 카드 그리드 (모바일 1열)
- 카드: 제목, 요약, 카테고리 뱃지, 태그, 날짜
- 정렬: 최신 글 먼저

### `/blog/[slug]` 상세 페이지

- 뒤로가기 링크
- 헤더: 카테고리 뱃지, 제목, 부제, 날짜, 태그
- 본문: remark + rehype-highlight로 렌더링된 HTML
- dangerouslySetInnerHTML 사용 (본인만 작성하므로 안전)

## 파일 구조

```
app/blog/
├── page.tsx                # 목록 (서버 컴포넌트)
└── [slug]/
    └── page.tsx            # 상세 (서버 컴포넌트)

components/blog/
├── BlogHero.tsx            # 히어로 + 필터
├── BlogCard.tsx            # 개별 카드
├── BlogGrid.tsx            # 카드 그리드 + 필터 로직 (클라이언트)
└── BlogDetail.tsx          # 상세 본문

content/blog/
├── _template.md            # 작성 가이드
└── *.md                    # 블로그 글
```

## Markdown 렌더링

```
MD → gray-matter → remark → remark-html → rehype-highlight → HTML string
```

- `lib/content.ts`에 `getBlogPosts()`, `getBlogPostBySlug()` 추가
- 렌더링된 HTML은 BlogDetail에서 출력
- globals.css에 `.blog-content` 타이포그래피 스타일 + highlight.js 테마 CSS 추가

## 네비게이션 업데이트

- Navbar `routes` 배열에 `{ href: "/blog", label: "Blog" }` 추가
- Footer 링크에 `/blog` 추가
