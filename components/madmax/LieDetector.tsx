"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanEye } from "lucide-react";

interface QuestionResult {
  question: string;
  answer: boolean;
  responseTime: number;
  lieChance: number;
}

const questions = [
  "오늘 기분이 좋으신가요?",
  "어제 운동을 하셨나요?",
  "지금 이 질문에 솔직하게 답하고 있나요?",
  "올해 새해 다짐을 지키고 있나요?",
  "이 페이지가 재밌나요?",
  "지금 야근 중인가요?",
  "어제 8시간 이상 잤나요?",
  "냉장고에 먹을 게 있나요?",
  "이번 달 저축 목표를 달성했나요?",
  "지금 다른 탭에서 유튜브 켜놓고 있나요?",
];

function generateLieChance(responseTime: number): number {
  if (responseTime < 500) return 15 + Math.random() * 20;
  if (responseTime < 1000) return 25 + Math.random() * 25;
  if (responseTime < 2000) return 40 + Math.random() * 30;
  if (responseTime < 3000) return 55 + Math.random() * 30;
  return 70 + Math.random() * 25;
}

function getVerdict(chance: number): { text: string; color: string } {
  if (chance < 30) return { text: "진실", color: "text-mad" };
  if (chance < 60) return { text: "의심", color: "text-amber" };
  return { text: "거짓말", color: "text-chem" };
}

export function LieDetector() {
  const [phase, setPhase] = useState<"intro" | "testing" | "analyzing" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const questionStartRef = useRef(Date.now());

  const startTest = useCallback(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, 5));
    setResults([]);
    setCurrentQ(0);
    setPhase("testing");
    questionStartRef.current = Date.now();
  }, []);

  const answer = useCallback(
    (ans: boolean) => {
      const responseTime = Date.now() - questionStartRef.current;
      const lieChance = generateLieChance(responseTime);

      const result: QuestionResult = {
        question: selectedQuestions[currentQ],
        answer: ans,
        responseTime,
        lieChance: Math.round(lieChance * 10) / 10,
      };

      const newResults = [...results, result];
      setResults(newResults);

      if (currentQ + 1 >= selectedQuestions.length) {
        setPhase("analyzing");
        setTimeout(() => setPhase("result"), 2500);
      } else {
        setCurrentQ((c) => c + 1);
        questionStartRef.current = Date.now();
      }
    },
    [currentQ, results, selectedQuestions],
  );

  const avgLieChance =
    results.length > 0
      ? Math.round(
          (results.reduce((sum, r) => sum + r.lieChance, 0) / results.length) *
            10,
        ) / 10
      : 0;

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
            Experiment #003
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            거짓말 탐지기
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            응답 시간을 분석하여 거짓말 확률을 측정합니다 (과학적 근거 없음)
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
          {/* 인트로 */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center text-center px-6"
            >
              <ScanEye size={40} className="text-mad/60" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                MADMAX 거짓말 탐지 시스템 v2.4
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                5개의 질문에 예/아니오로 답하세요. 응답 시간을 밀리초 단위로
                분석하여 거짓말 확률을 판정합니다.
              </p>
              <div className="mt-4 rounded-lg border border-card-border bg-dark/50 px-4 py-2">
                <p className="font-mono text-[10px] text-gray-600">
                  ⚠ 정확도: 99.7% (자체 측정)
                </p>
              </div>
              <button
                onClick={startTest}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                테스트 시작
              </button>
            </motion.div>
          )}

          {/* 질문 */}
          {phase === "testing" && (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              {/* 진행률 */}
              <div className="mb-8 flex gap-1.5">
                {selectedQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i < currentQ
                        ? "bg-mad"
                        : i === currentQ
                          ? "bg-mad/50"
                          : "bg-card-border"
                    }`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] text-gray-600">
                질문 {currentQ + 1}/{selectedQuestions.length}
              </p>

              <h3 className="mt-4 max-w-md font-playfair text-xl font-bold text-white md:text-2xl">
                {selectedQuestions[currentQ]}
              </h3>

              {/* 스캐닝 인디케이터 */}
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-4 font-mono text-[10px] text-mad/40"
              >
                ● 응답 시간 측정 중...
              </motion.div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => answer(true)}
                  className="rounded-xl border border-mad/30 bg-mad/5 px-10 py-3 font-semibold text-mad transition-all duration-200 hover:bg-mad/10"
                >
                  예
                </button>
                <button
                  onClick={() => answer(false)}
                  className="rounded-xl border border-card-border bg-dark/50 px-10 py-3 font-semibold text-gray-300 transition-all duration-200 hover:bg-card-border/50"
                >
                  아니오
                </button>
              </div>
            </motion.div>
          )}

          {/* 분석 중 */}
          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <ScanEye size={40} className="text-mad" />
              </motion.div>
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                분석 중...
              </h3>
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-2 font-mono text-xs text-mad/60"
              >
                미세 표정 분석 · 응답 패턴 매칭 · AI 심리 프로파일링
              </motion.p>
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
              {/* 종합 점수 */}
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
                  종합 거짓말 확률
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className={`mt-2 font-mono text-5xl font-bold ${getVerdict(avgLieChance).color}`}
                >
                  {avgLieChance}%
                </motion.div>
                <p
                  className={`mt-1 font-mono text-sm font-bold ${getVerdict(avgLieChance).color}`}
                >
                  판정: {getVerdict(avgLieChance).text}
                </p>
              </div>

              {/* 질문별 결과 */}
              <div className="mx-auto mt-6 max-w-lg space-y-2">
                {results.map((r, i) => {
                  const verdict = getVerdict(r.lieChance);
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center justify-between gap-4 rounded-lg border border-card-border bg-dark/50 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-300">
                          {r.question}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] text-gray-600">
                          응답: {r.answer ? "예" : "아니오"} ·{" "}
                          {r.responseTime}ms
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono text-sm font-bold ${verdict.color}`}
                        >
                          {r.lieChance}%
                        </span>
                        <p
                          className={`font-mono text-[9px] ${verdict.color}`}
                        >
                          {verdict.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 면책조항 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mx-auto mt-6 max-w-lg rounded-lg border border-card-border bg-dark/30 p-4 text-center"
              >
                <p className="font-mono text-[10px] text-gray-600">
                  ⚠ 본 결과는 아무런 과학적 근거가 없습니다. 응답 시간과
                  거짓말은 상관관계가 없으며, 모든 수치는 랜덤입니다. 진지하게
                  받아들이지 마세요.
                </p>
              </motion.div>

              <div className="mt-6 text-center">
                <button
                  onClick={startTest}
                  className="rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
                >
                  다시 테스트
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
