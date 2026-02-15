# STEP 06 — 인사팀용 페이지 `/hr`

> 이 단계의 목표: 인사팀/리크루터가 보는 포트폴리오 — 스토리텔링, 임팩트, 성장 중심

---

## 🔨 프롬프트 (Claude Code에 입력)

```
app/hr/page.tsx — 인사팀용 포트폴리오 페이지를 만들어줘.
content/에서 데이터를 가져와서 사용해.

디자인 톤: 따뜻하고 프로페셔널한 매거진 스타일. 기술 용어 최소화.
accent: warm amber (#f59e0b). 서체: Playfair Display(제목) + Outfit(본문).

### Section 1: Hero — 스토리텔링

components/hr/StoryHero.tsx

디자인:
- 큰 타이틀: "현장의 문제를 아는 개발자" (Playfair, clamp 3~5rem)
- 부제: "화학공학 7년의 도메인 지식 위에 풀스택 개발 4년의 기술력을 쌓았습니다."
  (text-gray-400, text-lg)
- 배경: 은은한 radial-gradient amber (#f59e0b) 5% opacity
- [이력서 다운로드] 버튼:
  - amber 그라디언트 배경, 흰 텍스트
  - Download 아이콘 (lucide-react)
  - href: profile.resume_pdf (placeholder "/files/resume.pdf")
- ScrollReveal fade-up

### Section 2: 커리어 타임라인

components/hr/CareerTimeline.tsx ("use client")

getCareers() 데이터 사용.

데스크탑 (가로 타임라인):
- 가로 라인 (2px, 그라디언트: chem → code → ai)
- 각 단계: 라인 위에 dot + 카드
  - dot: 해당 phase 색상, 12px, border 2px
  - 카드: 아이콘 + 제목 + 기간 + 설명
  - phase별 accent 색상 적용 (chem/code/ai)
- 3단계 균등 배치 (flex justify-between)

모바일 (세로 타임라인):
- 세로 라인 (왼쪽에 2px)
- 각 단계: 라인 옆에 dot + 카드 (오른쪽)

"왜 전환했나?" 인용구 박스:
- 타임라인 아래에 배치
- card 배경, amber border-left 4px
- italic 텍스트: "현장에서 반복되는 비효율을 보며 '기술로 해결할 수 있다'는 확신이 생겼습니다."
- 인용 아이콘 (lucide-react Quote)

ScrollReveal 적용.

### Section 3: 핵심 성과 — 임팩트 카드

components/hr/ImpactCards.tsx

getProjects() 데이터의 impact 필드 사용.
기술 용어 없이 비즈니스 임팩트만 표시.

2x2 그리드 (모바일 1열):
각 카드:
- card 배경, rounded-2xl, p-8
- 상단: 큰 아이콘 (48px)
- 제목: 프로젝트명 (기술명 대신 역할 중심으로)
  - "AI Agent 업무관리" → "AI 업무 자동화 시스템"
  - "SaaS 홈페이지 스위칭" → "SaaS 올인원 플랫폼"
  - "영수증 OCR" → "영수증 자동 인식 이벤트"
  - "워케이션 시스템" → "워케이션 예약 플랫폼"
- 설명: project.impact 텍스트
- hover: amber 보더 + shadow 글로우
- ScrollReveal stagger

### Section 4: 핵심 강점

components/hr/Strengths.tsx

5개 강점 카드 (하드코딩 데이터):
1. 🔄 빠른 학습력 — "비전공에서 4년 만에 AI Agent까지"
2. 🏭 도메인 지식 — "7년간 쌓은 제조업 현장 이해"
3. 🚀 자기주도 실행력 — "스타트업에서 기획부터 배포까지 전 과정"
4. 🤖 최신 기술 적응 — "LangChain/LangGraph 실전 적용"
5. 📋 풀사이클 개발 — "기획, 디자인, 개발, 배포, 운영 전체"

레이아웃: 가로 스크롤 또는 flex wrap
각 카드: card 배경, p-6, 아이콘(32px) + 제목(bold) + 설명(text-gray-400)
hover: amber accent

### Section 5: HR 토론 섹션

components/hr/HRDebate.tsx

2컬럼 (모바일 1열):

긍정 HR (왼쪽):
- bg-chem/5, border chem/15, rounded-xl, p-7
- 라벨: "🟢 긍정 HR" (chem 색상, uppercase, 작은 글씨)
- 텍스트: "화학공학 7년 + 풀스택 4년 + AI Agent 경험. 이 조합은 시장에서 찾기 어렵습니다.
  단순히 코드를 짜는 개발자가 아니라, 산업의 문제를 이해하고 기술로 해결하는 사람입니다.
  특히 AI Agent를 실전에 적용한 경험은 2025년 기준 상위 역량입니다."
- italic, text-gray-300

부정 HR (오른쪽):
- bg-ai/5, border ai/15
- 라벨: "🔴 부정 HR" (ai 색상)
- 텍스트: "개발 경력 4년은 시니어로 보기엔 짧습니다. 다만 KCC 7년이 도메인 지식으로 연결된다면
  설득력이 있고, SaaS 멀티테넌트 설계와 AI Agent 시스템은 기술적 깊이를 보여줍니다.
  결론: 전환 스토리가 탄탄하다면 오히려 차별화 포인트입니다."

제목: "🟢 긍정 HR vs 🔴 부정 HR — 이 후보자 평가"
card 배경 + rounded-2xl + p-10

### Section 6: Contact

- "새로운 도전을 함께할 팀을 찾고 있습니다" 제목 (Playfair)
- 3개 버튼: [이력서 PDF], [이메일], [전화]
- amber 그라디언트 메인 CTA
- profile.md에서 링크
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 06 인사팀 페이지 테스트해줘:

1. npm run dev — 에러 없는지

2. http://localhost:3000/hr 접속

3. Hero 테스트:
   - "현장의 문제를 아는 개발자" 제목 보이는지
   - 이력서 다운로드 버튼 보이는지
   - amber 톤의 은은한 배경이 적용되는지

4. 커리어 타임라인:
   - 3단계 (화학→개발→AI) 가로 타임라인 보이는지
   - content/career/ MD 파일에서 데이터를 제대로 가져오는지
   - 각 단계 색상이 다른지 (초록/보라/빨강)
   - "왜 전환했나?" 인용구 박스 보이는지
   - 모바일에서 세로 타임라인으로 전환되는지

5. 임팩트 카드:
   - 4개 프로젝트 카드 보이는지
   - 기술 용어 없이 비즈니스 언어로 표시되는지
   - content/projects/ MD의 impact 필드가 사용되는지
   - hover 효과 동작하는지

6. 핵심 강점:
   - 5개 강점 카드 보이는지

7. HR 토론:
   - 긍정/부정 2컬럼 보이는지
   - 색상 차이 (초록 vs 빨강 계열)

8. Contact:
   - 이력서/이메일/전화 버튼 보이는지

9. 전체 톤 확인:
   - /dev 페이지와 확실히 다른 느낌인지 (기술적 vs 스토리텔링)
   - amber accent가 일관되게 적용되는지

10. npx tsc --noEmit

모두 통과하면 "STEP 06 ✅ 완료"라고 알려줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| 톤 | /dev와 확실히 다른 따뜻한 매거진 느낌 |
| 타임라인 | 3단계 가로/세로 반응형 |
| 임팩트 카드 | 기술 용어 없는 비즈니스 언어 |
| HR 토론 | 긍정/부정 2컬럼 |
| 데이터 | content/ MD에서 정상 로드 |

→ 전부 통과하면 **STEP-07.md**로 이동
