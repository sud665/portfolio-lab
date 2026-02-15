# STEP 07 — 알바구인용 페이지 `/hire`

> 이 단계의 목표: 웹사이트 제작 의뢰/프리랜서 구인용 랜딩페이지 — 심플, 신뢰감, 고객 관점

---

## 🔨 프롬프트 (Claude Code에 입력)

```
app/hire/page.tsx — 웹사이트 제작 의뢰용 페이지를 만들어줘.
content/hire/services.md에서 데이터를 가져와서 사용해.

디자인 톤: 밝고 친근한 랜딩페이지. 기술 용어 없음. 고객 관점.
accent: chem 초록 (#00e5a0). 깔끔하고 신뢰감 있게.

### Section 1: Hero

components/hire/HireHero.tsx

- 큰 타이틀: "홈페이지 필요하세요?" (Playfair, 크게)
- 부제: "기획부터 디자인, 개발, 배포까지 원스톱으로 해결해드립니다."
  (text-gray-400, text-lg)
- 2개 CTA:
  - [문의하기] → chem 배경, 흰 텍스트, #contact로 스크롤
  - [작업물 보기] → 투명 배경, chem 보더, #portfolio로 스크롤
- 배경: 은은한 radial-gradient chem 5% opacity

### Section 2: 서비스 카테고리

components/hire/ServiceGrid.tsx

getHireData().services 사용.

섹션 제목: "이런 걸 만들어드려요"

3x2 그리드 (모바일 2x3 또는 1열):
각 카드:
- card 배경, rounded-xl, p-6, text-center
- 아이콘 (40px, 위에)
- 제목 (font-semibold)
- 한 줄 설명 (text-gray-400, text-sm)
- hover: chem 보더, scale 1.02
- ScrollReveal stagger

### Section 3: 작업 프로세스

components/hire/ProcessFlow.tsx ("use client")

getHireData().process 사용.

섹션 제목: "이렇게 진행돼요"

데스크탑 (가로 플로우):
- 5단계 가로 나열
- 각 단계: 원형 넘버(1~5) + 제목 + 설명
  - 원형: chem 배경, 흰 숫자, 48px
  - 제목: font-semibold
  - 설명: text-gray-400, text-sm
- 단계 사이: 점선 또는 화살표 (→)
- 현재 hover한 단계 하이라이트

모바일 (세로 플로우):
- 세로 스텝, 왼쪽에 넘버링 라인

ScrollReveal로 왼쪽→오른쪽 순서대로 등장

### Section 4: 포트폴리오 갤러리 (id="portfolio")

components/hire/PortfolioGallery.tsx

섹션 제목: "이런 사이트를 만들었어요"

2x2 그리드 (모바일 1열):
각 카드:
- 스크린샷 영역 → placeholder (그라디언트 배경 + 아이콘으로 대체)
  - "스크린샷 준비중" 텍스트
  - 나중에 실제 이미지로 교체 가능하도록 구조화
- 프로젝트명
- 한 줄 설명 (비개발자 언어):
  - "여러 회사 홈페이지를 한 곳에서 관리하는 플랫폼"
  - "영수증 사진으로 자동 참여하는 이벤트 시스템"
  - "원격 근무지 예약 시스템"
  - "AI 기반 업무 자동화 도구"
- hover: 올라가면서 shadow

getProjects() 데이터 사용하되, 설명은 impact 필드 활용.

### Section 5: 신뢰 요소

components/hire/TrustSection.tsx ("use client")

숫자 카운트업 애니메이션 (Framer Motion useInView 트리거):
3개 가로 배치:
- "10+" — "작업 완료 건수"
- "4년" — "개발 경력"
- "100%" — "기획~배포 가능"

카운트업: 0에서 목표 숫자까지 1.5초간 증가
text-4xl font-bold, chem 색상

후기 placeholder (1~2개):
- card 배경, rounded-xl, p-6
- ⭐⭐⭐⭐⭐ 별점
- "빠르고 정확하게 원하는 결과물을 만들어주셨습니다." (placeholder)
- "— 고객 A" (placeholder)
- [수정 필요] 나중에 실제 후기로 교체

### Section 6: 문의하기 (id="contact")

components/hire/ContactSection.tsx ("use client")

섹션 제목: "프로젝트를 시작해볼까요?"

2가지 옵션 중 선택할 수 있게:

Option A — 연락 수단 카드 3개 (가로):
- 💬 카카오톡: "가장 빠른 상담" (링크 placeholder)
- 📞 전화: profile.phone
- 📧 이메일: profile.email
각 카드: card 배경, 아이콘 + 수단 + 값, hover chem 보더, 클릭 시 링크

Option B — 간단 문의 폼 (카드 3개 아래에):
- 이름 (input)
- 연락처 (input)
- 원하는 서비스 (select: 서비스 목록)
- 간단 설명 (textarea)
- [문의 보내기] 버튼 (chem 배경)
- 실제 전송은 미구현 — 버튼 클릭 시 alert("준비 중입니다")만
- 나중에 API Route로 연결 가능하도록 구조화

둘 다 표시해줘 (카드 위, 폼 아래).
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 07 알바구인 페이지 테스트해줘:

1. npm run dev — 에러 없는지

2. http://localhost:3000/hire 접속

3. Hero:
   - "홈페이지 필요하세요?" 제목 보이는지
   - [문의하기] 클릭 → #contact로 스크롤되는지
   - [작업물 보기] 클릭 → #portfolio로 스크롤되는지

4. 서비스 카테고리:
   - content/hire/services.md에서 6개 서비스 로드되는지
   - 카드 6개 그리드 표시
   - hover 효과

5. 작업 프로세스:
   - 5단계 가로 플로우 보이는지
   - 번호, 제목, 설명 표시
   - 단계 사이 연결 표시

6. 포트폴리오 갤러리:
   - 프로젝트 카드들이 보이는지
   - placeholder 이미지(그라디언트)가 깨지지 않는지
   - 비개발자 언어로 설명이 되어 있는지

7. 신뢰 요소:
   - 숫자 카운트업 애니메이션이 스크롤 시 동작하는지
   - 후기 placeholder 보이는지

8. 문의하기:
   - 연락 수단 카드 3개 보이는지
   - 문의 폼이 보이는지
   - 각 input 입력 가능한지
   - [문의 보내기] 클릭 시 alert 뜨는지

9. 전체 톤:
   - /dev, /hr과 확실히 다른 느낌인지 (밝고 친근)
   - chem 초록 accent 일관성
   - 기술 용어가 없는지

10. 모바일:
    - 서비스 그리드, 프로세스, 갤러리 모두 반응형인지

11. npx tsc --noEmit

모두 통과하면 "STEP 07 ✅ 완료"라고 알려줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| 톤 | 밝고 친근, 기술 용어 없음 |
| 서비스 | MD에서 6개 로드 |
| 프로세스 | 5단계 플로우 |
| 갤러리 | placeholder + 비개발자 설명 |
| 카운트업 | 숫자 애니메이션 |
| 문의 | 카드 + 폼 동작 |

→ 전부 통과하면 **STEP-08.md**로 이동
