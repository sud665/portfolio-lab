# 🚀 포트폴리오 Next.js 프로젝트 — Claude Code 프롬프트 가이드

> **사용법:** 각 STEP의 프롬프트를 Claude Code에 순서대로 입력하세요.
> 이전 STEP이 완료된 후 다음 STEP으로 넘어가세요.
> `[수정 필요]` 표시된 부분은 본인 정보로 바꿔주세요.

---

## 📌 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프레임워크** | Next.js 14+ (App Router) |
| **스타일링** | Tailwind CSS + Framer Motion |
| **라우팅** | `/` 허브, `/dev` 개발자용, `/hr` 인사팀용, `/hire` 알바구인용 |
| **배포** | Vercel |
| **핵심 인터랙션** | 스크롤 기반 화학→코드→AI 전환 애니메이션 |

---

## STEP 1: 프로젝트 초기 세팅

### 프롬프트

```
Next.js 포트폴리오 프로젝트를 세팅해줘.

요구사항:
- Next.js 14+ (App Router 사용)
- TypeScript
- Tailwind CSS
- Framer Motion (애니메이션)
- lucide-react (아이콘)
- next-themes (다크모드, 기본 다크)

프로젝트 구조:
```
portfolio/
├── app/
│   ├── layout.tsx          # 공통 레이아웃
│   ├── page.tsx            # 라우터 허브 (/)
│   ├── dev/
│   │   └── page.tsx        # 개발자용 (/dev)
│   ├── hr/
│   │   └── page.tsx        # 인사팀용 (/hr)
│   └── hire/
│       └── page.tsx        # 알바구인용 (/hire)
├── components/
│   ├── common/
│   │   ├── Navbar.tsx      # 공통 네비게이션
│   │   ├── Footer.tsx      # 공통 푸터
│   │   └── ScrollReveal.tsx # 스크롤 등장 애니메이션
│   ├── home/
│   │   ├── HeroTransition.tsx  # 화학→코드→AI 스크롤 인터랙션
│   │   └── RouteCards.tsx      # 3개 라우트 선택 카드
│   ├── dev/                # 개발자용 컴포넌트들
│   ├── hr/                 # 인사팀용 컴포넌트들
│   └── hire/               # 알바구인용 컴포넌트들
├── lib/
│   ├── data.ts             # 프로젝트/경력 데이터
│   └── constants.ts        # 상수 (색상, 텍스트 등)
├── public/
│   └── images/             # 이미지 에셋
└── styles/
    └── globals.css         # 글로벌 스타일
```

추가 설정:
- Tailwind에 커스텀 색상 추가:
  - chem: "#00e5a0" (화학/초록)
  - code: "#6c5ce7" (코드/보라)
  - ai: "#ff6b6b" (AI/빨강)
  - dark: "#0a0a0f" (배경)
  - card: "#16161f" (카드 배경)
- Google Fonts: "Outfit" (본문), "Playfair Display" (제목), "JetBrains Mono" (코드)
- 기본 다크 테마
- 각 페이지에 임시 텍스트만 넣어서 라우팅 확인 가능하게

먼저 프로젝트 세팅과 라우팅이 정상 작동하는지 확인해줘.
```

---

## STEP 2: 공통 컴포넌트 (Navbar + Footer + ScrollReveal)

### 프롬프트

