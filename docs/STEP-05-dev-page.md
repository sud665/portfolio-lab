# STEP 05 — 개발자용 페이지 `/dev`

> 이 단계의 목표: 기술팀/개발자가 보는 포트폴리오 — 터미널 감성, 아키텍처, 코드 중심

---

## 🔨 프롬프트 (Claude Code에 입력)

```
app/dev/page.tsx — 개발자용 포트폴리오 페이지를 만들어줘.
content/에서 데이터를 가져와서 사용해 (getProjects, getCareers, getProfile 등).

디자인 톤: 터미널/코드 에디터 감성, 다크, 모노스페이스 강조, accent는 code 보라(#6c5ce7)

### Section 1: Hero — 터미널 스타일

components/dev/TerminalHero.tsx ("use client")

터미널 창 UI:
- 상단 바: 트래픽 라이트 3개 dot (빨/노/초) + "terminal — portfolio"
- 배경: #0d0d14, 보더: card-border, rounded-xl
- 패딩 넉넉하게

내용 (타이핑 애니메이션으로 한 줄씩 등장):
$ whoami
> fullstack_developer ({profile.name})
$ experience --years
> 4y_dev + 7y_chemical_engineering  
$ stack --primary
> Next.js | React | Nest.js | AI_Agent
$ status
> open_to_opportunities ✓

타이핑 효과:
- Framer Motion으로 글자 하나씩 등장 (40ms 간격)
- 각 줄 사이 500ms 딜레이
- 현재 줄 끝에 커서 깜빡임 (| 문자, opacity 0↔1)
- $ 줄은 text-gray-500, > 줄은 text-chem (초록)
- 폰트: JetBrains Mono

### Section 2: Tech Stack

components/dev/TechStack.tsx

데이터는 하드코딩 (또는 lib/constants.ts):
- Frontend: Next.js, React, TypeScript, Tailwind, Thymeleaf
- Backend: Nest.js, Node.js, Java Spring, MyBatis
- AI/ML: LangChain, LangGraph, AI Agent, OCR (이것들은 highlight 스타일)
- DevOps: Git, Docker, CI/CD, AWS
- Domain: SaaS Architecture, Chemical Engineering, Manufacturing DX

카드 레이아웃: grid 3열 (모바일 1열)
각 카드:
- card 배경, card-border, rounded-xl, p-8
- 카테고리 제목: uppercase, letter-spacing 2px, text-gray-500, text-xs
- 기술 태그: 가로 wrap
  - 일반: bg-code/10, text-code 계열, border code/20
  - highlight: bg-ai/10, text-ai 계열, border ai/20
- hover: border-code/40, translateY(-2px)
- ScrollReveal로 stagger 등장

### Section 3: 프로젝트 Deep Dive

components/dev/ProjectCard.tsx

getProjects()에서 가져온 데이터로 렌더링.

각 프로젝트 카드:
- 전체: card 배경, card-border, rounded-2xl, p-0
- 상단 헤더: 아이콘 + 제목 + 티어 배지
  - MAIN → ai 색상 배지, SUB → gray 배지
- 설명 텍스트

main 프로젝트만 상세 표시:
  
  아키텍처 섹션 (있을 때만):
  - 코드 블록 스타일 (bg-black/30, font-mono, text-sm)
  - pre 태그로 그대로 표시
  - 왼쪽에 "Architecture" 라벨

  기술 의사결정 섹션 (있을 때만):
  - "Tech Decisions" 라벨
  - 각 항목: "Q: 왜 X?" → "A: 이유" 형태
  - Q는 text-code, A는 text-gray-300

  챌린지 섹션 (있을 때만):
  - "Challenges" 라벨
  - 2컬럼: 왼쪽 "Problem" (ai 색상), 오른쪽 "Solution" (chem 색상)

하이라이트: - 항목들을 → 로 표시
기술 스택 태그: 하단에 가로 나열
[GitHub] [Demo] 버튼: placeholder, code 색상 outline

sub 프로젝트:
- 컴팩트 카드 (높이 작게)
- 제목 + 설명 + 스택 태그만

ScrollReveal 적용.

### Section 4: GitHub Activity

components/dev/GitHubGrid.tsx ("use client")

GitHub 잔디 스타일 더미 시각화:
- 52주 x 7일 그리드
- 랜덤 강도 (0~4) → 색상 농도 (code 보라 계열)
- 0: transparent, 1~4: code 색상 opacity 단계
- hover 시 툴팁 ("N contributions")
- 하단 범례: "Less □□□□ More"
- 이건 더미 데이터로 시각적 효과만 (나중에 GitHub API 연동 가능)

### Section 5: Contact

- "함께 만들어 나갈 다음 코드" 제목
- GitHub, Email 링크 버튼
- code 그라디언트 CTA 버튼
- profile.md에서 링크 가져오기

모든 섹션에 ScrollReveal 적용.
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 05 개발자 페이지 테스트해줘:

1. npm run dev — 에러 없는지

2. http://localhost:3000/dev 접속

3. 터미널 Hero 테스트:
   - 터미널 창 UI가 보이는지 (트래픽 라이트, 타이틀바)
   - 타이핑 애니메이션이 한 줄씩 진행되는지
   - $ 줄과 > 줄의 색상이 다른지
   - 커서 깜빡임이 동작하는지
   - JetBrains Mono 폰트인지

4. Tech Stack 테스트:
   - 카테고리별 카드가 보이는지 (5개)
   - AI/ML 태그가 다른 색상(빨강)인지
   - 카드 hover 효과 동작하는지
   - ScrollReveal 등장 애니메이션 동작하는지

5. 프로젝트 Deep Dive 테스트:
   - content/projects/의 MD 파일에서 데이터를 잘 가져오는지
   - main 프로젝트: 아키텍처, 의사결정, 챌린지 섹션이 보이는지
   - sub 프로젝트: 컴팩트하게 표시되는지
   - 기술 스택 태그 표시되는지
   - 빈 섹션(아키텍처 없는 프로젝트 등)이 에러 없이 숨겨지는지

6. GitHub 잔디 테스트:
   - 그리드가 표시되는지
   - 색상 농도 차이가 보이는지

7. 모바일 테스트 (768px 이하):
   - 터미널 폰트 크기 적절한지
   - 카드 1열로 쌓이는지
   - 프로젝트 카드 깨지지 않는지

8. npx tsc --noEmit

모두 통과하면 "STEP 05 ✅ 완료"라고 알려줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| 터미널 Hero | 타이핑 애니메이션 + 커서 |
| Tech Stack | 5개 카테고리 카드 + highlight |
| 프로젝트 | MD 데이터 기반, 상세/컴팩트 분리 |
| 빈 섹션 | 에러 없이 숨김 처리 |
| GitHub 잔디 | 더미 그리드 표시 |

→ 전부 통과하면 **STEP-06.md**로 이동
