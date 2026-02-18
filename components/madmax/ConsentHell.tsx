"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface Clause {
  text: string;
  refuseEffect: "normal" | "shrink" | "shrink-more" | "runaway" | "shake" | "fade" | "disabled";
}

const CLAUSES: Clause[] = [
  { text: "개인정보 수집 및 이용에 동의합니다", refuseEffect: "normal" },
  { text: "매주 월요일 오전 6시 기상에 동의합니다", refuseEffect: "shrink" },
  { text: "파인애플 피자를 영원히 먹지 않겠습니다", refuseEffect: "shrink-more" },
  { text: "이 사이트의 개발자가 천재라는 것에 동의합니다", refuseEffect: "runaway" },
  { text: "고양이가 세상에서 가장 귀여운 생물이라는 것에 동의합니다", refuseEffect: "shake" },
  { text: "앞으로 브라우저 탭을 20개 이상 열지 않겠습니다", refuseEffect: "fade" },
  { text: "본인의 영혼을 자발적으로 바칩니다", refuseEffect: "disabled" },
];

export function ConsentHell() {
  const [phase, setPhase] = useState<"idle" | "agreeing" | "completed">("idle");
  const [currentClause, setCurrentClause] = useState(0);
  const [agreed, setAgreed] = useState<boolean[]>([]);
  const [refuseAttempts, setRefuseAttempts] = useState(0);
  const [refuseBtnPos, setRefuseBtnPos] = useState({ x: 0, y: 0 });
  const [isShaking, setIsShaking] = useState(false);
  const [refuseBtnOpacity, setRefuseBtnOpacity] = useState(1);
  const [refuseBtnScale, setRefuseBtnScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = () => {
    setPhase("agreeing");
    setCurrentClause(0);
    setAgreed([]);
    setRefuseAttempts(0);
    resetRefuseBtn();
  };

  const resetRefuseBtn = () => {
    setRefuseBtnPos({ x: 0, y: 0 });
    setRefuseBtnOpacity(1);
    setRefuseBtnScale(1);
    setIsShaking(false);
  };

  const handleAgree = () => {
    setAgreed((prev) => [...prev, true]);
    if (currentClause + 1 >= CLAUSES.length) {
      setPhase("completed");
    } else {
      setCurrentClause((c) => c + 1);
      resetRefuseBtn();
      setRefuseAttempts(0);
    }
  };

  const handleRefuse = useCallback(() => {
    const clause = CLAUSES[currentClause];
    setRefuseAttempts((c) => c + 1);

    switch (clause.refuseEffect) {
      case "normal":
        // 정상적으로 거부 가능 — 다시 같은 약관 표시
        break;
      case "shrink":
        setRefuseBtnScale((s) => Math.max(s * 0.7, 0.3));
        break;
      case "shrink-more":
        setRefuseBtnScale((s) => Math.max(s * 0.5, 0.15));
        break;
      case "runaway": {
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const maxX = rect.width / 2 - 60;
          const maxY = rect.height / 2 - 24;
          setRefuseBtnPos({
            x: (Math.random() - 0.5) * maxX * 2,
            y: (Math.random() - 0.5) * maxY * 2,
          });
        }
        break;
      }
      case "shake":
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        break;
      case "fade":
        setRefuseBtnOpacity((o) => Math.max(o - 0.25, 0.05));
        break;
      case "disabled":
        // 버튼이 비활성화 상태 — 아무 일도 안 일어남
        break;
    }
  }, [currentClause]);

  const todayStr = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
            Experiment #006
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            동의서 지옥
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            모든 약관에 동의해야 합니다. 거부는... 할 수 있을까요?
          </p>
        </motion.div>
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
        style={{ minHeight: "24rem" }}
      >
        <AnimatePresence mode="wait">
          {/* 시작 화면 */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <FileText size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                이용약관 동의
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                서비스 이용을 위해 아래 약관에 모두 동의해주세요.
                간단한 절차입니다. 아마도요.
              </p>
              <div className="mt-3 rounded-lg border border-card-border bg-dark/50 px-4 py-2">
                <p className="font-mono text-[10px] text-gray-600">
                  총 {CLAUSES.length}개 항목 · 예상 소요: 30초
                </p>
              </div>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                동의 시작
              </button>
            </motion.div>
          )}

          {/* 약관 동의 진행 */}
          {phase === "agreeing" && (
            <motion.div
              key={`clause-${currentClause}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              {/* 진행률 */}
              <div className="mb-6 flex gap-1.5">
                {CLAUSES.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-8 rounded-full transition-colors duration-300 ${
                      i < currentClause
                        ? "bg-mad"
                        : i === currentClause
                          ? "bg-mad/50"
                          : "bg-card-border"
                    }`}
                  />
                ))}
              </div>

              <p className="font-mono text-[10px] text-gray-600">
                약관 {currentClause + 1}/{CLAUSES.length}
              </p>

              {/* 약관 내용 */}
              <div className="mt-4 max-w-md rounded-xl border border-card-border bg-dark/50 p-6">
                <p className="text-sm leading-relaxed text-gray-300">
                  {CLAUSES[currentClause].text}
                </p>
              </div>

              {/* 거부 시도 횟수 */}
              {refuseAttempts > 0 && CLAUSES[currentClause].refuseEffect !== "normal" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 font-mono text-[10px] text-gray-600"
                >
                  거부 시도: {refuseAttempts}회
                  {refuseAttempts >= 3 && " (포기하세요)"}
                </motion.p>
              )}

              {/* 버튼들 */}
              <div className="relative mt-8 flex items-center gap-4">
                <button
                  onClick={handleAgree}
                  className="rounded-xl border border-mad/30 bg-mad/10 px-8 py-3 font-semibold text-mad transition-all duration-200 hover:bg-mad/20"
                >
                  동의합니다
                </button>

                <motion.button
                  animate={{
                    x: refuseBtnPos.x,
                    y: refuseBtnPos.y,
                    scale: refuseBtnScale,
                    opacity: refuseBtnOpacity,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  onClick={handleRefuse}
                  onMouseEnter={
                    CLAUSES[currentClause].refuseEffect === "runaway"
                      ? handleRefuse
                      : undefined
                  }
                  disabled={CLAUSES[currentClause].refuseEffect === "disabled"}
                  className={`rounded-xl border border-card-border px-8 py-3 font-semibold text-gray-400 transition-all duration-200 hover:text-gray-200 ${
                    isShaking ? "animate-[shake_0.5s_ease-in-out]" : ""
                  } ${CLAUSES[currentClause].refuseEffect === "disabled" ? "cursor-not-allowed opacity-30" : ""}`}
                >
                  거부합니다
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* 완료 화면 */}
          {phase === "completed" && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Check size={48} className="mx-auto text-mad" />
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                계약 체결 완료!
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                모든 약관에 동의하셨습니다
              </p>

              {/* 서명된 계약서 카드 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 w-full max-w-sm rounded-xl border border-mad/20 bg-dark/80 p-5 text-left"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-mad/60">
                  MADMAX 영혼 계약서
                </p>
                <div className="mt-3 space-y-1">
                  {CLAUSES.map((clause, i) => (
                    <p key={i} className="font-mono text-[10px] text-gray-500">
                      <span className="text-mad">✓</span> {clause.text}
                    </p>
                  ))}
                </div>
                <div className="mt-4 border-t border-card-border pt-3">
                  <p className="font-mono text-[10px] text-gray-600">
                    서명일: {todayStr}
                  </p>
                  <p className="font-mono text-[10px] text-gray-600">
                    계약 번호: MXLAB-{Math.random().toString(36).slice(2, 8).toUpperCase()}
                  </p>
                </div>
              </motion.div>

              <button
                onClick={handleStart}
                className="mt-4 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 계약하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
