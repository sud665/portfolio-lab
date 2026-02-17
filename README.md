# portfolio-lab

개인 포트폴리오 웹사이트. 대상별(개발자/인사팀/의뢰인) 맞춤 페이지 제공.

## 기술 스택

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript 5
- Tailwind CSS 4 (CSS-first, `@theme`)
- Framer Motion
- Supabase (실시간 채팅)
- Telegram Bot (채팅 알림)

## 시작하기

### 필수 조건

- Node.js 18+

### 설치

```bash
npm install
```

### 환경 변수

```bash
cp .env.local.example .env.local
```

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (API Route 전용) |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot 토큰 |
| `TELEGRAM_CHAT_ID` | Telegram 채팅 ID |
| `TELEGRAM_WEBHOOK_SECRET` | Telegram webhook 검증 시크릿 |

### 실행

```bash
npm run dev
```

## 주요 페이지

| 경로 | 대상 | 설명 |
|------|------|------|
| `/` | 공통 | 허브 페이지 (화학→코드→AI 스크롤 인터랙션) |
| `/dev` | 개발자 | 기술 스택, 프로젝트, 아키텍처 |
| `/hr` | 인사팀 | 이력서, 경력, 강점 |
| `/hire` | 의뢰인 | 서비스, 포트폴리오, 문의 |

## API

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/chat/send` | POST | 방문자 채팅 메시지 전송 → Supabase 저장 + Telegram 알림 |
| `/api/chat/webhook` | POST | Telegram 답장 → Supabase 저장 (실시간 전달) |
| `/api/contact` | POST | 문의 폼 이메일 발송 |

## 콘텐츠 관리

`content/` 폴더의 `.md` 파일을 수정하면 자동 반영.

- `content/profile.md` — 프로필 정보
- `content/projects/*.md` — 프로젝트 추가/수정
- `content/career/*.md` — 경력 추가/수정
- `content/hire/services.md` — 서비스 목록

## 배포

Vercel에 배포. `main` 브랜치 push 시 자동 배포.

```bash
npm run build
```

## 커밋 컨벤션

```
feat: 새 기능       fix: 버그 수정
style: UI 변경      refactor: 구조 변경
content: MD 수정    chore: 설정/의존성
```
