# STEP 08 — 반응형 + 접근성 + SEO 다듬기

> 이 단계의 목표: 전체 페이지의 반응형, 접근성, SEO, 디테일 점검 및 수정

---

## 🔨 프롬프트 (Claude Code에 입력)

```
전체 프로젝트를 점검하고 반응형, 접근성, SEO를 다듬어줘.

### 1. 반응형 점검 및 수정

모바일 (< 640px):
- Navbar: 햄버거 메뉴 동작 확인
- 허브(/): 카드 세로 배치, 스크롤 인터랙션 프로그레스바 숨김
- /dev: 터미널 폰트 축소, 스택 카드 1열, 프로젝트 카드 1열
- /hr: 타임라인 세로, 임팩트 카드 1열, HR토론 1열
- /hire: 서비스 2열 또는 1열, 프로세스 세로, 갤러리 1열
- 모든 padding/margin 적절히 축소 (px-4~6)
- 제목 폰트 clamp() 적용 확인

태블릿 (640px ~ 1024px):
- 그리드 2열로 조정
- 카드 크기 중간

데스크탑 (> 1024px):
- 최대 너비 제한 (max-w-6xl 또는 1200px)
- 풀 레이아웃

각 페이지를 320px, 375px, 768px, 1024px, 1440px 너비에서 확인하고
깨지는 부분이 있으면 수정해줘.

### 2. 접근성 (a11y)

- 시맨틱 HTML: main, section, nav, article, header, footer 태그 사용
- 모든 섹션에 aria-label 또는 aria-labelledby
- 이미지/아이콘에 alt 또는 aria-label
- 키보드 네비게이션: Tab으로 모든 인터랙티브 요소 접근 가능
- focus 스타일: outline 또는 ring 표시 (기본 브라우저 스타일 제거하지 않기)
- 색상 대비: 텍스트 vs 배경 WCAG AA 이상
- 모바일 메뉴: ESC 키로 닫기, 열린 상태에서 focus trap
- 스크롤 인터랙션: prefers-reduced-motion 미디어 쿼리 대응
  → 모션 축소 설정 시 애니메이션 건너뛰기

### 3. SEO (메타데이터)

각 페이지 app/*/page.tsx에 metadata export:

/: 
  title: "[이름] 포트폴리오 — 화학에서 코드로, 코드에서 AI로"
  description: "화학공학 7년 + 풀스택 4년 + AI Agent. 도메인 지식을 가진 풀스택 개발자 포트폴리오."

/dev:
  title: "[이름] — Developer Portfolio | Full-Stack & AI Agent"
  description: "Next.js, React, Nest.js, LangChain/LangGraph. 아키텍처와 기술 의사결정 중심 포트폴리오."

/hr:
  title: "[이름] — 경력 소개 | 화학공학 → 풀스택 → AI"
  description: "커리어 전환 스토리와 핵심 성과. 인사팀/리크루터를 위한 포트폴리오."

/hire:
  title: "웹사이트 제작 — 기획부터 배포까지 원스톱"
  description: "홈페이지, 쇼핑몰, 랜딩페이지 제작. 기획, 디자인, 개발, 배포 전 과정."

content/profile.md에서 이름 가져와서 적용.

추가:
- Open Graph 태그 (og:title, og:description, og:type)
- viewport, charset
- robots: index, follow
- 한국어 lang="ko"

### 4. 추가 디테일

- 페이지 전환: Framer Motion으로 각 페이지 진입 시 fade-in (layout.tsx 또는 template.tsx)
- 스크롤 최상단 버튼:
  - 하단 우측 고정, 스크롤 200px 이상 시 표시
  - 클릭 시 최상단 스크롤
  - 작은 원형 버튼, arrow-up 아이콘
  - components/common/ScrollToTop.tsx
- 로딩: next/font의 display: 'swap'으로 FOUT 최소화
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 08 전체 점검 테스트해줘:

1. npm run dev — 에러 없는지

2. 반응형 테스트 — 각 페이지를 아래 너비에서 확인:
   - 320px (소형 모바일)
   - 375px (iPhone)
   - 768px (태블릿)
   - 1024px (소형 데스크탑)
   - 1440px (대형 데스크탑)
   
   확인 항목:
   - 텍스트 잘림이나 overflow 없는지
   - 그리드가 적절히 변환되는지
   - 터치 타겟 충분한 크기인지 (44px 이상)
   - 가로 스크롤 발생하지 않는지

3. 접근성 테스트:
   - 키보드만으로 네비게이션: Tab, Shift+Tab, Enter
   - 모든 인터랙티브 요소에 focus 스타일 보이는지
   - 시맨틱 태그 사용 확인 (main, section, nav 등)

4. SEO 테스트:
   - 각 페이지의 <title> 태그가 다른지
   - <meta description> 있는지
   - Open Graph 태그 있는지
   - html lang="ko" 인지

5. 추가 기능:
   - 스크롤 최상단 버튼이 동작하는지
   - 페이지 전환 애니메이션이 동작하는지

6. 크로스 페이지 일관성:
   - Navbar가 모든 페이지에서 동일하게 동작하는지
   - Footer가 모든 페이지에서 보이는지
   - 각 페이지의 톤이 확실히 구분되는지:
     - /dev: 터미널/코드 다크, 보라
     - /hr: 매거진 따뜻함, amber
     - /hire: 밝고 친근, 초록

7. npx tsc --noEmit

모두 통과하면 "STEP 08 ✅ 완료"라고 알려줘.
문제 발견 시 수정 후 다시 확인.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| 320px | 깨지는 요소 없음 |
| 1440px | 적절한 max-width |
| 키보드 | Tab 네비게이션 가능 |
| SEO | 페이지별 다른 title/description |
| 톤 구분 | 3개 페이지 확실히 다른 느낌 |

→ 전부 통과하면 **STEP-09.md**로 이동
