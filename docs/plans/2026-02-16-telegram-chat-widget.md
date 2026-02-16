# Telegram 실시간 채팅 위젯 구현 계획

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 포트폴리오 사이트 전체에 실시간 채팅 위젯을 추가하여 방문자가 사이트 내에서 메시지를 보내면 운영자가 텔레그램에서 확인하고 답변하는 양방향 채팅 시스템을 구축한다.

**Architecture:** Supabase Postgres에 sessions/messages 테이블을 두고, Supabase Realtime으로 브라우저에 실시간 푸시한다. 방문자 메시지는 Next.js API Route를 통해 Supabase 저장 + Telegram Bot 전송하고, 운영자 답변은 Telegram Webhook → API Route → Supabase 저장 흐름으로 처리한다.

**Tech Stack:** Next.js 16 API Routes, @supabase/supabase-js, Telegram Bot API, Framer Motion, Tailwind CSS v4

---

## Task 1: 의존성 설치 및 환경 변수 템플릿

**Files:**
- Modify: `package.json`
- Create: `.env.local.example`

**Step 1: Supabase SDK 설치**

Run: `npm install @supabase/supabase-js`

**Step 2: 환경 변수 템플릿 생성**

Create `.env.local.example`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (서버 전용 — 브라우저에 노출 금지)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
TELEGRAM_WEBHOOK_SECRET=your-random-secret-string
```

**Step 3: Commit**

```bash
git add package.json package-lock.json .env.local.example
git commit -m "chore: add @supabase/supabase-js and env template"
```

---

## Task 2: Supabase DB 스키마 (SQL)

**Files:**
- Create: `docs/sql/chat-schema.sql`

**Step 1: SQL 파일 작성**

```sql
-- Supabase SQL Editor에서 실행

-- 1. sessions 테이블
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  page text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. messages 테이블
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  sender text not null check (sender in ('visitor', 'owner')),
  content text not null,
  created_at timestamptz default now()
);

-- 3. 인덱스
create index idx_messages_session_id on public.messages(session_id);
create index idx_messages_created_at on public.messages(created_at);
create index idx_sessions_is_active on public.sessions(is_active);

-- 4. RLS (Row Level Security)
alter table public.sessions enable row level security;
alter table public.messages enable row level security;

-- 방문자: 자기 세션만 읽기 (anon key)
create policy "Anyone can create sessions"
  on public.sessions for insert
  to anon with check (true);

create policy "Anyone can read sessions"
  on public.sessions for select
  to anon using (true);

-- 메시지: 읽기는 세션 ID 기반, 쓰기는 API Route(service_role)에서만
create policy "Anyone can read messages"
  on public.messages for select
  to anon using (true);

create policy "Service role can insert messages"
  on public.messages for insert
  to service_role with check (true);

-- 5. Realtime 활성화
alter publication supabase_realtime add table public.messages;

-- 6. updated_at 자동 갱신 트리거
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function update_updated_at();
```

**Step 2: Supabase 대시보드에서 SQL 실행**

- Supabase 프로젝트 → SQL Editor → 위 SQL 붙여넣고 실행
- Table Editor에서 sessions, messages 테이블 생성 확인
- Realtime → messages 테이블이 활성화되었는지 확인

**Step 3: Commit**

```bash
git add docs/sql/chat-schema.sql
git commit -m "docs: add chat DB schema SQL"
```

---

## Task 3: 타입 정의 추가

**Files:**
- Modify: `lib/types.ts` (끝부분에 추가)

**Step 1: 채팅 관련 타입 추가**

`lib/types.ts` 파일 끝에 추가:

```typescript
// ── Chat ──

