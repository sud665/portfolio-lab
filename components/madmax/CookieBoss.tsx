"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, Swords } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "phase1" | "phase2" | "phase3" | "boss" | "victory";

const BOSS_LINES = [
  "아야!",
  "그만...",
  "쿠키 하나만...",
  "왜 이러는 거예요 😢",
  "나한테 왜 그래요",
  "쿠키가 뭘 잘못했는데!",
  "항복...",
  "더 이상 못 버텨요",
  "살려주세요",
  "마지막 쿠키인데...",
];

export function CookieBoss() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [bossHp, setBossHp] = useState(100);
  const [bossLine, setBossLine] = useState("");
  const [hitEffect, setHitEffect] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);

  const handleStart = () => setPhase("phase1");

  const handleReject = useCallback(() => {
    switch (phase) {
      case "phase1":
        setPhase("phase2");
        break;
      case "phase2":
        setPhase("phase3");
        break;
      case "phase3":
        setPhase("boss");
        setBossHp(100);
        break;
    }
  }, [phase]);

  const handleBossHit = useCallback(() => {
    const damage = 1 + Math.floor(Math.random() * 5);
    setTotalClicks((c) => c + 1);
    setBossHp((hp) => {
      const newHp = Math.max(hp - damage, 0);
      if (newHp <= 0) {
        setTimeout(() => setPhase("victory"), 300);
      }
      return newHp;
    });
    setBossLine(BOSS_LINES[Math.floor(Math.random() * BOSS_LINES.length)]);
    setHitEffect(true);
    setTimeout(() => setHitEffect(false), 150);
  }, []);

  const handleReset = () => {
    setPhase("idle");
    setBossHp(100);
    setBossLine("");
    setTotalClicks(0);
  };

  const bannerHeight = {
    phase1: "h-24",
    phase2: "h-40",
    phase3: "h-56",
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
            Experiment #007
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            쿠키 배너 보스전
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            쿠키를 거절할 수 있다면, 거절해보세요
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
              <Cookie size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                쿠키 동의 시뮬레이터
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                우리 모두가 경험하는 쿠키 배너. 이번엔 끝까지 거절해보세요.
              </p>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                웹사이트 방문하기
              </button>
            </motion.div>
          )}

          {/* Phase 1~3: 점점 커지는 배너 */}
          {(phase === "phase1" || phase === "phase2" || phase === "phase3") && (
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-96"
            >
              {/* 가짜 웹사이트 콘텐츠 */}
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="font-mono text-sm text-gray-600">
                  [매우 중요한 웹사이트 콘텐츠]
                </p>
                <p className="mt-2 font-mono text-xs text-gray-700">
                  여기에 읽고 싶은 내용이 있습니다...
                </p>
              </div>

              {/* 쿠키 배너 (점점 커짐) */}
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className={`absolute inset-x-0 bottom-0 border-t border-mad/20 bg-dark/95 backdrop-blur-sm ${bannerHeight[phase]} flex flex-col items-center justify-center px-6`}
              >
                <Cookie
                  size={phase === "phase1" ? 20 : phase === "phase2" ? 28 : 36}
                  className="text-mad/60"
                />
                <p className={`mt-2 text-center ${phase === "phase3" ? "text-base" : "text-sm"} text-gray-300`}>
                  {phase === "phase1" && "🍪 이 웹사이트는 쿠키를 사용합니다"}
                  {phase === "phase2" && "🍪 정말로 쿠키를 거절하시겠습니까? 쿠키가 슬퍼합니다..."}
                  {phase === "phase3" && "🍪 쿠키 없이는... 살 수 없어요... 제발... 😢"}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => setPhase("victory")}
                    className="rounded-lg bg-mad px-6 py-2 text-xs font-semibold text-dark"
                  >
                    {phase === "phase1" ? "모두 수락" : phase === "phase2" ? "제발 수락해주세요" : "수락하면 다 용서해줄게요"}
                  </button>
                  <button
                    onClick={handleReject}
                    className={`rounded-lg border border-card-border px-4 py-2 text-xs text-gray-500 transition-colors hover:text-gray-300 ${
                      phase === "phase3" ? "text-[10px]" : ""
                    }`}
                  >
                    {phase === "phase1" ? "거절" : phase === "phase2" ? "그래도 거절" : "끝까지 거절"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 보스전 */}
          {phase === "boss" && (
            <motion.div
              key="boss"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <div className="mb-2 flex items-center gap-2">
                <Swords size={16} className="text-chem" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-chem">
                  BOSS FIGHT
                </span>
                <Swords size={16} className="text-chem" />
              </div>

              {/* 보스 쿠키 */}
              <motion.div
                animate={hitEffect ? { x: [0, -5, 5, -3, 3, 0], scale: [1, 0.95, 1] } : {}}
                transition={{ duration: 0.15 }}
                className="cursor-pointer select-none"
                onClick={handleBossHit}
              >
                <span className="text-7xl">🍪</span>
              </motion.div>

              {/* HP 바 */}
              <div className="mt-4 w-full max-w-xs">
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-gray-500">COOKIE OVERLORD</span>
                  <span className="text-chem">{bossHp}/100 HP</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-dark">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-chem to-amber"
                    animate={{ width: `${bossHp}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              {/* 보스 대사 */}
              <AnimatePresence mode="wait">
                {bossLine && (
                  <motion.p
                    key={bossLine + totalClicks}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 font-mono text-sm text-gray-400"
                  >
                    &ldquo;{bossLine}&rdquo;
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-4 font-mono text-[10px] text-gray-600">
                클릭하여 쿠키를 처치하세요! (클릭: {totalClicks}회)
              </p>
            </motion.div>
          )}

          {/* 승리 */}
          {phase === "victory" && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <Shield size={48} className="text-mad" />
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                {totalClicks > 0
                  ? "쿠키 없는 자유를 쟁취했습니다!"
                  : "쿠키를 수락했습니다"}
              </h3>
              {totalClicks > 0 ? (
                <>
                  <p className="mt-2 text-sm text-gray-400">
                    {totalClicks}번의 클릭으로 쿠키 보스를 처치했습니다
                  </p>
                  <p className="mt-1 font-mono text-xs text-gray-600">
                    (실제 웹사이트에서는 이렇게 안 됩니다)
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-gray-400">
                  쿠키의 압박에 굴복하셨군요
                </p>
              )}
              <button
                onClick={handleReset}
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
