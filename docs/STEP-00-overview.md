# STEP 00 — 프로젝트 개요 & content 폴더 준비

> 이 파일은 전체 프로젝트의 개요입니다.
> 실제 코딩 전에 content 폴더부터 준비하세요.

---

## 📌 전체 구조

| STEP | 내용 | 예상 시간 |
|------|------|----------|
| 00 | 개요 & content 폴더 준비 (이 파일) | 30분 |
| 01 | 프로젝트 초기 세팅 + 라우팅 | 15분 |
| 02 | content 파싱 시스템 (MD → 데이터) | 15분 |
| 03 | 공통 컴포넌트 (Navbar, Footer, ScrollReveal) | 20분 |
| 04 | 라우터 허브 페이지 `/` | 30분 |
| 05 | 개발자용 페이지 `/dev` | 30분 |
| 06 | 인사팀용 페이지 `/hr` | 25분 |
| 07 | 알바구인용 페이지 `/hire` | 25분 |
| 08 | 반응형 + 접근성 + SEO | 20분 |
| 09 | 빌드 테스트 + 배포 준비 | 15분 |
| 10 | (선택) 추가 기능 모음 | 각 15분 |

---

## 📁 content 폴더 — 미리 준비할 것

프로젝트 시작 전에 아래 MD 파일들을 직접 작성하세요.
`[수정 필요]` 부분을 본인 정보로 채워넣으면 됩니다.
나중에 프로젝트 상세 내용은 추가/수정할 수 있습니다.

```
content/
├── profile.md                # 기본 프로필
├── projects/
│   ├── ai-agent.md           # AI Agent 프로젝트
│   ├── saas-platform.md      # SaaS 스위칭 프로젝트
│   ├── ocr-event.md          # OCR 이벤트 프로젝트
│   ├── workation.md          # 워케이션 프로젝트
│   └── _template.md          # 새 프로젝트 추가용 템플릿
├── career/
│   ├── 01-chemistry.md       # KCC 화학공학
│   ├── 02-developer.md       # 풀스택 개발자
│   └── 03-ai.md              # AI Agent
└── hire/
    └── services.md           # 알바용 서비스 목록
```

---

## 📝 MD 파일 작성 가이드

### content/profile.md

```markdown
---
name: "홍길동"
title: "풀스택 개발자"
email: "your@email.com"
phone: "010-0000-0000"
github: "https://github.com/yourname"
blog: ""
linkedin: ""
kakao: ""
resume_pdf: "/files/resume.pdf"
tagline: "화학에서 코드로, 코드에서 AI로"
---

화학공학과를 졸업하고 KCC에서 7년간 현장의 문제를 직접 마주했습니다.
"이걸 시스템으로 만들 수 있다면?" — 그 질문이 모든 것의 시작이었습니다.

현장에서 반복되는 비효율을 보며 '기술로 해결할 수 있다'는 확신이 생겼고,
풀스택 개발자로 전환하여 다수의 서비스를 기획부터 배포, 운영까지 경험했습니다.

현재는 LangChain/LangGraph를 활용한 AI Agent 시스템을 구축하며
자동화를 넘어 지능화된 시스템을 만드는 개발자로 성장하고 있습니다.
```

### content/projects/ai-agent.md (예시)

```markdown
---
id: "ai-agent"
tier: "main"
title: "AI Agent 업무관리 시스템"
icon: "🤖"
order: 1
techStack:
  - LangChain
  - LangGraph
  - Next.js
  - Nest.js
  - Python
---

## 설명
LangChain과 LangGraph를 활용하여 멀티스텝 추론이 가능한
AI Agent 기반 업무관리 시스템을 설계하고 구축했습니다.

## 하이라이트
- LangGraph 기반 멀티에이전트 워크플로우 설계
- 업무 자동 분류 및 우선순위 추천 기능
- 자연어 기반 업무 생성 및 관리 인터페이스

## 아키텍처
User → API Gateway → LangGraph
                      ├→ Task Agent
                      ├→ Priority Agent
                      └→ Summary Agent

## 기술의사결정
- 왜 LangGraph? → 멀티스텝 추론과 상태 관리가 필요한 워크플로우에 적합
- 왜 Nest.js? → 모듈화된 백엔드 구조로 Agent별 서비스 분리 용이

## 챌린지
- 문제: Agent 루프 방지 → 해결: State Machine 기반 흐름 제어
- 문제: 응답 지연 → 해결: Streaming 응답 적용

## 임팩트
AI가 업무를 자동으로 분류하고 우선순위를 추천하여 팀 업무 효율성을 향상시켰습니다.

## 수치
- 사용자 수: [추후 작성]
- 처리량: [추후 작성]
```

