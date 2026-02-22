"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";

import { useChatWidget } from "@/hooks/useChatWidget";

export function ChatWidget() {
  const {
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
    welcomeMessage,
    handleNewChat,
    handleOpen,
    handleClose,
    handleSend,
    handleKeyDown,
    formatTime,
  } = useChatWidget();

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
                  onClick={handleClose}
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
                  <p className="text-sm text-white/80">{welcomeMessage}</p>
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
