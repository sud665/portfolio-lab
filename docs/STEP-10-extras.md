# STEP 10 — (선택) 추가 기능 모음

> 이 단계는 선택사항입니다. 필요한 것만 골라서 사용하세요.
> 각 기능은 독립적이라 순서 상관없이 추가 가능합니다.

---

## 10-1. 다국어 지원 (한/영)

### 프롬프트

```
포트폴리오에 한/영 다국어 전환을 추가해줘.

- 간단한 커스텀 훅 방식으로 구현 (next-intl 없이)
- lib/i18n.ts: 한국어/영어 텍스트 객체
- useLanguage() 훅: 현재 언어 상태 + 토글 함수
- Navbar에 언어 토글 버튼 (🇰🇷 / 🇺🇸)
- localStorage에 선택 저장
- content/ MD 파일은 한국어 유지 (UI 텍스트만 번역)

번역 범위:
- 섹션 제목들
- 네비게이션 텍스트
- 버튼 텍스트
- 프로젝트 설명은 MD 파일 그대로 (한국어)
```

### ✅ 체크포인트

```
10-1 다국어 테스트:
- 토글 버튼 클릭 시 UI 텍스트가 한↔영 전환되는지
- 페이지 새로고침해도 선택 언어 유지되는지
- 4개 페이지 모두 정상인지
```

---

## 10-2. 기술 블로그

### 프롬프트

```
/dev 페이지에 기술 블로그 섹션을 추가해줘.

구조:
- content/blog/ 폴더에 MD 파일로 글 작성
- app/dev/blog/page.tsx → 글 목록
- app/dev/blog/[slug]/page.tsx → 글 상세

content/blog/example-post.md 예시:
---
title: "LangGraph로 AI Agent 만들기"
date: "2025-01-15"
tags: ["AI", "LangGraph", "Agent"]
summary: "LangGraph를 사용해서 멀티에이전트 시스템을 구축한 경험"
---

본문 내용...

기능:
- 글 목록: 날짜 역순, 제목 + 날짜 + 태그 + 요약
- 글 상세: markdown → HTML 렌더링
- 코드 하이라이팅 (rehype-highlight 또는 간단한 스타일)
- /dev 페이지에 "최근 글" 3개 미리보기 섹션 추가
```

### ✅ 체크포인트

```
10-2 블로그 테스트:
- /dev/blog에 글 목록 보이는지
- 글 클릭 시 상세 페이지로 이동하는지
- MD가 HTML로 렌더링되는지
- /dev 페이지에 최근 글 미리보기가 보이는지
- content/blog/에 새 MD 추가하면 자동으로 목록에 뜨는지
```

---

## 10-3. 이력서 PDF 자동 생성

### 프롬프트

```
/hr 페이지의 "이력서 다운로드" 버튼이 실제 PDF를 생성하도록 만들어줘.

방법: API Route에서 content/ 데이터를 기반으로 PDF 생성

- app/api/resume/route.ts
- @react-pdf/renderer 또는 jspdf 사용
- content/profile.md + projects + careers 데이터 합쳐서
- A4 사이즈, 1~2페이지
- 깔끔한 레이아웃: 이름, 연락처, 요약, 경력, 프로젝트, 기술스택
- GET /api/resume → PDF 파일 응답
- 버튼 href를 /api/resume로 변경
```

### ✅ 체크포인트

```
10-3 PDF 테스트:
- /api/resume 접속 시 PDF 다운로드되는지
- PDF 내용에 프로필, 경력, 프로젝트가 있는지
- PDF 레이아웃이 깨지지 않는지
- /hr 페이지 버튼 클릭 시 다운로드되는지
```

---

## 10-4. 문의 폼 실제 발송

### 프롬프트

```
/hire 페이지 문의 폼을 실제 이메일 발송되도록 만들어줘.

- app/api/contact/route.ts
- Resend (https://resend.com) 사용 (무료 100통/일)
  - npm install resend
  - .env.local에 RESEND_API_KEY 추가
- 폼 검증: zod 스키마
  - 이름: 필수, 2자 이상
  - 연락처: 필수
  - 서비스: 필수
  - 설명: 선택
- 전송 중 로딩 상태 표시
- 성공: "문의가 접수되었습니다!" 토스트
- 실패: "전송에 실패했습니다. 다시 시도해주세요." 토스트
- 토스트 컴포넌트: 간단한 자체 구현 또는 react-hot-toast
```

### ✅ 체크포인트

```
10-4 문의 폼 테스트:
- 빈 폼 제출 시 검증 에러 표시되는지
- 정상 입력 후 제출 시 로딩 → 성공 토스트
- (RESEND_API_KEY 없으면 에러 처리 확인)
- 이메일 실제 수신 확인 (API 키 설정한 경우)
```

---

## 10-5. 애널리틱스

### 프롬프트

```
Vercel Analytics를 추가해줘.

- npm install @vercel/analytics
- app/layout.tsx에 <Analytics /> 컴포넌트 추가
- 페이지 뷰 자동 추적
- CTA 버튼 클릭 이벤트 추적:
  - "resume_download" (이력서 다운로드)
  - "contact_submit" (문의 전송)
  - "route_select" (허브에서 라우트 선택 — dev/hr/hire)
  - track() 함수 사용
```

### ✅ 체크포인트

```
10-5 애널리틱스 테스트:
- 빌드 에러 없는지
- Analytics 컴포넌트가 layout.tsx에 있는지
- Vercel 배포 후 대시보드에서 페이지 뷰 확인
```

---

## 10-6. 프로젝트 상세 페이지

### 프롬프트

```
각 프로젝트를 클릭하면 상세 페이지로 이동하도록 만들어줘.

- app/dev/project/[id]/page.tsx
- content/projects/의 해당 MD 파일 전체 내용 렌더링
- 상세 페이지 구성:
  - 히어로: 아이콘 + 제목 + 스택 태그
  - 설명 (전체)
  - 아키텍처 다이어그램 (크게)
  - 기술 의사결정 (상세)
  - 챌린지 & 해결 (상세)
  - 수치/임팩트
  - [← 프로젝트 목록] 뒤로가기 버튼
- /dev 페이지의 프로젝트 카드에 "자세히 보기" 링크 추가
```

### ✅ 체크포인트

```
10-6 상세 페이지 테스트:
- /dev/project/ai-agent 접속 시 상세 페이지 보이는지
- MD 파일의 모든 섹션이 렌더링되는지
- 존재하지 않는 ID 접속 시 404 처리되는지
- 뒤로가기 버튼 동작하는지
```

---

## ✅ 최종 체크리스트

모든 작업이 끝나면 마지막으로:

```
최종 점검 해줘:

1. npm run build — 에러 없음
2. npm run start — 4개 페이지 + 추가 기능 정상
3. 모바일/데스크탑 반응형 정상
4. content/ MD 수정 시 반영 확인
5. TypeScript 에러 없음: npx tsc --noEmit
6. 콘솔에 에러/경고 없음
7. git init + git add . + git commit

"🎉 포트폴리오 프로젝트 완성!"
```
