"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Square } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "playing" | "result";

interface Round {
  id: number;
  cssOption: string;
  description: string;
  reaction: string;
}

const ROUNDS: Round[] = [
  { id: 1, cssOption: "margin: 0 auto", description: "클래식한 중앙 정렬", reaction: "왼쪽으로 도망" },
  { id: 2, cssOption: "display: flex; justify-content: center; align-items: center", description: "Flexbox", reaction: "위로 날아감" },
  { id: 3, cssOption: "display: grid; place-items: center", description: "Grid", reaction: "회전하며 빙글빙글" },
  { id: 4, cssOption: "position: absolute; top: 50%; left: 50%", description: "Position Absolute", reaction: "4개로 분열" },
  { id: 5, cssOption: "/* 포기 */", description: "포기", reaction: "완벽하게 중앙 정렬" },
];

const TITLES = ["CSS 입문자", "CSS 견습생", "CSS 수련생", "CSS 전사", "CSS 마스터"];

export function CenterDiv() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentRound, setCurrentRound] = useState(0);
  const [divAnimation, setDivAnimation] = useState<string | null>(null);
  const [splitMode, setSplitMode] = useState(false);
  const [centered, setCentered] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleStart = () => {
    setPhase("playing");
    setCurrentRound(0);
    setDivAnimation(null);
    setSplitMode(false);
    setCentered(false);
    setAttempts(0);
  };

  const handleApplyCSS = useCallback(() => {
    const round = ROUNDS[currentRound];
    if (!round) return;
    setAttempts((a) => a + 1);

    switch (round.id) {
      case 1:
        setDivAnimation("runLeft");
        break;
      case 2:
        setDivAnimation("flyUp");
        break;
      case 3:
        setDivAnimation("spin");
        break;
      case 4:
        setSplitMode(true);
        setDivAnimation("split");
        break;
      case 5:
        setCentered(true);
        setDivAnimation("centered");
        break;
    }

    setTimeout(() => {
      if (currentRound + 1 >= ROUNDS.length) {
        setTimeout(() => setPhase("result"), 1000);
      } else {
        setCurrentRound((c) => c + 1);
        setDivAnimation(null);
        setSplitMode(false);
        setCentered(false);
      }
    }, 2000);
  }, [currentRound]);

  const getGrade = () => {
    const grades = [
      { min: 5, grade: "S", title: "div 속삭이는 자", color: "text-mad" },
      { min: 4, grade: "A", title: "CSS 연금술사", color: "text-mad-light" },
      { min: 3, grade: "B", title: "Stack Overflow 탐험가", color: "text-amber" },
      { min: 0, grade: "C", title: "!important 남용러", color: "text-gray-500" },
    ];
    return grades[0]!;
  };

  const grade = getGrade();
  const round = ROUNDS[currentRound];

  // div 애니메이션 variants
  const divVariants = {
    runLeft: { x: -200, opacity: 0.5, transition: { duration: 0.8, ease: EASE } },
    flyUp: { y: -200, opacity: 0, transition: { duration: 0.8, ease: EASE } },
    spin: { rotate: 720, scale: 0.5, transition: { duration: 1.5, ease: "linear" as const } },
    split: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
    centered: { scale: [1, 1.2, 1], transition: { duration: 0.6, ease: EASE } },
  };

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
            Experiment #012
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            div 중앙 정렬 챌린지
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            CSS로 div를 중앙에 놓으세요. 가능하다면요.
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
              <Square size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                The Centering Challenge
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                5가지 CSS 기법으로 div를 중앙에 놓아보세요.
                div가 순순히 따라줄까요?
              </p>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                챌린지 시작
              </button>
            </motion.div>
          )}

          {/* 플레이 */}
          {phase === "playing" && round && (
            <motion.div
              key={`round-${currentRound}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6"
            >
              {/* 진행률 */}
              <div className="mb-4 flex gap-1.5">
                {ROUNDS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i < currentRound ? "bg-mad" : i === currentRound ? "bg-mad/50" : "bg-card-border"
                    }`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] text-gray-600">
                Round {currentRound + 1}/{ROUNDS.length}
              </p>

              {/* CSS 코드 표시 */}
              <div className="mt-3 rounded-lg border border-card-border bg-dark/80 px-4 py-2">
                <code className="font-mono text-xs text-code">{round.cssOption}</code>
              </div>

              {/* div 영역 */}
              <div className="relative mt-4 h-40 w-full max-w-sm rounded-lg border border-dashed border-card-border bg-dark/30">
                {/* 중앙 가이드라인 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-px bg-card-border/30" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-px w-full bg-card-border/30" />
                </div>

                {/* 대상 div */}
                {!splitMode ? (
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={divAnimation ? divVariants[divAnimation as keyof typeof divVariants] : {}}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded border-2 ${centered ? "border-mad bg-mad/20" : "border-amber bg-amber/10"}`}>
                      <span className="font-mono text-[10px] font-bold text-white">div</span>
                    </div>
                  </motion.div>
                ) : (
                  /* 분열 모드 */
                  <>
                    {[
                      { x: -40, y: -30 },
                      { x: 40, y: -30 },
                      { x: -40, y: 30 },
                      { x: 40, y: 30 },
                    ].map((pos, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2"
                        initial={{ x: "-50%", y: "-50%", scale: 1 }}
                        animate={{ x: pos.x, y: pos.y, scale: 0.7 }}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded border border-chem bg-chem/10">
                          <span className="font-mono text-[8px] text-chem">div</span>
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
              </div>

              {/* 적용 버튼 */}
              <button
                onClick={handleApplyCSS}
                disabled={!!divAnimation}
                className={`mt-4 rounded-xl border px-8 py-3 font-semibold transition-all duration-200 ${
                  divAnimation
                    ? "border-card-border text-gray-600"
                    : "border-mad/30 bg-mad/10 text-mad hover:bg-mad/20"
                }`}
              >
                {divAnimation ? round.reaction : "CSS 적용하기"}
              </button>
            </motion.div>
          )}

          {/* 결과 */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600">
                CSS 마스터리 등급
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`mt-2 font-mono text-6xl font-bold ${grade.color}`}
              >
                {grade.grade}
              </motion.div>
              <p className="mt-2 text-sm text-gray-400">
                칭호: <span className={`font-bold ${grade.color}`}>{grade.title}</span>
              </p>
              <p className="mt-1 font-mono text-[10px] text-gray-600">
                총 시도: {attempts}회 · 결론: div는 중앙 정렬을 원하지 않는다
              </p>
              <button
                onClick={handleStart}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 도전
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
