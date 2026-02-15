# STEP 03 — 공통 컴포넌트 (Navbar, Footer, ScrollReveal)

> 이 단계의 목표: 모든 페이지에서 사용하는 공통 컴포넌트 3개 완성

---

## 🔨 프롬프트 (Claude Code에 입력)

```
공통 컴포넌트 3개를 만들고 layout.tsx에 적용해줘.

### 1. components/common/Navbar.tsx

디자인:
- position: fixed, 상단, z-50
- 배경: rgba(10,10,15,0.8) + backdrop-blur-xl
- 하단 border: 1px solid rgba(255,255,255,0.05)

왼쪽:
- 로고 텍스트: "Portfolio" (또는 profile.md의 name)
- 그라디언트: chem → code → ai (bg-clip-text)
- font-weight: 800, tracking-tight

오른쪽 링크:
- Home (/), Dev (/dev), HR (/hr), Hire (/hire)
- 현재 라우트 하이라이트: usePathname()으로 판별
- 활성 링크: 흰색 텍스트 + 하단 2px 보더
- 비활성: text-gray-400, hover 시 밝아짐
- 각 페이지 accent 색상:
  - /dev → code 보라
  - /hr → amber (#f59e0b)  
  - /hire → chem 초록
  - / → 그라디언트

동작:
- 스크롤 시 패딩 축소: py-5 → py-3 (scroll > 50px)
- useState + useEffect로 scroll 감지

모바일 (< 768px):
- 오른쪽 링크 숨김
- 햄버거 아이콘 (lucide-react Menu/X)
- 클릭 시 풀스크린 오버레이 메뉴
- Framer Motion으로 열기/닫기 애니메이션 (slide down)
- 메뉴 링크 클릭 시 자동 닫힘

"use client" 컴포넌트.

### 2. components/common/Footer.tsx

디자인:
- 배경: card (#16161f), 상단 border
- padding: 40px
- 가운데 정렬

내용:
- "© 2025 [이름] — Built with Next.js" (content/profile.md에서 이름 가져오기)
  → 하지만 Footer는 클라이언트 컴포넌트일 수 있으니, 이름은 props로 받거나 하드코딩
- 링크 아이콘: GitHub, Mail (lucide-react)
  → 링크는 props로 받기 (layout.tsx에서 getProfile() 호출 후 전달)
- 아이콘 hover 시 밝아짐

### 3. components/common/ScrollReveal.tsx

기능:
- children을 감싸는 래퍼 컴포넌트
- Framer Motion의 motion.div 사용
- 초기: opacity 0, y: 40px
- 뷰포트 진입 시: opacity 1, y: 0
- transition: duration 0.8, ease [0.16, 1, 0.3, 1]
- once: true (한 번만 트리거)

props:
- children: ReactNode
- delay?: number (기본 0, stagger 효과용)
- className?: string

"use client" 컴포넌트.

### 4. app/layout.tsx 수정

- Navbar를 상단에 고정 배치
- main 태그에 pt (navbar 높이만큼 패딩)
- Footer를 하단에 배치
- getProfile()로 프로필 데이터 읽어서 Footer에 전달

구조:
<html>
  <body>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <Footer name={profile.name} github={profile.github} email={profile.email} />
  </body>
</html>
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 03 공통 컴포넌트 테스트해줘:

1. npm run dev 실행 — 에러 없는지

2. Navbar 테스트:
   - 모든 페이지에서 Navbar가 보이는지
   - / 에서 Home 링크가 활성화 스타일인지
   - /dev 에서 Dev 링크가 활성화 스타일인지
   - /hr, /hire도 마찬가지
   - 스크롤 시 Navbar 패딩이 줄어드는지 (임시로 긴 콘텐츠 넣어서 테스트)
   - 링크 클릭 시 페이지 이동 정상인지

3. 모바일 테스트:
   - 브라우저 너비 768px 이하로 줄이기
   - 햄버거 아이콘 보이는지
   - 클릭 시 메뉴 열리는지
   - 메뉴 링크 클릭 시 이동 + 메뉴 닫히는지

4. Footer 테스트:
   - 모든 페이지 하단에 Footer 보이는지
   - 이름이 표시되는지
   - GitHub, Email 아이콘 링크 동작하는지

5. ScrollReveal 테스트:
   - 아무 페이지에서 ScrollReveal로 텍스트 감싸서 동작 확인:
     <ScrollReveal>
       <p>이 텍스트가 스크롤 시 등장해야 합니다</p>
     </ScrollReveal>
   - 페이지 로드 시 안 보이다가 스크롤하면 fade-up으로 등장하는지
   - delay prop 넣으면 지연되는지

6. TypeScript 에러: npx tsc --noEmit

모두 통과하면 "STEP 03 ✅ 완료"라고 알려줘.
문제 있으면 수정 후 다시 테스트.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| Navbar | 모든 페이지에서 표시, 활성 링크 하이라이트 |
| 모바일 메뉴 | 햄버거 → 오버레이 → 클릭 이동 + 닫힘 |
| Footer | 이름 + 아이콘 링크 |
| ScrollReveal | fade-up 등장 + delay 동작 |
| 스크롤 효과 | Navbar 패딩 축소 |

→ 전부 통과하면 **STEP-04.md**로 이동