export interface ChatSession {
  id: string;
  visitor_name: string | null;
  page: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "visitor" | "owner";
  content: string;
  created_at: string;
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add ChatSession and ChatMessage types"
```

---

## Task 4: Supabase 클라이언트 모듈

**Files:**
- Create: `lib/supabase.ts`

**Step 1: 클라이언트 작성**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 브라우저용 (anon key — 읽기 전용 + Realtime 구독)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버용 (service role — 쓰기 권한)
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add lib/supabase.ts
git commit -m "feat: add Supabase client module"
```

---

## Task 5: Telegram Bot API 헬퍼

**Files:**
- Create: `lib/telegram.ts`

**Step 1: 헬퍼 작성**

```typescript
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTelegramMessage(text: string): Promise<boolean> {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }),
  });
  return res.ok;
}

export function verifyTelegramWebhook(
  secretToken: string | null
): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!expected || !secretToken) return false;
  return secretToken === expected;
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add lib/telegram.ts
git commit -m "feat: add Telegram Bot API helper"
```

---

## Task 6: API Route — 메시지 전송 (`/api/chat/send`)

**Files:**
- Create: `app/api/chat/send/route.ts`

**Step 1: API Route 작성**

```typescript
import { NextRequest, NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase";
import { sendTelegramMessage } from "@/lib/telegram";

// 간단한 인메모리 rate limit (IP 기반, 분당 10건)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count++;
  return entry.count > 10;
}

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { session_id, content, page } = body as {
    session_id?: string;
    content?: string;
    page?: string;
  };

  // 입력 검증
  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Message content is required" },
      { status: 400 }
    );
  }
  if (content.length > 500) {
    return NextResponse.json(
      { error: "Message too long (max 500)" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();
  let activeSessionId = session_id;

  // 세션이 없으면 새로 생성
  if (!activeSessionId) {
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .insert({ page: page ?? null })
      .select("id")
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }
    activeSessionId = session.id;
  }

  // 메시지 저장
  const sanitized = content
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      session_id: activeSessionId,
      sender: "visitor",
      content: sanitized,
    })
    .select()
    .single();

  if (msgError || !message) {
    return NextResponse.json(
      { error: "Failed to save message" },
      { status: 500 }
    );
  }

  // Telegram 전송 (실패해도 메시지는 이미 저장됨)
  const telegramText =
    `<b>새 메시지</b> (${page ?? "unknown"})\n` +
    `세션: <code>${activeSessionId}</code>\n\n` +
    `${sanitized}`;

  sendTelegramMessage(telegramText).catch(() => {
    // Telegram 전송 실패 — 로그만 남기고 방문자에게는 정상 응답
  });

  return NextResponse.json({
    session_id: activeSessionId,
    message,
  });
}
```

**Step 2: 개발 서버 확인**

Run: `npm run dev`

수동 테스트 (별도 터미널):
```bash
curl -X POST http://localhost:3000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{"content": "테스트 메시지", "page": "/dev"}'
```

Expected: `{ "session_id": "uuid...", "message": { ... } }`

**Step 3: Commit**

```bash
git add app/api/chat/send/route.ts
git commit -m "feat: add /api/chat/send API route"
```

---

## Task 7: API Route — Telegram Webhook (`/api/chat/webhook`)

**Files:**
- Create: `app/api/chat/webhook/route.ts`

**Step 1: Webhook Route 작성**

Telegram 답변 구조: 운영자가 Telegram에서 메시지에 **reply**하면, `reply_to_message.text`에 원본 메시지가 포함된다. 여기서 세션 ID를 파싱한다.

```typescript
import { NextRequest, NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase";
import { verifyTelegramWebhook } from "@/lib/telegram";

interface TelegramUpdate {
  message?: {
    text?: string;
    reply_to_message?: {
      text?: string;
    };
  };
}

function extractSessionId(text: string): string | null {
  // "세션: <session-id>" 패턴에서 UUID 추출
  const match = text.match(
    /세션:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  // Webhook 검증
  const secretToken = req.headers.get("x-telegram-bot-api-secret-token");
  if (!verifyTelegramWebhook(secretToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;
  const replyText = update.message?.reply_to_message?.text;
  const answerText = update.message?.text;

  // reply가 아니거나 텍스트가 없으면 무시
  if (!replyText || !answerText) {
    return NextResponse.json({ ok: true });
  }

  const sessionId = extractSessionId(replyText);
  if (!sessionId) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceClient();

  // 응답 메시지 저장
  const { error } = await supabase.from("messages").insert({
    session_id: sessionId,
    sender: "owner",
    content: answerText,
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }

  // 세션 updated_at 갱신
  await supabase
    .from("sessions")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", sessionId);

  return NextResponse.json({ ok: true });
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add app/api/chat/webhook/route.ts
git commit -m "feat: add /api/chat/webhook for Telegram replies"
```

---

## Task 8: Supabase Realtime 구독 훅

**Files:**
- Create: `hooks/useChatMessages.ts`

**Step 1: 훅 작성**

```typescript
import { useState, useEffect, useCallback } from "react";

import { type ChatMessage } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function useChatMessages(sessionId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 기존 메시지 로드 (세션 복원 시)
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setMessages(data as ChatMessage[]);
        setIsLoading(false);
      });
  }, [sessionId]);

  // Realtime 구독
  useEffect(() => {
    if (!sessionId) return;

    const channel = supabase
      .channel(`messages:${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // 중복 방지
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const addOptimistic = useCallback((content: string) => {
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId ?? "",
      sender: "visitor",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
  }, [sessionId]);

  return { messages, isLoading, addOptimistic };
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

**Step 3: Commit**

```bash
git add hooks/useChatMessages.ts
git commit -m "feat: add useChatMessages hook with Realtime subscription"
```

---

## Task 9: ChatWidget 컴포넌트

**Files:**
- Create: `components/common/ChatWidget.tsx`

**Step 1: ChatWidget 작성**

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minus } from "lucide-react";

import { useChatMessages } from "@/hooks/useChatMessages";

const WELCOME_MESSAGE = "안녕하세요! 궁금한 점이 있으시면 편하게 물어보세요.";
const AWAY_MESSAGE =
  "현재 자리를 비웠습니다. 메시지를 남겨주시면 확인 후 연락드리겠습니다.";
const AWAY_DELAY_MS = 30_000;
const TOOLTIP_DELAY_MS = 3_000;
const SESSION_KEY = "chat-session-id";

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showAway, setShowAway] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const awayTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, addOptimistic } = useChatMessages(sessionId);

  // localStorage에서 세션 복원
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) setSessionId(stored);
  }, []);

  // 첫 방문 툴팁
  useEffect(() => {
    if (sessionId) return; // 이미 대화한 적 있으면 표시 안 함
    const timer = setTimeout(() => setShowTooltip(true), TOOLTIP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [sessionId]);

  // 메시지 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 새 메시지 뱃지 (채팅 닫혀있을 때)
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.sender === "owner") setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  // 부재중 타이머
  const resetAwayTimer = useCallback(() => {
    setShowAway(false);
    if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    awayTimerRef.current = setTimeout(() => setShowAway(true), AWAY_DELAY_MS);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setHasNewMessage(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput("");
    setIsSending(true);
    addOptimistic(trimmed);
    resetAwayTimer();

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          content: trimmed,
          page: pathname,
        }),
      });
      const data = await res.json();

      if (data.session_id && data.session_id !== sessionId) {
        setSessionId(data.session_id);
        localStorage.setItem(SESSION_KEY, data.session_id);
      }
    } catch {
      // 에러 시에도 optimistic 메시지는 유지
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* 툴팁 */}
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-16 right-0 whitespace-nowrap rounded-xl bg-card border border-card-border px-4 py-2 text-sm text-white/80 shadow-lg"
          >
            궁금한 점이 있으신가요?
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen ? (
          /* ── 채팅창 ── */
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-card-border bg-card shadow-2xl"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-2.5 w-2.5 rounded-full bg-chem" />
                  <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-chem/50" />
                </div>
                <span className="text-sm font-medium text-white">
                  실시간 상담
                </span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                  aria-label="최소화"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                  aria-label="닫기"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 메시지 영역 */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {/* 환영 메시지 */}
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                  <p className="text-sm text-white/80">{WELCOME_MESSAGE}</p>
                </div>
              </div>

              {isLoading && (
                <div className="text-center text-xs text-white/30">
                  이전 대화를 불러오는 중...
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "visitor" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
                      msg.sender === "visitor"
                        ? "rounded-tr-sm bg-chem/15 text-chem"
                        : "rounded-tl-sm bg-white/5 text-white/80"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                    <p className="mt-1 text-right font-mono text-[10px] opacity-40">
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {/* 부재중 메시지 */}
              {showAway && messages.length > 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white/5 px-3.5 py-2.5">
                    <p className="text-sm text-white/50">{AWAY_MESSAGE}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 입력창 */}
            <div className="border-t border-card-border p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                  maxLength={500}
                  className="flex-1 rounded-xl border border-card-border bg-dark px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-chem/30"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  className="rounded-xl bg-chem p-2.5 text-dark transition-opacity hover:opacity-80 disabled:opacity-30"
                  aria-label="전송"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── 플로팅 버블 ── */
          <motion.button
            key="bubble"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="relative rounded-full bg-chem p-4 text-dark shadow-lg shadow-chem/20 transition-shadow hover:shadow-chem/40"
            aria-label="채팅 열기"
          >
            <MessageCircle size={24} />
            {hasNewMessage && (
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-ai text-[10px] font-bold leading-4 text-white">
                !
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: 확인**

Run: `npx tsc --noEmit`
Expected: 에러 없음

브라우저에서 시각 확인:
- 오른쪽 하단에 초록색 버블이 보이는지
- 클릭하면 채팅창이 열리는지
- 입력 → 전송이 동작하는지

**Step 3: Commit**

```bash
git add components/common/ChatWidget.tsx
git commit -m "feat: add ChatWidget component with Telegram integration"
```

---

## Task 10: 레이아웃에 ChatWidget 통합

**Files:**
- Modify: `app/layout.tsx`

**Step 1: import 추가 및 ChatWidget 배치**

`app/layout.tsx` 상단 import에 추가:
```typescript
import { ChatWidget } from "@/components/common/ChatWidget";
```

`<body>` 안에서 `<ScrollToTop />` 아래에 추가:
```tsx
<ScrollToTop />
<ChatWidget />
```

**Step 2: 확인**

브라우저에서 모든 페이지(`/`, `/dev`, `/hr`, `/hire`)에서 채팅 버블이 보이는지 확인.

**Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: integrate ChatWidget into root layout"
```

---

## Task 11: Telegram Bot 설정 및 Webhook 등록

**이 태스크는 코드가 아닌 설정 작업입니다.**

**Step 1: Telegram Bot 생성**

1. 텔레그램에서 `@BotFather` 검색 → `/newbot` 명령
2. 봇 이름과 username 설정
3. `TELEGRAM_BOT_TOKEN` 받기

**Step 2: Chat ID 확인**

1. 생성한 봇에게 아무 메시지 전송
2. 브라우저에서 접속:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. `result[0].message.chat.id` 값이 `TELEGRAM_CHAT_ID`

**Step 3: .env.local 작성**

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
TELEGRAM_WEBHOOK_SECRET=my-super-secret-123
```

**Step 4: Webhook 등록 (배포 후)**

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.vercel.app/api/chat/webhook",
    "secret_token": "my-super-secret-123"
  }'
```

Expected: `{"ok": true, "result": true}`

---

## Task 12: E2E 수동 테스트

**Step 1: 로컬 방문자 → Telegram 흐름**

1. `npm run dev`로 개발 서버 실행
2. 브라우저에서 채팅 버블 클릭
3. "테스트 메시지" 입력 후 전송
4. Supabase Table Editor에서 sessions, messages 레코드 확인
5. 텔레그램에서 봇 메시지 수신 확인

**Step 2: Telegram → 방문자 흐름 (배포 후)**

1. 텔레그램에서 봇 메시지에 reply
2. 브라우저 채팅창에 실시간 응답 표시 확인
3. Supabase messages 테이블에 sender='owner' 레코드 확인

**Step 3: 부재중 메시지 확인**

1. 메시지 전송 후 30초 대기
2. "현재 자리를 비웠습니다" 메시지 표시 확인

**Step 4: 세션 복원 확인**

1. 채팅 후 페이지 새로고침
2. 채팅 열었을 때 이전 메시지가 복원되는지 확인

---

## 의존성 그래프

```
Task 1 (의존성 설치)
  └→ Task 2 (DB 스키마) — 병렬 가능
  └→ Task 3 (타입)
      └→ Task 4 (Supabase 클라이언트)
      └→ Task 5 (Telegram 헬퍼)
          └→ Task 6 (API: send)
          └→ Task 7 (API: webhook)
      └→ Task 8 (useChatMessages 훅)
          └→ Task 9 (ChatWidget)
              └→ Task 10 (레이아웃 통합)
                  └→ Task 11 (Bot 설정)
                      └→ Task 12 (E2E 테스트)
```
