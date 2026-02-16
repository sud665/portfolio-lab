import { useState, useEffect, useCallback } from "react";

import { type ChatMessage } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

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
    createClient()
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

    const client = createClient();
    const channel = client
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
            // 중복 방지: 이미 같은 ID가 있으면 무시
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            // optimistic 메시지 교체: temp-* ID를 실제 메시지로 대체
            const tempIdx = prev.findIndex(
              (m) =>
                m.id.startsWith("temp-") &&
                m.sender === newMsg.sender &&
                m.content === newMsg.content
            );
            if (tempIdx !== -1) {
              const next = [...prev];
              next[tempIdx] = newMsg;
              return next;
            }
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [sessionId]);

  const addOptimistic = useCallback(
    (content: string) => {
      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        session_id: sessionId ?? "",
        sender: "visitor",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
    },
    [sessionId]
  );

  return { messages, isLoading, addOptimistic };
}
