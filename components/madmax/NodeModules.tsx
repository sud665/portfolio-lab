"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "installing" | "complete";

const NORMAL_PACKAGES = [
  "react", "react-dom", "next", "typescript", "tailwindcss",
  "eslint", "prettier", "lodash", "axios", "dotenv",
];

const WEIRD_PACKAGES = [
  "is-odd", "is-even", "is-thirteen", "is-number", "is-string",
  "is-boolean", "left-pad", "right-pad", "center-pad", "pad-left",
  "is-positive", "is-negative", "is-zero", "true", "false",
  "number-one", "undefined-is-a-function", "hello-world-npm",
];

const INSANE_PACKAGES = [
  "ai-that-judges-your-code", "node-modules-weight-loss",
  "sudo-make-me-a-sandwich", "coffee-to-typescript-compiler",
  "blockchain-hello-world", "quantum-css-framework",
  "machine-learning-for-fizzbuzz", "serverless-server",
  "my-first-npm-package-please-dont-install",
  "definitely-not-malware", "99-bugs-on-the-wall",
  "works-on-my-machine", "stackoverflow-copy-paste",
  "gpt-but-its-just-if-else", "left-pad-reloaded",
  "the-entire-internet", "node-modules-black-hole",
  "your-ram-is-mine-now", "npm-install-npm",
  "recursive-dependency-resolver-recursive",
];

function randomPackage(elapsed: number): string {
  if (elapsed < 3) return NORMAL_PACKAGES[Math.floor(Math.random() * NORMAL_PACKAGES.length)]!;
  if (elapsed < 8) return WEIRD_PACKAGES[Math.floor(Math.random() * WEIRD_PACKAGES.length)]!;
  return INSANE_PACKAGES[Math.floor(Math.random() * INSANE_PACKAGES.length)]!;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes < 1024 ** 5) return `${(bytes / 1024 ** 4).toFixed(1)} TB`;
  if (bytes < 1024 ** 6) return `${(bytes / 1024 ** 5).toFixed(1)} PB`;
  return `${(bytes / 1024 ** 6).toFixed(1)} EB`;
}

export function NodeModules() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [packageCount, setPackageCount] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [blackHole, setBlackHole] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleStart = () => {
    setPhase("installing");
    setLogs(["$ npm install", "", "resolving dependencies..."]);
    setPackageCount(0);
    setTotalSize(0);
    setElapsed(0);
    setBlackHole(false);
  };

  useEffect(() => {
    if (phase !== "installing") return;

    let seconds = 0;
    intervalRef.current = setInterval(() => {
      seconds += 0.2;
      setElapsed(seconds);

      // 속도 에스컬레이션
      let packagesPerTick: number;
      let sizePerPackage: number;

      if (seconds < 3) {
        packagesPerTick = 1;
        sizePerPackage = Math.random() * 100 * 1024; // KB
      } else if (seconds < 8) {
        packagesPerTick = Math.floor(Math.random() * 5) + 2;
        sizePerPackage = Math.random() * 50 * 1024 ** 2; // MB
      } else if (seconds < 15) {
        packagesPerTick = Math.floor(Math.random() * 20) + 10;
        sizePerPackage = Math.random() * 10 * 1024 ** 3; // GB
      } else if (seconds < 25) {
        packagesPerTick = Math.floor(Math.random() * 100) + 50;
        sizePerPackage = Math.random() * 500 * 1024 ** 4; // TB
      } else {
        // 블랙홀
        setBlackHole(true);
        cleanup();
        setTimeout(() => setPhase("complete"), 3000);
        return;
      }

      const pkg = randomPackage(seconds);
      const version = `${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 50)}`;

      setPackageCount((c) => c + packagesPerTick);
      setTotalSize((s) => s + sizePerPackage * packagesPerTick);

      const logLine = seconds < 8
        ? `added ${pkg}@${version}`
        : seconds < 15
          ? `added ${packagesPerTick} packages (${pkg}, ...)`
          : `added ${packagesPerTick} packages... WARN: disk space critical`;

      setLogs((prev) => [...prev.slice(-30), logLine]);
    }, 200);

    return cleanup;
  }, [phase, cleanup]);

  // 자동 스크롤
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleReset = () => {
    cleanup();
    setPhase("idle");
    setLogs([]);
    setPackageCount(0);
    setTotalSize(0);
    setElapsed(0);
    setBlackHole(false);
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
            Experiment #013
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            node_modules 블랙홀
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            npm install을 실행하면 무슨 일이 벌어지는지 시뮬레이션합니다
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
              <Package size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                npm install 시뮬레이터
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                과연 node_modules는 얼마나 커질 수 있을까요?
                직접 확인해보세요.
              </p>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                npm install
              </button>
            </motion.div>
          )}

          {/* 설치 중 */}
          {phase === "installing" && (
            <motion.div
              key="installing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-96"
            >
              <motion.div
                animate={blackHole ? { scale: [1, 0.3], rotate: 720, opacity: [1, 0] } : {}}
                transition={blackHole ? { duration: 2.5, ease: "easeIn" } : {}}
                className="flex h-full flex-col"
              >
                {/* 상태 바 */}
                <div className="flex items-center justify-between border-b border-mad/20 bg-dark/80 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-3 w-3 rounded-full border border-mad/30 border-t-mad"
                    />
                    <span className="font-mono text-[10px] text-mad/70">
                      installing...
                    </span>
                  </div>
                  <div className="flex gap-4 font-mono text-[10px]">
                    <span className="text-gray-600">
                      📦 {packageCount.toLocaleString()}
                    </span>
                    <span className="text-amber">
                      💾 {formatSize(totalSize)}
                    </span>
                    <span className="text-gray-600">
                      ⏱ {elapsed.toFixed(0)}s
                    </span>
                  </div>
                </div>

                {/* 터미널 로그 */}
                <div className="flex-1 overflow-y-auto bg-dark/50 p-4">
                  {logs.map((line, i) => (
                    <p key={i} className="font-mono text-[11px] text-mad/60">
                      {line}
                    </p>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 완료 (블랙홀 후) */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-5xl"
              >
                🕳️
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-chem">
                블랙홀 형성 완료
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                node_modules가 시공간을 삼켰습니다
              </p>
              <div className="mt-4 rounded-xl border border-card-border bg-dark/50 px-6 py-4">
                <div className="space-y-1 font-mono text-[10px] text-gray-600">
                  <p>설치된 패키지: <span className="text-mad">{packageCount.toLocaleString()}</span></p>
                  <p>최종 용량: <span className="text-chem">{formatSize(totalSize)}</span></p>
                  <p>소요 시간: <span className="text-amber">{elapsed.toFixed(0)}초</span></p>
                  <p>남은 디스크: <span className="text-chem">-∞</span></p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                rm -rf node_modules
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
