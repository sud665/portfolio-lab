import { NextRequest, NextResponse } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";
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
