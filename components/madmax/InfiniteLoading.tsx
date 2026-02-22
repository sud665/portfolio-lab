"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const messages: { time: number; text: string }[] = [
  { time: 0, text: "리소스를 불러오는 중..." },
  { time: 3, text: "거의 다 됐습니다..." },
  { time: 6, text: "서버 응답 대기 중..." },
  { time: 10, text: "최적화 진행 중..." },
  { time: 15, text: "조금만 더 기다려주세요..." },
  { time: 20, text: "아직 기다리고 계세요?" },
  { time: 25, text: "대단한 인내심이군요" },
  { time: 30, text: "사실 좀 오래 걸립니다" },
  { time: 40, text: "...솔직히 말할게요" },
  { time: 45, text: "이거 진짜 로딩하는 거 아닙니다" },
  { time: 50, text: "그냥 숫자가 올라가는 겁니다" },
  { time: 60, text: "근데 아직도 보고 계시네요" },
  { time: 70, text: "할 일이 없으신 건가요?" },
  { time: 80, text: "저도 할 일은 없긴 한데..." },
  { time: 90, text: "이제 곧 뭔가 나올 거예요" },
  { time: 100, text: "아마도요" },
  { time: 110, text: "거짓말이었어요" },
  { time: 120, text: "2분이나 기다리셨네요. 대단합니다." },
  { time: 150, text: "진짜 끝까지 볼 작정이시군요" },
  { time: 180, text: "🏆 3분 달성! 당신은 진정한 인내의 아이콘" },
];

export function InfiniteLoading() {
  const [isStarted, setIsStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentMsg, setCurrentMsg] = useState(messages[0].text);
  const [nines, setNines] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isStarted) return;

    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStarted]);

  useEffect(() => {
    if (!isStarted) return;

    const applicable = messages.filter((m) => m.time <= elapsed);
    if (applicable.length > 0) {
      setCurrentMsg(applicable[applicable.length - 1].text);
    }
  }, [elapsed, isStarted]);

  useEffect(() => {
    if (!isStarted) return;

    if (elapsed < 5) return;

    if (elapsed % 3 === 0 && nines < 15) {
      setNines((n) => n + 1);
    }
  }, [elapsed, isStarted, nines]);

  const percentage = !isStarted
    ? 0
    : elapsed < 3
      ? 30 + elapsed * 20
      : 99 + parseFloat("0." + "9".repeat(nines));

  const displayPercentage = !isStarted
    ? "0"
    : elapsed < 3
      ? String(Math.min(Math.round(30 + elapsed * 20), 99))
      : "99." + "9".repeat(nines);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleReset = () => {
    setIsStarted(false);
    setElapsed(0);
    setNines(1);
    setCurrentMsg(messages[0].text);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
            Experiment #004
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            무한 로딩
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            이 로딩은 절대 끝나지 않습니다. 얼마나 기다릴 수 있나요?
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
        style={{ minHeight: "20rem" }}
      >
        {!isStarted ? (
          /* 시작 화면 */
          <div className="flex h-80 flex-col items-center justify-center text-center px-6">
            <p className="font-mono text-sm text-gray-400">
              매우 중요한 콘텐츠를 로딩합니다
            </p>
            <p className="mt-1 font-mono text-[10px] text-gray-600">
              예상 소요 시간: 곧 완료
            </p>
            <button
              onClick={() => setIsStarted(true)}
              className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
            >
              로딩 시작
            </button>
          </div>
        ) : (
          /* 로딩 화면 */
          <div className="flex h-80 flex-col items-center justify-center px-6">
            {/* 퍼센트 표시 */}
            <div className="text-center">
              <motion.div
                key={displayPercentage}
                initial={{ opacity: 0.5, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-4xl font-bold text-mad md:text-5xl"
              >
                {displayPercentage}
                <span className="text-mad/60">%</span>
              </motion.div>
            </div>

            {/* 로딩바 */}
            <div className="mx-auto mt-6 w-full max-w-sm">
              <div className="h-2 overflow-hidden rounded-full bg-dark">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-mad to-mad-light"
                  animate={{
                    width: `${Math.min(percentage, 99.999)}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* 시스템 메시지 */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-6 font-mono text-xs text-gray-400"
              >
                {currentMsg}
              </motion.p>
            </AnimatePresence>

            {/* 경과 시간 */}
            <div className="mt-4 flex items-center gap-4 font-mono text-[10px] text-gray-600">
              <span>경과: {formatTime(elapsed)}</span>
              <span>·</span>
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                처리 중...
              </motion.span>
            </div>

            {/* 3분 이상 시 보상 */}
            <AnimatePresence>
              {elapsed >= 180 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-mad/20 bg-mad/5 px-4 py-2 text-center"
                >
                  <p className="font-mono text-xs text-mad">
                    3분 동안 기다린 당신에게 경의를 표합니다
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 리셋 */}
            <button
              onClick={handleReset}
              className="mt-4 font-mono text-[10px] text-gray-700 transition-colors duration-200 hover:text-gray-400"
            >
              (포기하기)
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
