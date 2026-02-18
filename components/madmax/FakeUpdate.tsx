"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "updating" | "stuck" | "bluescreen" | "joke" | "reboot" | "complete";

const ERROR_CODES = [
  "COOKIE_OVERFLOW_EXCEPTION",
  "KEYBOARD_NOT_FOUND_PRESS_F1",
  "ERROR_SUCCESS",
  "TASK_FAILED_SUCCESSFULLY",
  "ID_10T_ERROR",
  "PEBKAC_DETECTED",
];

export function FakeUpdate() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorCode] = useState(() => ERROR_CODES[Math.floor(Math.random() * ERROR_CODES.length)]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = () => {
    setPhase("updating");
    setProgress(0);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
  };

  // 경과 시간 트래커
  useEffect(() => {
    if (phase === "idle" || phase === "complete") return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // updating: 0 → 99%를 8초 동안
  useEffect(() => {
    if (phase !== "updating") return;

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 99) {
          cleanup();
          setTimeout(() => setPhase("stuck"), 500);
          return 99;
        }
        return p + 99 / 80; // 8초 동안 100ms마다
      });
    }, 100);

    return cleanup;
  }, [phase]);

  // stuck: 99%에서 멈추다가 35%로 되돌아감
  useEffect(() => {
    if (phase !== "stuck") return;

    const timer1 = setTimeout(() => {
      setProgress(35);
    }, 2500);

    const timer2 = setTimeout(() => {
      setPhase("bluescreen");
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [phase]);

  // bluescreen → joke → reboot → complete 자동 전환
  useEffect(() => {
    if (phase === "bluescreen") {
      const timer = setTimeout(() => setPhase("joke"), 3000);
      return () => clearTimeout(timer);
    }
    if (phase === "joke") {
      const timer = setTimeout(() => setPhase("reboot"), 2000);
      return () => clearTimeout(timer);
    }
    if (phase === "reboot") {
      const timer = setTimeout(() => setPhase("complete"), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleReset = () => {
    cleanup();
    setPhase("idle");
    setProgress(0);
    setElapsedTime(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
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
            Experiment #009
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            가짜 업데이트
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            중요한 시스템 업데이트를 설치합니다. 전원을 끄지 마세요.
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
              <Monitor size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                시스템 업데이트 대기 중
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                중요한 보안 업데이트가 있습니다. 지금 설치하시겠습니까?
              </p>
              <div className="mt-3 rounded-lg border border-card-border bg-dark/50 px-4 py-2">
                <p className="font-mono text-[10px] text-gray-600">
                  예상 소요 시간: 약 2분
                </p>
              </div>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                지금 설치
              </button>
            </motion.div>
          )}

          {/* 업데이트 중 & stuck */}
          {(phase === "updating" || phase === "stuck") && (
            <motion.div
              key="updating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              {/* 스피너 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 rounded-full border-2 border-mad/20 border-t-mad"
              />

              <p className="mt-6 font-mono text-sm text-gray-300">
                {phase === "stuck" && progress > 50
                  ? "업데이트 설치 중... 전원을 끄지 마세요"
                  : "업데이트를 다운로드하는 중..."}
              </p>

              {/* 퍼센트 */}
              <p className="mt-2 font-mono text-4xl font-bold text-mad">
                {Math.round(progress)}%
              </p>

              {/* 프로그레스 바 */}
              <div className="mt-4 w-full max-w-sm">
                <div className="h-2 overflow-hidden rounded-full bg-dark">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-mad to-mad-light"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>

              <p className="mt-4 font-mono text-[10px] text-gray-600">
                경과 시간: {formatTime(elapsedTime)}
                {phase === "stuck" && progress < 50 && (
                  <span className="ml-2 text-chem">
                    ⚠ 예상보다 오래 걸리고 있습니다
                  </span>
                )}
              </p>
            </motion.div>
          )}

          {/* 블루스크린 (그린스크린) */}
          {phase === "bluescreen" && (
            <motion.div
              key="bluescreen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center bg-mad/10 px-6 text-center"
            >
              <motion.div
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <p className="font-mono text-lg font-bold text-mad">:(</p>
                <p className="mt-4 font-mono text-sm text-mad/80">
                  시스템에 문제가 발생했습니다.
                </p>
                <p className="mt-1 font-mono text-sm text-mad/80">
                  오류 정보를 수집하는 중입니다...
                </p>
                <p className="mt-6 font-mono text-[10px] text-mad/50">
                  중지 코드: {errorCode}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* 농담 */}
          {phase === "joke" && (
            <motion.div
              key="joke"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <span className="text-5xl">😜</span>
              <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                농담이에요 ㅋㅋ
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                놀랐죠?
              </p>
            </motion.div>
          )}

          {/* 리부트 */}
          {phase === "reboot" && (
            <motion.div
              key="reboot"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 rounded-full border-2 border-mad/20 border-t-mad"
              />
              <p className="mt-6 font-mono text-sm text-gray-400">
                다시 시작하는 중...
              </p>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mt-2 font-mono text-[10px] text-gray-600"
              >
                잠시만 기다려주세요
              </motion.div>
            </motion.div>
          )}

          {/* 완료 */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-5xl"
              >
                🎉
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                업데이트 완료!
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                축하합니다! 아무것도 업데이트되지 않았습니다.
              </p>
              <div className="mt-4 rounded-lg border border-card-border bg-dark/50 px-4 py-3">
                <p className="font-mono text-[10px] text-gray-600">
                  총 대기 시간: {formatTime(elapsedTime)}
                </p>
                <p className="font-mono text-[10px] text-gray-600">
                  설치된 업데이트: 0개
                </p>
                <p className="font-mono text-[10px] text-gray-600">
                  낭비된 시간: {formatTime(elapsedTime)}
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 업데이트
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
