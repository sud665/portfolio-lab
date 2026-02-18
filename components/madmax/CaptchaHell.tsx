"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import {
  useCaptchaHell,
  GRID_ITEMS,
  ABSTRACT_ITEMS,
  DISTORTED_TEXT,
  CAT_NAMES,
} from "@/hooks/useCaptchaHell";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CaptchaHell() {
  const {
    phase,
    level,
    currentLevel,
    totalLevels,
    selectedCells,
    textInput,
    setTextInput,
    feedback,
    levelResults,
    humanScore,
    start,
    toggleCell,
    submitAnswer,
  } = useCaptchaHell();

  const gridItems = level?.type === "grid" ? GRID_ITEMS : ABSTRACT_ITEMS;

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
            Experiment #010
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            캡차 지옥
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            로봇이 아님을 증명하세요. 증명할 수 있다면요.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
        style={{ minHeight: "28rem" }}
      >
        <AnimatePresence mode="wait">
          {/* 시작 */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center px-6 py-16 text-center"
              style={{ minHeight: "28rem" }}
            >
              <ShieldCheck size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                MADMAX CAPTCHA v3.7
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                5단계의 보안 인증을 통과하여 인간임을 증명하세요.
                난이도가 점점 올라갑니다.
              </p>
              <div className="mt-3 rounded-lg border border-card-border bg-dark/50 px-4 py-2">
                <p className="font-mono text-[10px] text-gray-600">
                  ⚠ 인간 판별 정확도: 47% (자체 측정)
                </p>
              </div>
              <button
                onClick={start}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                인증 시작
              </button>
            </motion.div>
          )}

          {/* 플레이 */}
          {phase === "playing" && level && (
            <motion.div
              key={`level-${currentLevel}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex flex-col items-center px-6 py-8 text-center"
              style={{ minHeight: "28rem" }}
            >
              {/* 진행률 */}
              <div className="mb-4 flex gap-1.5">
                {Array.from({ length: totalLevels }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i < currentLevel
                        ? "bg-mad"
                        : i === currentLevel
                          ? "bg-mad/50"
                          : "bg-card-border"
                    }`}
                  />
                ))}
              </div>

              <span className="rounded border border-card-border bg-dark/50 px-3 py-1 font-mono text-[10px] text-gray-500">
                Level {currentLevel + 1}/{totalLevels} · {level.description}
              </span>

              {/* 질문 */}
              <h3 className="mt-4 max-w-md font-playfair text-base font-bold text-white md:text-lg">
                {level.instruction}
              </h3>

              {/* 그리드 선택 (level 1, 2) */}
              {(level.type === "grid" || level.type === "abstract") && (
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {gridItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => toggleCell(idx)}
                      className={`flex h-20 w-20 items-center justify-center rounded-lg border text-3xl transition-all duration-200 ${
                        selectedCells.includes(idx)
                          ? "border-mad bg-mad/10 shadow-[0_0_12px_rgba(57,255,20,0.15)]"
                          : "border-card-border bg-dark/50 hover:border-gray-500"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {/* 왜곡 텍스트 입력 (level 3) */}
              {level.type === "distorted" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="rounded-lg border border-card-border bg-dark/50 px-8 py-4">
                    <p
                      className="select-none font-mono text-3xl font-bold text-mad/70"
                      style={{
                        transform: "rotate(-5deg) scaleY(-1)",
                        letterSpacing: "0.3em",
                        textShadow: "2px 2px 4px rgba(57,255,20,0.2)",
                      }}
                    >
                      {DISTORTED_TEXT}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="위 텍스트를 입력하세요"
                    className="w-48 rounded-lg border border-card-border bg-dark px-4 py-3 text-center font-mono text-sm text-white placeholder:text-gray-600 focus:border-mad/50 focus:outline-none"
                  />
                </div>
              )}

              {/* 수학 문제 (level 4) */}
              {level.type === "math" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="rounded-lg border border-card-border bg-dark/50 px-6 py-4">
                    <p className="font-mono text-4xl font-bold text-mad/70">
                      π = ?
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-gray-600">
                      형식: 3.XXXXXXX (소수점 아래 7자리)
                    </p>
                  </div>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="3.1415..."
                    className="w-48 rounded-lg border border-card-border bg-dark px-4 py-3 text-center font-mono text-sm text-white placeholder:text-gray-600 focus:border-mad/50 focus:outline-none"
                  />
                </div>
              )}

              {/* 불가능 문제 (level 5) */}
              {level.type === "impossible" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="rounded-lg border border-card-border bg-dark/50 p-6">
                    <span className="text-6xl">🐱</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {CAT_NAMES.map((name) => (
                      <button
                        key={name}
                        onClick={() => {
                          setTextInput(name);
                          setTimeout(submitAnswer, 100);
                        }}
                        className="rounded-lg border border-card-border bg-dark/50 px-4 py-2 font-mono text-sm text-gray-300 transition-colors hover:border-mad/30 hover:text-mad"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 피드백 */}
              <AnimatePresence>
                {feedback && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 font-mono text-sm ${
                      feedback.includes("정답") || feedback.includes("통과")
                        ? "text-mad"
                        : feedback.includes("틀") || feedback.includes("다시")
                          ? "text-chem"
                          : "text-gray-400"
                    }`}
                  >
                    {feedback}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* 제출 버튼 (그리드/텍스트 레벨용) */}
              {level.type !== "impossible" && (
                <button
                  onClick={submitAnswer}
                  className="mt-6 rounded-xl border border-mad/30 bg-mad/10 px-8 py-3 font-semibold text-mad transition-all duration-200 hover:bg-mad/20"
                >
                  확인
                </button>
              )}
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
                  인간 확인 완료
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  className="mt-2 font-mono text-5xl font-bold text-amber"
                >
                  {humanScore}%
                </motion.div>
                <p className="mt-1 font-mono text-sm text-gray-400">
                  당신이 인간일 확률
                </p>
              </div>

              {/* 레벨별 결과 */}
              <div className="mx-auto mt-6 max-w-md space-y-2">
                {levelResults.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center justify-between rounded-lg border border-card-border bg-dark/50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm text-gray-300">
                        Lv.{r.level.id}: {r.level.description}
                      </p>
                      <p className="font-mono text-[10px] text-gray-600">
                        시도: {r.attempts}회
                      </p>
                    </div>
                    <span className={`font-mono text-sm font-bold ${r.passed ? "text-mad" : "text-chem"}`}>
                      {r.passed ? "PASS" : "FAIL"}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* 면책 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mx-auto mt-6 max-w-md rounded-lg border border-card-border bg-dark/30 p-4 text-center"
              >
                <p className="font-mono text-[10px] text-gray-600">
                  ⚠ 본 캡차 시스템은 실제 로봇 판별 능력이 없습니다.
                  인간 확률 수치는 랜덤이며, 고양이 이름도 저희가 모릅니다.
                </p>
              </motion.div>

              <div className="mt-6 text-center">
                <button
                  onClick={start}
                  className="rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
                >
                  다시 인증
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