```
공통 컴포넌트 3개를 만들어줘.

### 1. Navbar.tsx
- fixed 상단, backdrop-blur 배경
- 왼쪽: 로고 텍스트 (그라디언트: chem → code → ai 색상)
- 오른쪽: Home, Dev, HR, Hire 링크
- 현재 라우트에 해당하는 링크 하이라이트 (usePathname 사용)
- 각 페이지별로 accent 색상 다르게:
  - / → 그라디언트
  - /dev → code 보라색
  - /hr → 따뜻한 앰버색
  - /hire → chem 초록색
- 스크롤 시 패딩 줄어드는 효과
- 모바일: 햄버거 메뉴

### 2. Footer.tsx
- 심플하게 "© 2025 [이름] — Built with Next.js"
- GitHub, Email, Blog 링크 아이콘
- 배경: card 색상, 상단 border

### 3. ScrollReveal.tsx
- children을 감싸는 래퍼 컴포넌트
- Intersection Observer로 뷰포트 진입 시 fade-up 애니메이션
- Framer Motion 사용
- delay prop 지원 (stagger 효과용)
- 한 번만 트리거 (once: true)

layout.tsx에 Navbar와 Footer 적용해줘.
```

---

## STEP 3: 데이터 파일 작성

### 프롬프트

```
lib/data.ts에 포트폴리오 데이터를 TypeScript 타입과 함께 정리해줘.

### 타입 정의

```typescript
interface Project {
  id: string;
  tier: 'main' | 'sub';
  title: string;
  description: string;
  icon: string;
  highlights: string[];
  techStack: string[];
  // 개발자용 추가 정보
  architecture?: string;        // 아키텍처 설명
  decisions?: {reason: string; choice: string}[];  // 기술 의사결정
  challenges?: {problem: string; solution: string}[];
  // 인사팀용 추가 정보
  impact?: string;              // 비즈니스 임팩트 (비개발자 언어)
  role?: string;                // 담당 역할
}

interface Career {
  phase: 'chem' | 'code' | 'ai';
  title: string;
  period: string;
  description: string;
  icon: string;
}

interface Stat {
  number: string;
  label: string;
}

interface StackCategory {
  category: string;
  items: {name: string; highlight?: boolean}[];
}

interface HireService {
  icon: string;
  title: string;
  description: string;
}
```

### 데이터 내용

**projects:**

1. AI Agent 업무관리 시스템 (main)
   - LangChain/LangGraph 기반 멀티에이전트 워크플로우
   - 하이라이트: LangGraph 멀티에이전트 설계, 업무 자동분류/우선순위 추천, 자연어 업무 생성
   - 스택: LangChain, LangGraph, Next.js, Nest.js, Python
   - 아키텍처: "User → API Gateway → LangGraph (Task Agent, Priority Agent, Summary Agent)"
   - 의사결정: LangGraph 선택 이유(멀티스텝 추론), Nest.js 선택 이유(모듈화)
   - 챌린지: Agent 루프 방지(State Machine), 응답 지연(Streaming)
   - 임팩트: "AI가 업무를 자동으로 분류하고 우선순위를 추천하여 팀 업무 효율성 향상"

2. SaaS 홈페이지 스위칭 + 자동응답 (main)
   - 멀티테넌트 SaaS, 동적 홈페이지 스위칭, 자동응답 통합
   - 하이라이트: 멀티테넌트 아키텍처/동적라우팅, 커스텀 테마/콘텐츠 관리, 자동응답 챗봇 통합
   - 스택: Next.js, React, Nest.js, PostgreSQL
   - 임팩트: "하나의 플랫폼에서 여러 고객사 홈페이지를 관리하고 자동 고객응대까지 가능한 올인원 솔루션"

3. 영수증 OCR 이벤트 프로그램 (main)
   - OCR 이미지 인식 → 이벤트 자동 참여
   - 하이라이트: OCR 파싱 파이프라인, 유효성 검증/부정참여 방지, 실시간 대시보드
   - 스택: OCR API, Next.js, Node.js
   - 임팩트: "영수증 사진만 찍으면 자동으로 이벤트 참여가 완료되는 사용자 경험 구현"

4. 워케이션 시스템 (sub)
   - 원격 근무지 예약/관리 플랫폼
   - 하이라이트: 예약/일정 관리 풀스택, 기획~배포~운영 전과정
   - 스택: Next.js, Nest.js, TypeScript
   - 임팩트: "직원들이 원격 근무지를 쉽게 예약하고 관리할 수 있는 사내 플랫폼"

**careers:** 3단계 (화학공학 KCC 7년 → 풀스택 스타트업 4년 → AI Agent 현재)

**stats:** 11+ 총경력, 4 개발경력, 7 KCC, 10+ 프로젝트

**stackCategories:** Frontend(Next.js, React, TS, Tailwind, Thymeleaf), Backend(Nest.js, Node.js, Spring, MyBatis), AI/ML(LangChain, LangGraph, AI Agent, OCR - highlight), DevOps(Git, Docker, CI/CD, AWS), Domain(SaaS, Chemical Engineering, Manufacturing DX)

**hireServices:** 회사소개 홈페이지, 쇼핑몰, 랜딩페이지, 관리자페이지, 챗봇연동, 기존사이트 수정

[수정 필요] 본인의 실제 프로젝트 내용에 맞게 수정하세요.
```

