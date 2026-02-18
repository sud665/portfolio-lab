# MADMAX LAB — 실험 V2 (5가지 추가) 디자인

> UX 트롤링 컨셉의 인터랙티브 실험 5개 추가

---

## 아키텍처

기존 madmax 실험 패턴을 그대로 따른다.

| 항목 | 규칙 |
|------|------|
| 컴포넌트 | `components/madmax/` 1파일 1컴포넌트 |
| 훅 | 복잡한 로직은 `hooks/`에 분리 |
| 페이지 | `app/madmax/page.tsx`에 import 추가 |
| 상태 | 컴포넌트 내부 `useState` |
| 애니메이션 | Framer Motion |
| 레이아웃 | 각 실험이 `<section>` 단위 |

공통 구조: 섹션 헤더 → 시작 버튼 → Phase 에스컬레이션 → 최종 결과 화면

---

## 실험 1: ConsentHell (동의서 지옥)

**컨셉:** 약관 동의 UI. 동의할수록 점점 미친 조건이 추가됨.

**파일:** `components/madmax/ConsentHell.tsx`

**상태:** `idle` → `agreeing` (phase 0~6) → `completed`

**Phase 에스컬레이션:**

| Phase | 체크박스 내용 | 거부 시 |
|-------|-------------|---------|
| 0 | 개인정보 수집에 동의합니다 | 정상 |
| 1 | 매주 월요일 6시 기상에 동의합니다 | 버튼 약간 작아짐 |
| 2 | 파인애플 피자 금지에 동의합니다 | 버튼 더 작아짐 |
| 3 | 이 개발자가 천재라는 것에 동의합니다 | 버튼이 도망감 |
| 4 | 고양이가 세상에서 가장 귀엽다는 것에 동의합니다 | 버튼 떨림 |
| 5 | 앞으로 탭 20개 이상 안 열겠습니다 | 버튼 투명해짐 |
| 6 | 본인의 영혼을 자발적으로 바칩니다 | 거부 불가 |
| 최종 | 축하 + 서명된 계약서 카드 | — |

---

## 실험 2: CookieBoss (쿠키 배너 보스전)

**컨셉:** 쿠키 동의 배너가 점점 공격적으로 커지다가 보스전으로 전환.

**파일:** `components/madmax/CookieBoss.tsx`

**상태:** `idle` → `phase1~4` → `boss` → `victory`

**Phase 에스컬레이션:**

| Phase | 배너 크기 | 텍스트 |
|-------|----------|--------|
| 1 | 하단 바 | "쿠키를 사용합니다" |
| 2 | 하단 30% | "정말 거절하시겠습니까?" |
| 3 | 화면 50% | "쿠키 없이는 살 수 없어요 😢" |
| 4 | 전체 화면 → 보스전 | HP 바 등장, 클릭으로 HP 깎기 |
| victory | 폭발 이펙트 | "쿠키 없는 자유를 쟁취했습니다!" |

**보스전:** HP 100, 클릭당 1~5 랜덤 데미지. 보스 대사: "아야", "그만", "항복".

---

## 실험 3: CursedSlider (저주받은 슬라이더)

**컨셉:** 다양한 방식으로 망가진 슬라이더로 목표값 맞추기 챌린지.

**파일:** `components/madmax/CursedSlider.tsx` + `hooks/useCursedSlider.ts`

**상태:** `idle` → `round1~5` → `result`

**라운드:**

| Round | 목표값 | 저주 |
|-------|-------|------|
| 1 | 50 | 로그 스케일 |
| 2 | 75 | 방향 반전 |
| 3 | 30 | 마우스 반대로 |
| 4 | 60 | 랜덤 노이즈 ±5 |
| 5 | 50 | 전부 동시 적용 |

**점수:** ±2 이내 S, ±5 A, ±10 B, 그 외 C. 최종 등급 부여.

**훅 분리:** `useCursedSlider` — 라운드별 변환 함수, 점수 계산, 상태 관리.

---

## 실험 4: FakeUpdate (가짜 업데이트)

**컨셉:** 가짜 시스템 업데이트 화면. 99%에서 멈추고 블루스크린 후 "아무것도 업데이트되지 않았습니다."

**파일:** `components/madmax/FakeUpdate.tsx`

**상태:** `idle` → `updating` → `stuck` → `bluescreen` → `joke` → `reboot` → `complete`

**Phase 시퀀스:**

| Phase | 화면 | 지속 |
|-------|------|------|
| updating | 프로그레스 바 0→99% | 8초 |
| stuck | 99%에서 멈춤 → 35%로 되돌아감 | 5초 |
| bluescreen | 그린스크린 (mad 테마) + 에러 코드 | 3초 |
| joke | "농담이에요 ㅋㅋ" | 2초 |
| reboot | 스피너 + "다시 시작하는 중..." | 3초 |
| complete | 결과: 대기 시간 표시, 아무것도 안 변함 | — |

---

## 실험 5: CaptchaHell (캡차 지옥)

**컨셉:** 점점 비합리적인 캡차 챌린지.

**파일:** `components/madmax/CaptchaHell.tsx` + `hooks/useCaptchaHell.ts`

**상태:** `idle` → `level1~5` → `result`

**레벨:**

| Level | 타입 | 내용 |
|-------|------|------|
| 1 | 이미지 그리드 | "신호등을 선택하세요" — 정상 |
| 2 | 추상 이미지 | "행복을 포함한 이미지를 선택하세요" — 아무거나 정답 |
| 3 | 왜곡 텍스트 | 회전+뒤집힌 글자 — 아무거나 입력해도 통과 |
| 4 | 수학 | "원주율 소수점 7자리" — 진짜 맞춰야 함 (3.1415926) |
| 5 | 불가능 | "이 고양이 이름을 맞추세요" — 3회 실패 후 자동 통과 |
| 결과 | 판정 | "인간 확인 완료 (확률: 47%)" |

**훅 분리:** `useCaptchaHell` — 레벨 관리, 답 검증, 판정 로직.

---

## 페이지 통합

`app/madmax/page.tsx`에 기존 실험 아래, LabGrid 위에 추가:

```
<MadmaxHero />
<RunawayButton />
<PasswordHell />
<DontPress />
<LieDetector />
<InfiniteLoading />
<FortuneLab />
<ConsentHell />      ← NEW
<CookieBoss />       ← NEW
<CursedSlider />     ← NEW
<FakeUpdate />       ← NEW
<CaptchaHell />      ← NEW
<LabGrid experiments={LAB_EXPERIMENTS} />
```
