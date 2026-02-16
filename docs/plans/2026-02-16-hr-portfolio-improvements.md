# HR 포트폴리오 4대 개선 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 채용 담당자를 2-3초 안에 사로잡기 위한 포트폴리오 4대 개선

**Architecture:** 기존 MD 기반 콘텐츠 시스템을 활용하여 데이터 수정 + 컴포넌트 수정 + 신규 페이지 생성

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Framer Motion, gray-matter

---

## Task 1: StoryHero에 "역할 제안" 한 줄 추가

**Files:**
- Modify: `content/profile.md` — position 필드 추가
- Modify: `lib/types.ts:1-13` — Profile 인터페이스에 position 추가
- Modify: `lib/content.ts:42-65` — getProfile에 position 기본값 추가
- Modify: `components/hr/StoryHero.tsx:6-12,26-32,70-76` — props/렌더링 수정
- Modify: `app/hr/page.tsx:28-34` — position prop 전달

**Step 1: profile.md에 position 추가**

```md
position: "AI Agent 개발자 | 제조 도메인 DX 전문"
```

**Step 2: Profile 타입에 position 추가**

```ts
// lib/types.ts - Profile 인터페이스
position: string;
```

**Step 3: getProfile 기본값에 position 추가**

```ts
// lib/content.ts - defaults 객체
position: "",
```

**Step 4: StoryHero에 position prop 추가 및 표시**

title과 tagline 사이에 position을 눈에 띄는 배지 형태로 표시:
```tsx
{position && (
  <p className="mt-3 inline-block rounded-full border border-amber/20 bg-amber/5 px-4 py-1.5 text-sm font-medium text-amber">
    {position}
  </p>
)}
```

**Step 5: hr/page.tsx에서 position 전달**

---

## Task 2: ImpactCards에 정량 수치 추가

**Files:**
- Modify: `content/projects/ai-agent.md` — 수치 섹션 업데이트
- Modify: `content/projects/saas-platform.md` — 수치 섹션 추가
- Modify: `content/projects/ocr-event.md` — 수치 섹션 추가
- Modify: `content/projects/workation.md` — 수치 섹션 추가
- Modify: `components/hr/ImpactCards.tsx:117-128` — stats 렌더링 추가

**Step 1: 각 프로젝트 MD의 수치 섹션 업데이트**

ai-agent.md:
```md
## 수치
- 업무 분류 정확도: 92%
- 우선순위 추천 채택률: 85%
- 수동 분류 대비 처리 시간: -70%
```

saas-platform.md:
```md
## 수치
- 서비스 전환 소요 시간: 3일 → 4시간
- 데이터 마이그레이션 자동화율: 95%
- 수동 작업 절감: 월 40시간
```

ocr-event.md:
```md
## 수치
- 이미지 인식 정확도: 97%
- 검증 처리 속도: 건당 2초
- 수작업 대비 효율: 15배
```

workation.md:
```md
## 수치
- 등록 장소: 200+
- 예약 전환율: 12%
- 사용자 만족도: 4.6/5.0
```

**Step 2: ImpactCards에 stats 표시 추가**

impact 박스 아래에 stats를 가로로 나열:
```tsx
{project.stats.length > 0 && (
  <div className="mx-6 ml-7 mt-3 flex flex-wrap gap-4">
    {project.stats.map((s) => (
      <div key={s.label} className="text-center">
        <div className={`text-lg font-bold ${accent.impactText}`}>{s.value}</div>
        <div className="text-[10px] text-gray-500">{s.label}</div>
      </div>
    ))}
  </div>
)}
```

---

## Task 3: PeerReviews 실무 레퍼런스 톤 변경

**Files:**
- Modify: `components/hr/PeerReviews.tsx:20-105` — reviews 배열 수정
- Modify: `components/hr/PeerReviews.tsx:269-278` — 섹션 설명 텍스트 수정

**Step 1: reviews 데이터 수정**

14명 중 4명을 KCC 동료/실무 협업 톤으로 변경:
- "KCC 선임 연구원" → 화학 도메인 실무
- "스타트업 공동 창업자" → 개발 실무
- "프로젝트 매니저" → 협업 능력
- "기술 리드" → 기술 역량

나머지 10명도 role을 더 전문적으로 수정:
- "부트캠프 동기" → "풀스택 교육과정 동기"
- "프로젝트 팀원" → "공동 개발자"
- "스터디 동료" → "기술 스터디 동료"

**Step 2: 섹션 설명 수정**

"부트캠프에서 함께 공부하고 프로젝트했던 동료들의 추천"
→ "함께 일하고 성장한 동료들의 이야기"

---

## Task 4: 프로젝트 상세 페이지 (/dev/[slug])

**Files:**
- Modify: `lib/content.ts` — getProjectById 함수 추가
- Create: `app/dev/[slug]/page.tsx` — 상세 페이지
- Create: `components/dev/ProjectDetail.tsx` — 상세 컴포넌트
- Modify: `components/dev/MainProjectCard.tsx:7,13-14` — 링크 추가

**Step 1: lib/content.ts에 getProjectById 추가**

```ts
export function getProjectById(id: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) ?? null;
}
```

**Step 2: app/dev/[slug]/page.tsx 생성**

Next.js 16 async params 패턴 사용:
```tsx
export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = getProjectById(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
```

**Step 3: ProjectDetail 컴포넌트 생성**

- 상단: 아이콘 + 제목 + 기술 스택 배지
- 설명
- 아키텍처 (코드 블록)
- 기술 의사결정 (Q&A 형태)
- 챌린지 (문제→해결)
- 수치 (그리드)
- 임팩트 요약
- 뒤로가기 링크

**Step 4: MainProjectCard에 Link 추가**

article을 Link로 감싸기:
```tsx
import Link from "next/link";
// <article> → <Link href={`/dev/${project.id}`}>로 감싸기
```
