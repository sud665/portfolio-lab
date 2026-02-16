"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";

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

  // 부재중 타이머
  const resetAwayTimer = useCallback(() => {
    setShowAway(false);
    if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    awayTimerRef.current = setTimeout(() => setShowAway(true), AWAY_DELAY_MS);
  }, []);

  // 부재중 타이머 cleanup
  useEffect(() => {
    return () => {
      if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
    };
  }, []);

  const handleNewChat = () => {
    localStorage.removeItem(SESSION_KEY);
    setSessionId(null);
    setShowAway(false);
    setInput("");
    if (awayTimerRef.current) clearTimeout(awayTimerRef.current);
  };

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
                  onClick={handleNewChat}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
                  aria-label="새 대화"
                  title="새 대화"
                >
                  <RotateCcw size={14} />
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