---

## STEP 4: 라우터 허브 페이지 (/)

### 프롬프트

```
app/page.tsx — 라우터 허브 페이지를 만들어줘.

### 구조

**Section 1: Hero + 라우트 선택 카드**
- 상단: 이름과 한 줄 소개
  - 제목: "화학에서 코드로, 코드에서 AI로" (Playfair Display)
  - 부제: "풀스택 개발자 [이름] 포트폴리오" [수정 필요]
- 3개 선택 카드 (가로 배치, 모바일은 세로):
  1. 🖥️ FOR DEVELOPERS
     - "기술 중심 포트폴리오"
     - "아키텍처, 코드, 기술 의사결정"
     - hover: code(보라) 색상 보더 + 글로우
     - 클릭 → /dev
  2. 💼 FOR HR / RECRUITERS
     - "성장 스토리 포트폴리오"
     - "커리어 전환, 임팩트, 핵심 역량"
     - hover: amber 색상 보더 + 글로우
     - 클릭 → /hr
  3. 🌐 HIRE ME
     - "웹사이트 제작 의뢰"
     - "홈페이지, 쇼핑몰, 랜딩페이지"
     - hover: chem(초록) 색상 보더 + 글로우
     - 클릭 → /hire
- 각 카드에 Framer Motion hover 효과: scale(1.03), y(-4px), 보더 글로우

**Section 2: 스크롤 인터랙션 (화학 → 코드 → AI)**
- components/home/HeroTransition.tsx로 분리
- sticky 스크롤 (400vh 컨테이너, sticky 100vh)
- 3단계 전환:
  1. 화학 페이즈: 분자 구조 SVG (벤젠 고리 + 원자 + 전자 궤도 애니메이션)
     - 제목: "화학에서 시작된 끝없는 호기심"
     - 설명: KCC 7년 경험
     - 색상: chem(초록)
  2. 코드 페이즈: 모니터 + 코드 라인 SVG (커서 깜빡임 애니메이션)
     - 제목: "코드로 문제를 해결하는 개발자"
     - 설명: 스타트업 풀스택 경험
     - 색상: code(보라)
  3. AI 페이즈: 로봇 SVG (눈 깜빡임 + 안테나 빛 + 뉴럴네트워크 라인)
     - 제목: "AI와 함께 진화하는 미래"
     - 설명: AI Agent 시스템 구축
     - 색상: ai(빨강)
- 스크롤 진행에 따라:
  - SVG 그룹 opacity 크로스페이드 전환
  - 텍스트 내용 변경
  - 배경 radial gradient 색상 변경
  - 페이즈 라벨 배지 업데이트
- 오른쪽에 진행 인디케이터 (3개 dot + 진행 바)
- 하단에 "Scroll" 텍스트 + 화살표 (바운스 애니메이션, 스크롤 시 페이드아웃)
- useScroll + useTransform (Framer Motion) 사용

**디자인 톤:**
- 배경: dark (#0a0a0f)
- 파티클 효과: 떠다니는 작은 원들 (3가지 색상 랜덤)
- 세련되고 임팩트 있는 첫인상
- Playfair Display for titles, Outfit for body
```