### content/projects/_template.md (새 프로젝트 추가용)

```markdown
---
id: "project-id"
tier: "main"
title: "프로젝트 이름"
icon: "🔧"
order: 99
techStack:
  - Tech1
  - Tech2
---

## 설명
프로젝트 설명

## 하이라이트
- 포인트 1
- 포인트 2

## 아키텍처
(선택사항)

## 기술의사결정
(선택사항)

## 챌린지
(선택사항)

## 임팩트
비개발자도 이해할 수 있는 설명

## 수치
(선택사항)
```

### content/career/01-chemistry.md

```markdown
---
phase: "chem"
title: "화학공학과 졸업 → KCC 입사"
period: "7년"
icon: "⚗️"
order: 1
---

화학 소재 분야에서 현장 경험을 쌓으며 산업 도메인에 대한 깊은 이해를 갖추었습니다.
반복되는 비효율을 보며 기술적 해결에 대한 갈망이 시작되었습니다.
```

### content/career/02-developer.md

```markdown
---
phase: "code"
title: "풀스택 개발자로 전환"
period: "~4년"
icon: "💻"
order: 2
---

스타트업에서 웹 개발자로 커리어를 전환.
다수의 서비스를 기획부터 개발, 배포, 운영까지 전 과정을 경험했습니다.
```

### content/career/03-ai.md

```markdown
---
phase: "ai"
title: "AI Agent 시스템 개발"
period: "현재"
icon: "🤖"
order: 3
---

LangChain/LangGraph를 활용한 AI Agent 업무관리 시스템을 설계·구축.
최신 기술을 실전에 적용하는 단계로 진화했습니다.
```

### content/hire/services.md

```markdown
---
title: "웹사이트 제작 서비스"
---

## 서비스

### 🏢 회사소개 홈페이지
기업 이미지에 맞는 전문적인 홈페이지를 제작합니다.

### 🛒 쇼핑몰
결제 시스템 연동, 상품 관리, 주문 관리까지.

### 📱 랜딩페이지
이벤트, 프로모션, 신규 서비스 홍보용 원페이지.

### 📋 관리자 페이지
데이터 관리, 통계, 사용자 관리 등 내부 시스템.

### 🤖 챗봇 연동
홈페이지에 AI 챗봇 또는 자동응답 시스템 연동.

### 🔧 기존 사이트 수정
기존 웹사이트의 디자인 개선, 기능 추가, 리뉴얼.

## 프로세스
1. 상담 — 어떤 사이트가 필요한지 이야기를 나눕니다
2. 기획 — 사이트 구조와 기능을 정리합니다
3. 디자인 — 시안을 제작하고 피드백을 반영합니다
4. 개발 — 코드를 작성하고 기능을 구현합니다
5. 배포 — 사이트를 배포하고 사용법을 안내합니다
```

---

## ✅ STEP 00 체크리스트

시작하기 전에 확인하세요:

- [ ] content/ 폴더의 모든 MD 파일을 본인 정보로 작성했는가?
- [ ] `[수정 필요]` 부분을 전부 채웠는가? (최소한 profile.md)
- [ ] 프로젝트 상세 내용은 추후에 추가해도 되지만, 기본 구조는 갖춰져 있는가?
- [ ] Node.js 18+ 설치되어 있는가?

→ 준비되었으면 **STEP-01.md** 프롬프트로 이동하세요.
