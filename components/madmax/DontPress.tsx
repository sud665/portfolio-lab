"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export function DontPress() {
  const [phase, setPhase] = useState<"idle" | "chaos" | "saved" | "exploded">(
    "idle",
  );
  const [countdown, setCountdown] = useState(10);
  const [cancelPos, setCancelPos] = useState({ top: 0, left: 0 });
  const [glitchText, setGlitchText] = useState("");
  const [pressCount, setPressCount] = useState(0);

  const warningTexts = [
    "경고: 시스템 불안정 감지",
    "ERROR: 메모리 오버플로우",
    "FATAL: 코어 파일 손상됨",
    "WARNING: 자폭 시퀀스 활성화",
    "CRITICAL: 복구 불가능한 오류",
    "⚠ 남은 시간 내에 취소 버튼을 찾으세요",
  ];

  const triggerChaos = useCallback(() => {
    setPressCount((c) => c + 1);
    if (phase !== "idle") return;

    setPhase("chaos");
    setCountdown(10);

    const top = 20 + Math.random() * 60;
    const left = 10 + Math.random() * 80;
    setCancelPos({ top, left });
  }, [phase]);

  useEffect(() => {
    if (phase !== "chaos") return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setPhase("exploded");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "chaos") return;

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * warningTexts.length);
      setGlitchText(warningTexts[idx]);
    }, 800);

    return () => clearInterval(interval);
  }, [phase]);

  const handleCancel = () => {
    setPhase("saved");
  };

  const handleReset = () => {
    setPhase("idle");
    setCountdown(10);
    setGlitchText("");
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
            Experiment #002
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            절대 누르지 마세요
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            이 버튼은 누르면 안 됩니다. 진짜로요.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
        style={{ minHeight: "24rem" }}
      >
        <AnimatePresence mode="wait">
          {/* 기본 상태 */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center"
            >
              {pressCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 font-mono text-xs text-gray-600"
                >
                  다시 누를 건가요? ({pressCount}번째)
                </motion.p>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={triggerChaos}
                className="rounded-2xl border-2 border-chem/50 bg-chem/10 px-12 py-6 font-playfair text-xl font-bold text-chem transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(216,17,89,0.2)]"
              >
                절대 누르지 마세요
              </motion.button>
              <p className="mt-4 font-mono text-xs text-gray-600">
                (진짜 누르면 안 돼요)
              </p>
            </motion.div>
          )}

          {/* 카오스 상태 */}
          {phase === "chaos" && (
            <motion.div
              key="chaos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-96"
            >
              {/* 화면 흔들림 */}
              <motion.div
                animate={{
                  x: [0, -3, 3, -2, 2, 0],
                  rotate: [0, -0.5, 0.5, -0.3, 0.3, 0],
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="flex h-full flex-col items-center justify-center"
              >
                {/* 카운트다운 */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-center"
                >
                  <AlertTriangle
                    size={40}
                    className="mx-auto mb-4 text-chem"
                  />
                  <div className="font-mono text-6xl font-bold text-chem">
                    {countdown}
                  </div>
                  <p className="mt-2 font-mono text-sm text-chem/80">
                    자폭까지 남은 시간
                  </p>
                </motion.div>

                {/* 경고 메시지 */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={glitchText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6 font-mono text-xs text-chem/60"
                  >
                    {glitchText}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* 숨겨진 취소 버튼 */}
              <button
                onClick={handleCancel}
                className="absolute font-mono text-[9px] text-gray-700 transition-colors duration-200 hover:text-mad"
                style={{
                  top: `${cancelPos.top}%`,
                  left: `${cancelPos.left}%`,
                }}
              >
                [취소]
              </button>

              {/* 스캔라인 효과 */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(216,17,89,0.3) 2px, rgba(216,17,89,0.3) 4px)",
                }}
              />
            </motion.div>
          )}

          {/* 구출됨 */}
          {phase === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-96 flex-col items-center justify-center text-center"
            >
              <ShieldCheck size={48} className="text-mad" />
              <h3 className="mt-4 font-playfair text-2xl font-bold text-mad">
                위기 해제!
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {countdown}초 남기고 취소 버튼을 찾았습니다
              </p>
              <p className="mt-1 font-mono text-xs text-gray-600">
                눈이 좋으시군요
              </p>
              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 도전
              </button>
            </motion.div>
          )}

          {/* 폭발 */}
          {phase === "exploded" && (
            <motion.div
              key="exploded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-96 flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 3, 1] }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-6xl"
              >
                💥
              </motion.div>
              <h3 className="mt-4 font-playfair text-2xl font-bold text-chem">
                BOOM
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                그러니까 누르지 말라고 했잖아요
              </p>
              <p className="mt-1 font-mono text-xs text-gray-600">
                취소 버튼 못 찾으셨죠?
              </p>
              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-chem/30 hover:text-chem"
              >
                부활하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
