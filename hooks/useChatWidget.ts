import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useChatMessages } from "@/hooks/useChatMessages";

const WELCOME_MESSAGE = "안녕하세요! 궁금한 점이 있으시면 편하게 물어보세요.";
const TOOLTIP_DELAY_MS = 3_000;
const SESSION_KEY = "chat-session-id";

export function useChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, addOptimistic } = useChatMessages(sessionId);

  // localStorage에서 세션 복원
  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) setSessionId(stored);
  }, []);

  // 첫 방문 툴팁
  useEffect(() => {
    if (sessionId) return;
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


  const handleNewChat = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setInput("");
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
    setHasNewMessage(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setInput("");
    setIsSending(true);
    addOptimistic(trimmed);
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

  return {
    isOpen,
    input,
    setInput,
    showTooltip,
    isSending,
    hasNewMessage,
    messages,
    isLoading,
    messagesEndRef,
    inputRef,
    welcomeMessage: WELCOME_MESSAGE,
    handleNewChat,
    handleOpen,
    handleClose,
    handleSend,
    handleKeyDown,
    formatTime,
  };
}
