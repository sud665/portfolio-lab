# 위시켓 페이지 디자인 리뉴얼

## 목적

기존 `/wishket` 페이지의 디자인이 밋밋하여 경쟁 에이전시 대비 차별화가 안 됨.
포트폴리오/실적 중심의 깔끔한 미니말 라이트 디자인으로 전면 리뉴얼.

## 핵심 전략

- **Portfolio-First**: 포트폴리오를 Hero 바로 다음에 대형으로 배치
- **Clean Minimal Light**: 순백 배경, 넓은 여백, 타이포그래피 중심
- **정보 밀도 + 신뢰감**: 10초 안에 실력을 판단할 수 있는 구조

## 디자인 토큰

- 배경: #ffffff (순백)
- 카드: #f8f9fb + shadow-sm
- 텍스트: #1a1a2e (제목), #6b7280 (본문)
- 액센트: chem (#d81159) — CTA, 강조
- 여백: 섹션 간 py-24 ~ py-32 (현재 py-20에서 확대)
- 카드 그림자: shadow-sm 기본, hover:shadow-xl

## 섹션 구성 (6개)

### 1. Hero (압축형)

- 프로필 사진 제거, 텍스트 중심
- mono 서브 타이틀 + playfair 메인 타이틀
- 핵심 지표 3개 가로 배치
- CTA 버튼 "견적 문의하기"

### 2. Portfolio Showcase (핵심 섹션)

- 2열 대형 카드 (현재 3열에서 변경)
- 큰 썸네일 (aspect-[16/10])
- 카드에 기술스택 태그 바로 노출
- shadow-sm + hover:shadow-xl hover:-translate-y-1
- 클릭 시 모달 (기존 유지)

### 3. WhyMe (3카드)

- 아이콘 영역에 배경색 추가 (border만 있던 것 → bg 추가)
- 카드에 그림자 추가
- 구조 동일

### 4. PricingTable (견적)

- 이모지 → lucide-react 아이콘으로 교체
- 카드에 그림자 추가
- 구조 동일

### 5. Process (작업 프로세스)

- 현재 구조 유지 (잘 되어 있음)
- 스타일만 미세 조정

### 6. FAQ + CTA (마무리)

- FAQ 아코디언 (기존 유지)
- CTA를 FAQ 아래에 붙여서 하나의 마무리 섹션으로 합체

## 파일 변경 범위

기존 컴포넌트 7개를 수정 (새 파일 생성 없음):
- `components/wishket/WishketHero.tsx` — 프로필 사진 제거, 여백 확대
- `components/wishket/CompactPortfolio.tsx` — 2열 대형 카드, 기술스택 노출
- `components/wishket/WhyMe.tsx` — 아이콘 배경색, 그림자
- `components/wishket/PricingTable.tsx` — 이모지→아이콘, 그림자
- `components/wishket/WishketProcess.tsx` — 미세 스타일 조정
- `components/wishket/FAQ.tsx` — 변경 최소
- `components/wishket/WishketCTA.tsx` — FAQ 아래 배치용 조정
- `app/wishket/page.tsx` — 섹션 순서 재배치

## 데이터 소스

변경 없음. 기존 데이터 그대로 사용:
- 포트폴리오: content/hire/portfolio/*.md (getPortfolio)
- 프로필: content/profile.md (getProfile)
- 견적/FAQ/강점: 컴포넌트 내 상수
