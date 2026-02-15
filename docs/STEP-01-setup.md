# STEP 01 — 프로젝트 초기 세팅 + 라우팅 확인

> 이 단계의 목표: Next.js 프로젝트 생성, 패키지 설치, 4개 라우트 동작 확인

---

## 🔨 프롬프트 (Claude Code에 입력)

```
Next.js 포트폴리오 프로젝트를 세팅해줘.

요구사항:
- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion
- lucide-react
- gray-matter (markdown frontmatter 파싱용)
- remark, remark-html (markdown 본문 파싱용)

프로젝트 이름: portfolio

폴더 구조:
app/
├── layout.tsx            # 공통 레이아웃 (폰트, 테마)
├── page.tsx              # 라우터 허브 (/)
├── dev/page.tsx          # 개발자용 (/dev)
├── hr/page.tsx           # 인사팀용 (/hr)
└── hire/page.tsx         # 알바구인용 (/hire)

components/
├── common/               # 공통 (Navbar, Footer 등 — 아직 비어있음)
├── home/                  # 허브 페이지용
├── dev/                   # 개발자 페이지용
├── hr/                    # 인사팀 페이지용
└── hire/                  # 알바 페이지용

content/                   # ★ MD 콘텐츠 (STEP 00에서 준비한 파일들)
├── profile.md
├── projects/
│   ├── ai-agent.md
│   ├── saas-platform.md
│   ├── ocr-event.md
│   ├── workation.md
│   └── _template.md
├── career/
│   ├── 01-chemistry.md
│   ├── 02-developer.md
│   └── 03-ai.md
└── hire/
    └── services.md

lib/
├── types.ts               # TypeScript 타입 (빈 파일)
├── content.ts             # MD 파싱 유틸 (빈 파일)
└── constants.ts           # 상수 (빈 파일)

public/
├── images/
└── files/                 # 이력서 PDF 등

Tailwind 커스텀 색상:
- chem: "#00e5a0"
- code: "#6c5ce7"
- ai: "#ff6b6b"
- dark: "#0a0a0f"
- card: "#16161f"
- card-border: "#222235"

Google Fonts (next/font/google 사용):
- Outfit: 본문용 (weight 300~900)
- Playfair Display: 제목용 (weight 700)
- JetBrains Mono: 코드용 (weight 400~600)

globals.css:
- 기본 배경: dark (#0a0a0f)
- 기본 텍스트: #f0f0f5
- 스크롤바 커스텀 (얇고 어두운 스타일)
- html scroll-behavior: smooth

각 페이지(page.tsx)에는 임시 내용만:
- / : "🏠 포트폴리오 허브 — 여기서 Dev, HR, Hire 중 선택"
- /dev : "🖥️ 개발자용 포트폴리오 페이지"
- /hr : "💼 인사팀용 포트폴리오 페이지"
- /hire : "🌐 웹사이트 제작 의뢰 페이지"
각 임시 텍스트에 해당 색상 클래스를 적용해서 색상도 확인되게 해줘.

content/ 폴더의 MD 파일들은 STEP-00-overview.md에 정의된 내용으로 생성해줘.
```

---

## ✅ 체크포인트 (Claude Code에 입력)

```
STEP 01 세팅 확인해줘:

1. npm run dev 실행해서 에러 없는지 확인
2. 브라우저에서 4개 라우트 접속 테스트:
   - http://localhost:3000 → 허브 텍스트 보이는지
   - http://localhost:3000/dev → dev 텍스트 보이는지
   - http://localhost:3000/hr → hr 텍스트 보이는지
   - http://localhost:3000/hire → hire 텍스트 보이는지
3. 커스텀 색상 확인:
   - text-chem(초록), text-code(보라), text-ai(빨강) 각각 표시되는지
4. 폰트 확인:
   - Outfit, Playfair Display, JetBrains Mono 3개 폰트가 로드되는지
5. content/ 폴더에 MD 파일들이 존재하는지 ls로 확인
6. TypeScript 에러 없는지: npx tsc --noEmit

모두 통과하면 "STEP 01 ✅ 완료"라고 알려줘.
문제 있으면 수정 후 다시 확인해줘.
```

---

## 🔍 이 단계에서 확인할 것

| 항목 | 기대 결과 |
|------|----------|
| `npm run dev` | 에러 없이 실행 |
| 4개 라우트 | 각각 임시 텍스트 표시 |
| 커스텀 색상 | chem/code/ai 3색 정상 |
| 폰트 | 3개 폰트 적용 |
| content/ | MD 파일 8개+ 존재 |
| TypeScript | 타입 에러 없음 |

→ 전부 통과하면 **STEP-02.md**로 이동
