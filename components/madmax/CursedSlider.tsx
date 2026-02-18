"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { useCursedSlider } from "@/hooks/useCursedSlider";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CursedSlider() {
  const {
    phase,
    round,
    currentRound,
    totalRounds,
    rawValue,
    displayValue,
    isLocked,
    scores,
    finalGrade,
    handleChange,
    updateNoise,
    start,
    lockIn,
  } = useCursedSlider();

  // 노이즈 업데이트 인터벌
  useEffect(() => {
    if (phase !== "playing" || !round) return;
    if (round.curse !== "noisy" && round.curse !== "all") return;

    const interval = setInterval(updateNoise, 100);
    return () => clearInterval(interval);
  }, [phase, round, updateNoise]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
            Experiment #008
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            저주받은 슬라이더
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            목표 값에 슬라이더를 맞추세요. 단, 슬라이더가 정상이 아닙니다.
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
          {/* 시작 */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <SlidersHorizontal size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                UX 내성 테스트
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                5라운드에 걸쳐 목표 값에 슬라이더를 맞추세요.
                매 라운드마다 새로운 저주가 걸립니다.
              </p>
              <button
                onClick={start}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                도전 시작
              </button>
            </motion.div>
          )}

          {/* 플레이 */}
          {phase === "playing" && round && (
            <motion.div
              key={`round-${currentRound}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              {/* 진행률 */}
              <div className="mb-4 flex gap-1.5">
                {Array.from({ length: totalRounds }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i < currentRound
                        ? "bg-mad"
                        : i === currentRound
                          ? "bg-mad/50"
                          : "bg-card-border"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-gray-600">
                  Round {currentRound + 1}/{totalRounds}
                </span>
                <span className="rounded border border-card-border bg-dark/50 px-2 py-0.5 font-mono text-[10px] text-chem">
                  저주: {round.description}
                </span>
                <span className="font-mono text-[10px] text-gray-600">
                  {round.difficulty}
                </span>
              </div>

              {/* 목표 값 */}
              <div className="mt-4">
                <p className="font-mono text-[10px] text-gray-500">목표</p>
                <p className="font-mono text-3xl font-bold text-amber">
                  {round.target}
                </p>
              </div>

              {/* 현재 값 */}
              <motion.div
                animate={
                  round.curse === "noisy" || round.curse === "all"
                    ? { x: [0, -1, 1, 0] }
                    : {}
                }
                transition={
                  round.curse === "noisy" || round.curse === "all"
                    ? { duration: 0.1, repeat: Infinity }
                    : {}
                }
                className="mt-2"
              >
                <p className="font-mono text-[10px] text-gray-500">현재</p>
                <p className={`font-mono text-3xl font-bold ${isLocked ? (Math.abs(displayValue - round.target) <= 2 ? "text-mad" : "text-chem") : "text-white"}`}>
                  {displayValue}
                </p>
              </motion.div>

              {/* 슬라이더 */}
              <div className="mt-6 w-full max-w-sm">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rawValue}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  disabled={isLocked}
                  className="w-full cursor-pointer accent-mad"
                />
              </div>

              {/* 확정 버튼 */}
              <button
                onClick={lockIn}
                disabled={isLocked}
                className={`mt-6 rounded-xl border px-8 py-3 font-semibold transition-all duration-200 ${
                  isLocked
                    ? "border-card-border text-gray-600"
                    : "border-mad/30 bg-mad/10 text-mad hover:bg-mad/20"
                }`}
              >
                {isLocked ? "다음 라운드..." : "이 값으로 확정!"}
              </button>
            </motion.div>
          )}

          {/* 결과 */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-8 md:px-8"
            >
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
                  UX 내성 등급
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className={`mt-2 font-mono text-6xl font-bold ${finalGrade.color}`}
                >
                  {finalGrade.grade}
                </motion.div>
              </div>

              {/* 라운드별 결과 */}
              <div className="mx-auto mt-6 max-w-md space-y-2">
                {scores.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-card-border bg-dark/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-gray-300">
                        R{s.round.id}: {s.round.description}
                      </p>
                      <p className="font-mono text-[10px] text-gray-600">
                        목표: {s.round.target} · 결과: {s.value} · 오차: ±{s.diff}
                      </p>
                    </div>
                    <span className={`font-mono text-lg font-bold ${
                      s.grade === "S" ? "text-mad" : s.grade === "A" ? "text-mad-light" : s.grade === "B" ? "text-amber" : "text-gray-500"
                    }`}>
                      {s.grade}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={start}
                  className="rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
                >
                  다시 도전
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