---

## STEP 5: 개발자용 페이지 (/dev)

### 프롬프트

```
app/dev/page.tsx — 개발자/기술팀용 포트폴리오 페이지를 만들어줘.

### 디자인 톤
- 터미널/코드 에디터 감성
- 다크 배경, 모노스페이스 폰트 강조
- code(보라) 색상 accent

### 섹션 구조

**Section 1: Hero — 터미널 스타일**
- 터미널 창 UI (상단 트래픽 라이트 dot, 타이틀바)
- 타이핑 애니메이션으로 한 줄씩 표시:
  ```
  $ whoami
  > fullstack_developer
  $ experience --years
  > 4y_dev + 7y_chemical_engineering
  $ stack --primary
  > Next.js | React | Nest.js | AI_Agent
  $ status
  > open_to_opportunities ✓
  ```
- JetBrains Mono 폰트
- 타이핑 효과: Framer Motion으로 글자 하나씩 등장
- 커서 깜빡임 효과

**Section 2: Tech Stack (상세)**
- 카테고리별 카드 (lib/data.ts의 stackCategories 사용)
- 각 기술 태그에 hover 효과
- AI/ML 카테고리는 highlight 스타일 (ai 빨강 계열)
- 카드 등장: ScrollReveal로 stagger

**Section 3: 프로젝트 Deep Dive**
- lib/data.ts의 projects 데이터 사용
- 각 프로젝트 카드 구성:
  - 티어 배지 (MAIN / SUB)
  - 프로젝트 제목 + 아이콘
  - 설명
  - **아키텍처 다이어그램** (코드 블록 스타일로 시각화)
    - 예: User → API Gateway → LangGraph
    -            ├→ Task Agent
    -            ├→ Priority Agent
    -            └→ Summary Agent
  - **기술 의사결정** 섹션
    - "왜 LangGraph?" → "멀티스텝 추론이 필요했기 때문"
    - 이런 식의 Q&A 포맷
  - **챌린지 & 해결** 섹션
    - 문제 → 해결 카드 형태
  - 기술 스택 태그
  - [GitHub] [Demo] 버튼 (placeholder)
- main 프로젝트는 크게, sub은 컴팩트하게
- 카드 배경: card 색상, hover 시 보라 보더 글로우

**Section 4: GitHub / Code**
- GitHub 잔디 스타일 시각화 (더미 데이터로 그리드 생성)
- 또는 "코드 철학" 섹션: 클린코드, 테스트, 문서화에 대한 짧은 글
- 코드 스니펫 1-2개 (읽기 전용 코드 블록)

**Section 5: Contact**
- GitHub, Email, Blog 링크
- "함께 만들어 나갈 다음 코드" 같은 개발자 감성 CTA
- 보라 그라디언트 CTA 버튼

모든 섹션에 ScrollReveal 적용.
```

---

## STEP 6: 인사팀용 페이지 (/hr)

### 프롬프트

