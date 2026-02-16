# Telegram 실시간 채팅 위젯 설계

> 날짜: 2026-02-16
> 상태: 승인됨

## 목적

포트폴리오 사이트의 모든 페이지에 실시간 채팅 위젯을 추가한다. 방문자는 사이트 내 채팅창에서 메시지를 보내고, 운영자는 텔레그램에서 알림 받고 답변한다.

## 아키텍처

```
방문자 브라우저 ←→ Supabase Realtime (WebSocket)
                        ↕
                  Supabase DB (messages, sessions)
                        ↕
                  Next.js API Routes ←→ Telegram Bot API ←→ 텔레그램 앱
```

### 데이터 흐름

1. 방문자 메시지 전송 → `POST /api/chat/send` → Supabase 저장 + Telegram Bot으로 전송
2. 운영자 텔레그램 답변 → Telegram Webhook → `POST /api/chat/webhook` → Supabase 저장
3. Supabase Realtime이 자동으로 방문자 브라우저에 새 메시지 푸시

## DB 스키마 (Supabase Postgres)

```sql
sessions (
  id uuid PK DEFAULT gen_random_uuid(),
  visitor_name text,
  page text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

messages (
  id uuid PK DEFAULT gen_random_uuid(),
  session_id uuid FK → sessions,
  sender text CHECK (sender IN ('visitor', 'owner')),
  content text,
  created_at timestamptz DEFAULT now()
)
```

메시지는 영구 저장. 무료 티어 500MB로 충분.

## 파일 구조

```
app/api/chat/
  ├── send/route.ts          # 방문자 메시지 수신
  └── webhook/route.ts       # Telegram webhook 수신

components/common/
  └── ChatWidget.tsx          # 플로팅 채팅 위젯

lib/
  ├── supabase.ts             # Supabase 클라이언트
  └── telegram.ts             # Telegram Bot API 헬퍼

hooks/
  └── useChatMessages.ts      # Supabase Realtime 구독 훅
```

## 채팅 위젯 UI

### 상태

- **닫힌 상태**: 오른쪽 하단 플로팅 버블 (메시지 아이콘). 새 메시지 시 뱃지 표시.
- **열린 상태**: 채팅창 (헤더 + 메시지 목록 + 입력창)

### 디자인

- 배경: `bg-card` (#16161f)
- 테두리: `border-card-border` (#222235)
- 악센트: `chem` (#00e5a0) — 전송 버튼, 온라인 표시
- 폰트: `font-outfit` (본문), `font-mono` (시간)
- 애니메이션: Framer Motion 열림/닫힘 트랜지션

### 동작

1. 첫 방문 → 3초 후 툴팁 "궁금한 점이 있으신가요?"
2. 채팅 열기 → 환영 메시지 + 세션 생성
3. 메시지 전송 → API → Supabase + Telegram
4. 응답 수신 → Supabase Realtime 자동 표시
5. 부재 시 → 30초 후 부재중 안내 메시지
6. 재방문 → localStorage 세션 ID로 이전 대화 복원

### 배치

`layout.tsx`에 `<ChatWidget />` 추가 (모든 페이지 공통)

## 에러 처리

| 상황 | 대응 |
|------|------|
| Supabase 연결 실패 | "일시적 오류" 안내 + 재시도 버튼 |
| Telegram 전송 실패 | Supabase에는 저장, 백그라운드 재시도 |
| 네트워크 끊김 | Supabase SDK 자동 재연결 |
| 세션 만료 | 새 세션 자동 생성 |

## 보안

- Rate limiting: IP 기반 분당 10건
- 입력 검증: 500자 제한, HTML 이스케이프
- 환경 변수: `.env.local`에만 저장
- Webhook 검증: Telegram 출처 확인

## 환경 변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_WEBHOOK_SECRET=
```

## 의존성 추가

```
@supabase/supabase-js
```
