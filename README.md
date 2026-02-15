# 포트폴리오

화학공학 → 풀스택 → AI Agent 개발자 포트폴리오.
타겟별 3개 버전 (개발자/인사팀/구인) 제공.

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion
- Content: Markdown (gray-matter)

## 라우트

| 경로 | 대상 | 설명 |
|------|------|------|
| `/` | 공통 | 라우터 허브 (화학→코드→AI 스크롤 인터랙션) |
| `/dev` | 개발자 | 터미널 스타일, 아키텍처, 기술 의사결정 |
| `/hr` | 인사팀 | 스토리텔링, 임팩트, 커리어 전환 |
| `/hire` | 고객 | 서비스, 프로세스, 문의 |

## 콘텐츠 관리

`content/` 폴더의 `.md` 파일을 수정하면 자동 반영됩니다.

- `content/profile.md` — 프로필 정보
- `content/projects/*.md` — 프로젝트 추가/수정
- `content/career/*.md` — 경력 추가/수정
- `content/hire/services.md` — 서비스 목록

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run start
```

## 배포

### Vercel CLI

```bash
npm i -g vercel
vercel
```

### GitHub 연동

1. GitHub 저장소에 push
2. vercel.com에서 Import Project
3. 자동 빌드/배포