```
app/hr/page.tsx — 인사팀/리크루터용 포트폴리오 페이지를 만들어줘.

### 디자인 톤
- 따뜻하고 프로페셔널한 매거진 스타일
- 기술 용어 최소화, 비즈니스 임팩트 중심
- accent 색상: warm amber (#f59e0b)
- 서체: Playfair Display(제목) + Outfit(본문) 조합으로 고급스럽게

### 섹션 구조

**Section 1: Hero — 스토리텔링**
- 큰 타이틀: "현장의 문제를 아는 개발자"
- 부제: "화학공학 7년의 도메인 지식 위에 풀스택 개발 4년의 기술력을 쌓았습니다."
- [이력서 다운로드] 버튼 (PDF, placeholder 링크)
- 배경: 은은한 warm gradient

**Section 2: 커리어 타임라인**
- 비주얼 가로 타임라인 (데스크탑)
- 모바일에서는 세로 타임라인으로 전환
- 3단계:
  - ⚗️ KCC 7년 (화학공학) → chem 색상
  - 💻 스타트업 4년 (풀스택) → code 색상
  - 🤖 AI Agent (현재) → ai 색상
- 각 단계에 짧은 설명
- 단계 사이에 화살표 또는 연결선
- "왜 전환했나?" 인용구 박스:
  "현장에서 반복되는 비효율을 보며 '기술로 해결할 수 있다'는 확신이 생겼습니다."

**Section 3: 핵심 성과 — 임팩트 카드**
- 프로젝트를 비개발자 언어로 설명
- 카드 4개 (2x2 그리드):
  1. 🤖 AI 업무 자동화 시스템
     "AI가 업무를 자동으로 분류하고 우선순위를 추천"
  2. 🔄 SaaS 올인원 플랫폼
     "하나의 플랫폼에서 여러 고객사 홈페이지와 고객응대 관리"
  3. 🧾 영수증 자동 인식 이벤트
     "사진만 찍으면 자동 참여 완료되는 사용자 경험"
  4. 🏖️ 워케이션 예약 플랫폼
     "직원들의 원격 근무지 예약/관리 사내 플랫폼"
- 각 카드에 data.ts의 impact 텍스트 사용
- hover 시 amber 보더 글로우

**Section 4: 핵심 강점**
- 5개 강점 키워드 카드 (아이콘 + 제목 + 설명):
  1. 🔄 빠른 학습력 — "비전공에서 4년 만에 AI Agent까지"
  2. 🏭 도메인 지식 — "7년간 쌓은 제조업 현장 이해"
  3. 🚀 자기주도 실행력 — "스타트업에서 기획~배포 전과정"
  4. 🤖 최신 기술 적응 — "LangChain/LangGraph 실전 적용"
  5. 📋 풀사이클 개발 — "기획, 디자인, 개발, 배포, 운영"

**Section 5: HR 토론 섹션**
- 긍정 HR vs 부정 HR 평가 (이전에 논의한 내용)
- 2컬럼 레이아웃
- 긍정: 초록 배경, "이 후보자는 희소성이 높습니다..."
- 부정: 빨간 배경, "개발 경력 4년은 짧지만... 전환 스토리가 탄탄하다면 차별화..."

**Section 6: Contact**
- [이력서 PDF 다운로드] [이메일] [전화번호]
- "새로운 도전을 함께할 팀을 찾고 있습니다"
- amber 그라디언트 CTA 버튼

모든 섹션에 ScrollReveal 적용.
```

---

## STEP 7: 알바/구인용 페이지 (/hire)

### 프롬프트

