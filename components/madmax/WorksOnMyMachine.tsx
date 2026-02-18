"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Monitor } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "local" | "deploying" | "error" | "result";

interface DeployAttempt {
  id: number;
  error: string;
  isVibes?: boolean;
}

const DEPLOY_ERRORS: DeployAttempt[] = [
  { id: 1, error: "TypeError: Cannot read property 'hello' of undefined" },
  { id: 2, error: "Error: Tuesday is not a valid day for deployments" },
  { id: 3, error: "EmotionalDamageError: Your code hurt the server's feelings" },
  { id: 4, error: "AstrologyError: Mercury is in retrograde. Deploys disabled." },
  { id: 5, error: "200 OK → 3초 후... 500 Internal Vibes Error", isVibes: true },
];

const DEVOPS_GRADES = [
  { title: "GitHub Actions 전문가", subtitle: "CI/CD? 그게 뭔가요?", color: "text-mad" },
  { title: "YAML 엔지니어", subtitle: "들여쓰기 하나로 3시간", color: "text-amber" },
  { title: "sudo 남용러", subtitle: "권한 문제? sudo 때려", color: "text-chem" },
  { title: "Docker 포기자", subtitle: "Dockerfile? README에 '로컬에서 돌리세요'", color: "text-code" },
];

export function WorksOnMyMachine() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [vibesPhase, setVibesPhase] = useState(false);
  const [deployCount, setDeployCount] = useState(0);
  const [grade] = useState(() => DEVOPS_GRADES[Math.floor(Math.random() * DEVOPS_GRADES.length)]!);

  const handleStart = () => {
    setPhase("local");
    setCurrentAttempt(0);
    setShowSuccess(false);
    setVibesPhase(false);
    setDeployCount(0);
  };

  const handleDeploy = useCallback(() => {
    setDeployCount((c) => c + 1);
    setPhase("deploying");
  }, []);

  // 로컬 성공 후 자동 deploy 유도
  useEffect(() => {
    if (phase !== "local") return;
    // 자동 전환 없음 — 유저가 Deploy 버튼 클릭
  }, [phase]);

  // deploying → error (또는 vibes 성공→에러)
  useEffect(() => {
    if (phase !== "deploying") return;

    const timer = setTimeout(() => {
      const attempt = DEPLOY_ERRORS[currentAttempt];
      if (!attempt) {
        // 모든 에러 다 봄 → 갑자기 성공
        setPhase("result");
        return;
      }

      if (attempt.isVibes) {
        // 잠깐 성공 보여주기
        setShowSuccess(true);
        const timer2 = setTimeout(() => {
          setShowSuccess(false);
          setVibesPhase(true);
          setPhase("error");
        }, 3000);
        return () => clearTimeout(timer2);
      }

      setPhase("error");
    }, 2000);

    return () => clearTimeout(timer);
  }, [phase, currentAttempt]);

  const handleRetry = () => {
    setVibesPhase(false);
    setShowSuccess(false);
    if (currentAttempt + 1 >= DEPLOY_ERRORS.length) {
      setPhase("result");
    } else {
      setCurrentAttempt((c) => c + 1);
      setPhase("local");
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setCurrentAttempt(0);
    setShowSuccess(false);
    setVibesPhase(false);
    setDeployCount(0);
  };

  const currentError = DEPLOY_ERRORS[currentAttempt];

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
            Experiment #014
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            It Works on My Machine
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            로컬에서는 완벽하게 동작합니다. 프로덕션에서도... 그럴까요?
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
              <Cloud size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                배포 시뮬레이터
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                로컬에서 완벽하게 동작하는 코드를 프로덕션에 배포해보세요.
                과연 잘 될까요?
              </p>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                git push origin main
              </button>
            </motion.div>
          )}

          {/* 로컬 성공 */}
          {phase === "local" && (
            <motion.div
              key={`local-${currentAttempt}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col"
            >
              <div className="grid h-full grid-cols-2">
                {/* 로컬 패널 */}
                <div className="flex flex-col items-center justify-center border-r border-card-border bg-mad/5 px-4">
                  <Monitor size={24} className="text-mad" />
                  <p className="mt-2 font-mono text-xs font-bold text-mad">LOCAL</p>
                  <div className="mt-3 rounded-lg border border-mad/30 bg-dark/50 px-4 py-2">
                    <p className="font-mono text-[10px] text-mad">✓ All tests passing</p>
                    <p className="font-mono text-[10px] text-mad">✓ No errors</p>
                    <p className="font-mono text-[10px] text-mad">✓ Looks great!</p>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-gray-600">
                    시도 {currentAttempt + 1}/{DEPLOY_ERRORS.length}
                  </p>
                </div>

                {/* 프로덕션 패널 */}
                <div className="flex flex-col items-center justify-center px-4">
                  <Cloud size={24} className="text-gray-600" />
                  <p className="mt-2 font-mono text-xs font-bold text-gray-600">PRODUCTION</p>
                  <p className="mt-3 font-mono text-[10px] text-gray-600">
                    배포 대기 중...
                  </p>
                  <button
                    onClick={handleDeploy}
                    className="mt-4 rounded-xl border border-mad/30 bg-mad/10 px-6 py-2 font-mono text-xs font-semibold text-mad transition-all duration-200 hover:bg-mad/20"
                  >
                    🚀 Deploy
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 배포 중 */}
          {phase === "deploying" && (
            <motion.div
              key="deploying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col"
            >
              <div className="grid h-full grid-cols-2">
                <div className="flex flex-col items-center justify-center border-r border-card-border bg-mad/5 px-4">
                  <Monitor size={24} className="text-mad" />
                  <p className="mt-2 font-mono text-xs font-bold text-mad">LOCAL</p>
                  <p className="mt-3 font-mono text-[10px] text-mad">✓ Still working</p>
                </div>
                <div className="flex flex-col items-center justify-center px-4">
                  <Cloud size={24} className={showSuccess ? "text-mad" : "text-amber"} />
                  <p className={`mt-2 font-mono text-xs font-bold ${showSuccess ? "text-mad" : "text-amber"}`}>
                    PRODUCTION
                  </p>
                  {showSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-3"
                    >
                      <p className="font-mono text-sm font-bold text-mad">✓ SUCCESS!</p>
                      <p className="mt-1 font-mono text-[10px] text-gray-600">
                        잠깐만... 뭔가 이상한데...
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="mt-4 h-8 w-8 rounded-full border-2 border-amber/20 border-t-amber"
                    />
                  )}
                  <p className="mt-3 font-mono text-[10px] text-gray-600">
                    {showSuccess ? "" : "Deploying..."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 에러 */}
          {phase === "error" && currentError && (
            <motion.div
              key={`error-${currentAttempt}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col"
            >
              <div className="grid h-full grid-cols-2">
                <div className="flex flex-col items-center justify-center border-r border-card-border bg-mad/5 px-4">
                  <Monitor size={24} className="text-mad" />
                  <p className="mt-2 font-mono text-xs font-bold text-mad">LOCAL</p>
                  <p className="mt-3 font-mono text-[10px] text-mad">✓ Still working perfectly</p>
                  <p className="mt-1 font-mono text-[10px] text-gray-600">(물론이죠)</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-chem/5 px-4">
                  <Cloud size={24} className="text-chem" />
                  <p className="mt-2 font-mono text-xs font-bold text-chem">PRODUCTION</p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 max-w-[200px] rounded-lg border border-chem/30 bg-dark/80 px-3 py-2"
                  >
                    <p className="font-mono text-[10px] text-chem">
                      {vibesPhase ? "500 Internal Vibes Error" : currentError.error}
                    </p>
                  </motion.div>
                  <button
                    onClick={handleRetry}
                    className="mt-4 rounded-lg border border-card-border px-4 py-2 font-mono text-[10px] text-gray-400 transition-colors hover:border-mad/30 hover:text-mad"
                  >
                    다시 시도 (git push --force)
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 최종 결과 */}
          {phase === "result" && (
            <motion.div
              key="result"
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
                배포 성공!
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                {deployCount}번의 시도 끝에 드디어 성공했습니다
              </p>

              <div className="mt-4 rounded-xl border border-card-border bg-dark/50 px-6 py-4">
                <p className="font-mono text-[10px] text-gray-600">DevOps 등급</p>
                <p className={`mt-1 font-mono text-lg font-bold ${grade.color}`}>
                  {grade.title}
                </p>
                <p className="mt-1 font-mono text-[10px] text-gray-500">
                  &ldquo;{grade.subtitle}&rdquo;
                </p>
              </div>

              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 배포
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
