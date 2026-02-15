# STEP 04 — 라우터 허브 페이지 `/`

> 이 단계의 목표: 메인 허브 페이지 완성 (라우트 선택 카드 + 화학→코드→AI 스크롤 인터랙션)

---

## 🔨 프롬프트 (Claude Code에 입력)

```
app/page.tsx — 라우터 허브 페이지를 만들어줘.
content/profile.md에서 데이터를 가져와서 사용해.

### Section 1: Hero + 라우트 선택 카드

components/home/RouteCards.tsx로 분리 ("use client")

상단:
- 제목: profile.tagline ("화학에서 코드로, 코드에서 AI로")
  - font: Playfair Display, clamp(2.5rem, 5vw, 4rem)
  - 텍스트 그라디언트: chem → code → ai
- 부제: "풀스택 개발자 {profile.name} 포트폴리오"
  - text-gray-400, font-light

3개 선택 카드 (가로 배치, gap-6, 모바일은 세로):
각 카드: card 배경, card-border 보더, rounded-2xl, p-8

1. 🖥️ FOR DEVELOPERS
   - 부제: "기술 중심 포트폴리오"
   - 설명: "아키텍처, 코드, 기술 의사결정"
   - hover: code(보라) 보더 + shadow 글로우
   - 클릭 → /dev (Next.js Link)

2. 💼 FOR HR / RECRUITERS
   - 부제: "성장 스토리 포트폴리오"
   - 설명: "커리어 전환, 임팩트, 핵심 역량"
   - hover: amber(#f59e0b) 보더 + shadow 글로우
   - 클릭 → /hr

3. 🌐 HIRE ME
   - 부제: "웹사이트 제작 의뢰"
   - 설명: "홈페이지, 쇼핑몰, 랜딩페이지"
   - hover: chem(초록) 보더 + shadow 글로우
   - 클릭 → /hire

카드 Framer Motion:
- whileHover: scale 1.03, y: -4
- transition: type "spring"
- 초기 로드 시 stagger 등장 (delay 0, 0.1, 0.2)

### Section 2: 스크롤 인터랙션 (화학 → 코드 → AI)

components/home/HeroTransition.tsx로 분리 ("use client")

구조:
- 외부 컨테이너: height 400vh (스크롤 공간)
- 내부 sticky: height 100vh, flex center
- Framer Motion useScroll + useTransform 사용

3단계 전환 (스크롤 진행도 0→1 기준):

Phase 1 (0 ~ 0.33) — 화학:
- SVG: 벤젠 고리 분자구조 (6각형 + 원자 dot + 외부 결합)
  - 전자 궤도 회전 애니메이션 (CSS animation)
- 배경: radial-gradient chem 색상 (은은하게)
- 라벨 배지: "Chapter 1 — Chemistry" (chem 색상)
- 제목: "화학에서 시작된 끝없는 호기심"
- 설명: KCC 7년 경험 텍스트

Phase 2 (0.33 ~ 0.66) — 코드:
- SVG: 모니터 + 코드 라인들 (rect 여러 줄)
  - 커서 깜빡임 애니메이션
  - 떠다니는 { } < / > 텍스트
- 배경: radial-gradient code 색상
- 라벨: "Chapter 2 — Code" (code 색상)
- 제목: "코드로 문제를 해결하는 개발자"
- 설명: 풀스택 경험 텍스트

Phase 3 (0.66 ~ 1) — AI:
- SVG: 로봇 (사각 머리 + 눈 + 안테나 + 몸체 + 팔)
  - 눈 깜빡임 애니메이션
  - 안테나 빛 펄스
  - 뉴럴 네트워크 배경 라인
- 배경: radial-gradient ai 색상
- 라벨: "Chapter 3 — AI" (ai 색상)  
- 제목: "AI와 함께 진화하는 미래"
- 설명: AI Agent 텍스트

전환 효과:
- SVG 그룹: opacity 크로스페이드 (useTransform)
- 텍스트: 페이즈 변경 시 전환
- 배경색: 부드럽게 변경

오른쪽 프로그레스 인디케이터 (데스크탑만, 모바일 숨김):
- 세로 트랙 (2px, 200px 높이)
- 3개 dot (Chemistry, Code, AI)
- 진행 바 채우기 + 현재 dot 활성화

하단 스크롤 힌트:
- "Scroll" 텍스트 + 아래 화살표
- 바운스 애니메이션
- 스크롤 시 fade out

파티클 배경:
- 30개 작은 원 (chem, code, ai 색상 랜덤)
- CSS animation으로 떠다니는 효과
- opacity 0.1 ~ 0.3, 크기 2~6px
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 04 허브 페이지 테스트해줘:

1. npm run dev — 에러 없는지

2. 라우트 카드 테스트 (http://localhost:3000):
   - 3개 카드가 가로로 나란히 보이는지
   - 각 카드 hover 시 색상 변화 + 살짝 올라가는 효과
   - Dev 카드 클릭 → /dev 이동
   - HR 카드 클릭 → /hr 이동
   - Hire 카드 클릭 → /hire 이동
   - 카드 초기 등장 stagger 애니메이션 동작하는지

3. 스크롤 인터랙션 테스트:
   - 아래로 스크롤하면 화학 분자구조 SVG가 보이는지
   - 더 스크롤하면 모니터/코드 SVG로 부드럽게 전환되는지
   - 더 스크롤하면 AI 로봇 SVG로 전환되는지
   - 각 단계에서 제목/설명/배경색이 바뀌는지
   - 오른쪽 프로그레스 dot이 단계별로 활성화되는지
   - 스크롤 힌트가 처음에 보이다가 스크롤 시 사라지는지

4. 모바일 테스트 (768px 이하):
   - 카드가 세로로 쌓이는지
   - 프로그레스 인디케이터가 숨겨지는지
   - 스크롤 인터랙션이 모바일에서도 동작하는지

5. 성능:
   - 스크롤 시 버벅임 없는지
   - SVG 애니메이션이 부드러운지

6. npx tsc --noEmit — 타입 에러 없는지

모두 통과하면 "STEP 04 ✅ 완료"라고 알려줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| 3개 카드 | 표시 + hover + 클릭 이동 |
| 스크롤 전환 | 화학 → 코드 → AI SVG 크로스페이드 |
| 텍스트 변경 | 단계별 제목/설명 변화 |
| 프로그레스 | dot 활성화 + 바 채우기 |
| 모바일 | 카드 세로, 프로그레스 숨김 |
| 성능 | 스크롤 버벅임 없음 |

→ 전부 통과하면 **STEP-05.md**로 이동