```
app/hire/page.tsx — 웹사이트 제작 의뢰/알바 구인용 페이지를 만들어줘.

### 디자인 톤
- 밝고 친근한 랜딩페이지 스타일
- 비개발자 고객 대상, 기술 용어 없음
- accent: chem 초록 (#00e5a0)
- 깔끔하고 신뢰감 있는 디자인

### 섹션 구조

**Section 1: Hero**
- 큰 타이틀: "홈페이지 필요하세요?"
- 부제: "기획부터 디자인, 개발, 배포까지 원스톱으로 해결해드립니다."
- 2개 CTA 버튼:
  - [문의하기] → #contact 스크롤
  - [작업물 보기] → #portfolio 스크롤
- 배경: 밝은 다크 + chem 색상 gradient accent

**Section 2: 서비스 카테고리**
- 섹션 제목: "이런 걸 만들어드려요"
- 6개 서비스 카드 (3x2 그리드, 모바일 2x3):
  1. 🏢 회사소개 홈페이지
  2. 🛒 쇼핑몰
  3. 📱 랜딩페이지
  4. 📋 관리자 페이지 (백오피스)
  5. 🤖 챗봇 연동
  6. 🔧 기존 사이트 수정/리뉴얼
- 각 카드: 아이콘 + 제목 + 한 줄 설명
- hover: 초록 보더, scale 효과

**Section 3: 작업 프로세스**
- 섹션 제목: "이렇게 진행돼요"
- 5단계 가로 플로우 (모바일: 세로):
  ① 상담 → ② 기획 → ③ 디자인 → ④ 개발 → ⑤ 배포
- 각 단계에 아이콘 + 짧은 설명
- 단계 사이 화살표 또는 연결선
- 현재 단계 하이라이트 느낌의 애니메이션

**Section 4: 포트폴리오 갤러리** (id="portfolio")
- 섹션 제목: "이런 사이트를 만들었어요"
- 카드 그리드 (2x2 또는 슬라이더)
- 각 카드:
  - 스크린샷 placeholder (그라디언트 배경 + 텍스트로 대체)
  - 프로젝트명
  - 간단 설명 (비개발자 언어)
  - 사용 기술 (선택적)
- [수정 필요] 실제 프로젝트 스크린샷 추가

**Section 5: 신뢰 요소**
- 숫자 강조:
  - "작업 완료 10+ 건"
  - "개발 경력 4년"
  - "풀스택 (기획~배포 가능)"
- 고객 후기 placeholder 1-2개 (나중에 실제 후기로 교체)
- 별점 ⭐⭐⭐⭐⭐

**Section 6: 문의하기** (id="contact")
- 섹션 제목: "프로젝트를 시작해볼까요?"
- 3개 연락 수단 카드:
  - 💬 카카오톡 (링크 placeholder)
  - 📞 전화 (번호 placeholder) [수정 필요]
  - 📧 이메일 (주소 placeholder) [수정 필요]
- 또는 간단한 문의 폼:
  - 이름, 연락처, 원하는 서비스(셀렉트), 간단 설명(textarea)
  - [문의 보내기] 버튼
  - (실제 전송은 나중에 구현, 지금은 UI만)

모든 섹션에 ScrollReveal 적용.
```

---

## STEP 8: 반응형 + 마무리 다듬기

### 프롬프트

```
전체 프로젝트의 반응형과 디테일을 다듬어줘.

### 반응형 체크리스트
- 모바일 (< 640px):
  - 네비게이션 햄버거 메뉴
  - 허브 카드 세로 배치
  - 프로젝트 카드 1열
  - 타임라인 세로
  - 스크롤 인터랙션의 사이드 프로그레스 바 숨김
  - 적절한 패딩/마진 축소

- 태블릿 (640px ~ 1024px):
  - 2열 그리드
  - 카드 크기 조정

- 데스크탑 (> 1024px):
  - 풀 레이아웃

### 퍼포먼스 최적화
- 이미지 next/image 사용
- 스크롤 이벤트 throttle 또는 Framer Motion useScroll 사용
- 불필요한 리렌더 방지 (React.memo, useMemo)
- SVG 애니메이션은 CSS animation 우선 사용

### 접근성
- 시맨틱 HTML (section, nav, main, article)
- aria-label 적용
- 키보드 네비게이션
- 충분한 색상 대비

### SEO
- 각 페이지 metadata 설정 (title, description, og:image)
  - /: "[이름] 포트폴리오 — 화학에서 코드로, 코드에서 AI로"
  - /dev: "[이름] — 개발자 포트폴리오 | Full-Stack & AI Agent"
  - /hr: "[이름] — 경력 소개 | 화학공학 → 풀스택 → AI"
  - /hire: "웹사이트 제작 — 기획부터 배포까지 원스톱"

### 추가 디테일
- 페이지 전환 애니메이션 (Framer Motion AnimatePresence)
- 스크롤 최상단 버튼 (하단 우측 고정)
- 로딩 스켈레톤 또는 초기 로드 애니메이션

전체 페이지를 돌아보면서 깨지는 부분, 일관성 없는 스타일, 누락된 요소가 없는지 점검해줘.
```

