"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

export function RunawayButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [escapeCount, setEscapeCount] = useState(0);
  const [isCaught, setIsCaught] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const escape = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const btnW = 180;
    const btnH = 48;
    const padX = 20;
    const padY = 20;

    const maxX = rect.width - btnW - padX * 2;
    const maxY = rect.height - btnH - padY * 2;

    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;

    setPos({ x: newX, y: newY });
    setEscapeCount((c) => c + 1);
  }, []);

  const taunts = [
    "여기 있는데?",
    "너무 느려~",
    "ㅋㅋㅋㅋ",
    "거의 다 왔어!",
    "한 번만 더!",
    "이번엔 진짜 가만히...",
    "놉!",
    "아깝다~",
    "손가락이 느려",
    "진짜 잡을 수 있어?",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
            Experiment #000
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            클릭 불가능한 버튼
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            이 버튼을 클릭할 수 있다면, 선물을 보내드립니다
          </p>
        </motion.div>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-card-border bg-card md:h-96"
      >
        {/* 도트 그리드 배경 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(57,255,20,0.6) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <AnimatePresence mode="wait">
          {isCaught ? (
            /* 성공 화면 */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-auto w-full max-w-sm px-6 text-center"
            >
              {!isSubmitted ? (
                <>
                  <div className="text-5xl">🎉</div>
                  <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                    대단해요!
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {escapeCount}번 도망간 버튼을 잡았습니다
                  </p>
                  <p className="mt-1 text-sm text-gray-300">
                    이메일을 알려주시면 선물을 보내드릴게요
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="flex-1 rounded-lg border border-card-border bg-dark px-4 py-2.5 font-mono text-sm text-white placeholder:text-gray-600 focus:border-mad/50 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg bg-mad px-5 py-2.5 text-sm font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
                      >
                        <Send size={14} />
                        보내기
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="text-5xl">📦</div>
                  <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                    접수 완료!
                  </h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {email}로 선물을 보내드릴게요
                  </p>
                  <p className="mt-1 font-mono text-xs text-gray-600">
                    (진짜로요)
                  </p>
                </>
              )}
            </motion.div>
          ) : (
            /* 도망가는 버튼 */
            <motion.button
              key="button"
              animate={{ x: pos.x, y: pos.y }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              onMouseEnter={escape}
              onTouchStart={escape}
              onClick={() => setIsCaught(true)}
              className="relative z-10 cursor-pointer rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(57,255,20,0.4)]"
            >
              클릭하세요
            </motion.button>
          )}
        </AnimatePresence>

        {/* 도발 메시지 */}
        {!isCaught && escapeCount > 0 && (
          <motion.p
            key={escapeCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 font-mono text-xs text-mad/60"
          >
            {taunts[escapeCount % taunts.length]}
            <span className="ml-2 text-gray-600">({escapeCount}회 도주)</span>
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
