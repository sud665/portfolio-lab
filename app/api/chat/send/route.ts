import { NextRequest, NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";
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
    .replace(/&/g, "&amp;")
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

  // Telegram 전송 (실패해도 메시지는 이미 저장됨 — 방문자에게는 정상 응답)
  const telegramText =
    `<b>새 메시지</b> (${page ?? "unknown"})\n` +
    `세션: <code>${activeSessionId}</code>\n\n` +
    `${sanitized}`;

  await sendTelegramMessage(telegramText);

  return NextResponse.json({
    session_id: activeSessionId,
    message,
  });
}