---

## STEP 9: 배포 (Vercel)

### 프롬프트

```
Vercel 배포를 위한 설정을 해줘.

1. .gitignore 확인 (node_modules, .next, .env 등)
2. next.config.js 최적화 설정
3. vercel.json (필요시)
4. README.md 작성:
   - 프로젝트 소개
   - 기술 스택
   - 로컬 실행 방법
   - 배포 방법
   - 폴더 구조 설명

배포 명령어:
```bash
npm run build
# 빌드 에러 확인 후
# Vercel CLI 또는 GitHub 연동으로 배포
```

빌드 에러가 있으면 수정해줘.
```

---

## STEP 10 (선택): 추가 기능

### 프롬프트 모음

필요한 것만 골라서 사용하세요.

#### 10-1. 다국어 (한/영)

```
i18n 다국어 지원을 추가해줘.
- next-intl 또는 간단한 커스텀 훅으로 구현
- 한국어(기본) / English 전환
- Navbar에 언어 토글 버튼
- data.ts의 텍스트를 한/영으로 분리
```

#### 10-2. 블로그 섹션

```
/dev 페이지에 기술 블로그 섹션을 추가해줘.
- MDX 기반 블로그 글
- app/dev/blog/[slug] 라우트
- 글 목록 + 상세 페이지
- 코드 하이라이팅 (rehype-pretty-code)
```

#### 10-3. 이력서 PDF 생성

```
/hr 페이지의 "이력서 다운로드" 버튼이 실제 PDF를 생성하도록 만들어줘.
- react-pdf 또는 서버사이드 PDF 생성
- 포트폴리오 내용을 깔끔한 PDF로 변환
- A4 사이즈, 1-2페이지
```

#### 10-4. 문의 폼 백엔드

```
/hire 페이지의 문의 폼을 실제 동작하게 만들어줘.
- Next.js API Route (app/api/contact/route.ts)
- Resend 또는 Nodemailer로 이메일 발송
- 폼 검증 (zod)
- 전송 성공/실패 토스트 메시지
```

#### 10-5. 애널리틱스

```
Google Analytics 또는 Vercel Analytics를 추가해줘.
- 페이지 뷰 추적
- 각 라우트별 방문자 수 확인
- CTA 버튼 클릭 이벤트 추적
```

---

## 📎 빠른 참조: 프로젝트 핵심 정보

아래 정보를 본인에 맞게 수정한 후 STEP 3에서 사용하세요.

```
[수정 필요 목록]

이름: _______________
이메일: _______________
전화번호: _______________
GitHub: _______________
블로그/LinkedIn: _______________
카카오톡 오픈채팅: _______________

KCC 근무 기간: ___년
개발 경력: ___년
주요 프로젝트 수: ___개

각 프로젝트별 구체적 수치:
- AI Agent: 사용자 수 ___, 처리량 ___
- SaaS: 고객사 수 ___, 트래픽 ___
- OCR: 참여자 수 ___, 인식률 ___%
- 워케이션: 이용자 수 ___

이력서 PDF 파일 경로: _______________
프로젝트 스크린샷 이미지: _______________
```

---

## ⚠️ 주의사항

1. **STEP 순서를 지켜주세요.** 이전 STEP이 완료되어야 다음 STEP이 동작합니다.
2. **에러 발생 시** 에러 메시지를 Claude Code에 그대로 붙여넣으면 해결해줍니다.
3. **[수정 필요]** 표시를 반드시 본인 정보로 바꿔주세요.
4. **각 STEP 완료 후** `npm run dev`로 로컬에서 확인하세요.
5. **STEP 10은 선택사항**입니다. 핵심은 STEP 1~9입니다.
