# MADMAX LAB — 실험 V3 (5가지 추가) 디자인

> 테크 밈 컨셉의 인터랙티브 실험 5개 추가

---

## 아키텍처

기존 madmax 실험 패턴을 그대로 따른다. 실험 번호 #011~#015.

---

## 실험 1: AIReviewer (AI 코드 리뷰어)

**컨셉:** 코드를 입력하면 AI가 점점 비합리적인 리뷰 코멘트를 남김.

**파일:** `components/madmax/AIReviewer.tsx`

**상태:** `idle` → `writing` → `reviewing` (comment 0~5) → `result`

**인터랙션:** textarea에 코드 입력 → "리뷰 요청" → 코멘트가 하나씩 타이핑 애니메이션으로 등장

**코멘트 풀 (랜덤 6개 선택, 점점 미쳐감):**
- 합리적: "변수명이 불분명합니다", "매직 넘버를 상수로 추출하세요"
- 애매함: "이 함수는 너무 외로워 보입니다", "들여쓰기에서 슬픔이 느껴집니다"
- 미침: "바이브가 안 맞습니다", "세미콜론에서 분노가 느껴집니다", "코드를 소리 내어 읽어보셨나요? 운율이 맞지 않습니다"

**최종:** 코드 품질 점수 (랜덤) + "리뷰어 감정 상태: 지침"

---

## 실험 2: CenterDiv (div 중앙 정렬 챌린지)

**컨셉:** CSS로 div를 중앙에 놓는 챌린지. 매번 새로운 방식으로 깨짐.

**파일:** `components/madmax/CenterDiv.tsx`

**상태:** `idle` → `playing` (round 1~5) → `result`

**라운드:**

| Round | CSS 선택지 | div의 반응 |
|-------|-----------|-----------|
| 1 | margin: 0 auto | 왼쪽으로 도망 |
| 2 | display: flex | 위로 날아감 |
| 3 | display: grid | 회전하며 빙글빙글 |
| 4 | position: absolute 50% | 4개로 분열 |
| 5 | 포기 (아무거나) | 완벽하게 중앙 정렬 |

**최종:** CSS 마스터리 등급 + 칭호

---

## 실험 3: NodeModules (node_modules 블랙홀)

**컨셉:** npm install 시뮬레이터. 패키지가 끝없이 설치되며 용량이 우주급.

**파일:** `components/madmax/NodeModules.tsx`

**상태:** `idle` → `installing` → `complete`

**에스컬레이션:**

| 시간 | 패키지 수 | 용량 | 이벤트 |
|------|----------|------|--------|
| 0~3초 | 1~10 | KB | 정상 패키지 |
| 3~8초 | 10~100 | MB | 의존성 폭발 |
| 8~15초 | 100~1000 | GB | 미친 패키지명 |
| 15~25초 | 1000~∞ | TB→PB→EB | 우주급 |
| 25초+ | ∞ | 블랙홀 | 화면 빨려들어감 |

**시각적:** 터미널 스타일 UI (모노스페이스, 초록 글자)

---

## 실험 4: WorksOnMyMachine (It Works on My Machine)

**컨셉:** 로컬에서 성공한 코드를 배포하면 점점 미친 에러 발생.

**파일:** `components/madmax/WorksOnMyMachine.tsx`

**상태:** `idle` → `local` → `deploying` → `error` (반복 1~5) → `result`

**루프:**

| 시도 | Production 에러 |
|------|----------------|
| 1 | Cannot read property 'hello' of undefined |
| 2 | Tuesday is not a valid day for deployments |
| 3 | Your code hurt the server's feelings |
| 4 | Mercury is in retrograde. Deploys disabled. |
| 5 | SUCCESS! → 3초 후 → 500 Internal Vibes Error |
| 최종 | 갑자기 성공 |

**시각적:** Local(초록) vs Production(빨강) 분할 패널

**최종:** DevOps 등급 판정

---

## 실험 5: PRHell (PR 리뷰 지옥)

**컨셉:** 1줄 PR에 47개 코멘트가 달림. Resolve하면 히드라처럼 2개 생성.

**파일:** `components/madmax/PRHell.tsx`

**상태:** `idle` → `submitted` (comment 추가) → `result`

**코멘트 에스컬레이션:**

| # | 리뷰어 | 코멘트 |
|---|--------|--------|
| 1 | @senior-dev | 변수명이 불분명합니다 |
| 2 | @clean-coder | 상수 ONE을 사용하세요 |
| 3 | @semicolon-fan vs @no-semicolon | 세미콜론 스레드 전쟁 |
| 4 | @test-zealot | const 선언에 테스트가 없습니다 |
| 5 | @design-reviewer | 폰트가 마음에 안 듭니다 |
| 6 | @bot | 이 PR은 47일째 열려있습니다 |

**Resolve 메커니즘:** 하나 해결하면 2개 새 코멘트 생성 (히드라)

**최종:** Approve + PR 서바이벌 등급 + 머지까지 걸린 시간

---

## 페이지 통합

`app/madmax/page.tsx`에 기존 실험 아래, LabGrid 위에 추가:

```
<CaptchaHell />
<AIReviewer />       ← NEW
<CenterDiv />        ← NEW
<NodeModules />      ← NEW
<WorksOnMyMachine /> ← NEW
<PRHell />           ← NEW
<LabGrid />
```
