# MADMAX LAB V2 — 5가지 실험 추가 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** madmax 연구실에 UX 트롤링 컨셉의 인터랙티브 실험 5개를 추가한다 (ConsentHell, CookieBoss, CursedSlider, FakeUpdate, CaptchaHell).

**Architecture:** 기존 madmax 실험 패턴을 그대로 따른다. 각 실험은 `components/madmax/`에 독립 컴포넌트로 생성하고, 복잡한 로직은 `hooks/`에 분리한다. 페이지는 `app/madmax/page.tsx`에서 import만 추가. 모든 상태는 컴포넌트 내부 `useState`로 관리한다.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (@theme), Framer Motion, lucide-react

**Design Doc:** `docs/plans/2026-02-18-madmax-experiments-v2-design.md`

---

## 공통 패턴 참조

모든 실험은 이 패턴을 따른다. 기존 컴포넌트를 참고:

**섹션 헤더 패턴** (RunawayButton.tsx:57-72 참고):
```tsx
<section className="mx-auto max-w-6xl px-6 pb-28">
  <div className="text-center">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="inline-block border-b border-mad/30 pb-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-mad/70">
        Experiment #NNN
      </span>
      <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
        제목
      </h2>
      <p className="mt-2 text-sm text-gray-400">
        설명
      </p>
    </motion.div>
  </div>
```

**컨테이너 패턴** (DontPress.tsx:96-103 참고):
```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="relative mt-10 overflow-hidden rounded-2xl border border-card-border bg-card"
  style={{ minHeight: "24rem" }}
>
```

**실험 번호:** 기존 #000~#005 → 새 실험은 #006~#010

---

### Task 1: ConsentHell 컴포넌트 생성

**Files:**
- Create: `components/madmax/ConsentHell.tsx`

**Step 1: ConsentHell 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/ConsentHell.tsx
git commit -m "feat: add ConsentHell experiment — escalating terms agreement"
```

---

### Task 2: CookieBoss 컴포넌트 생성

**Files:**
- Create: `components/madmax/CookieBoss.tsx`

**Step 1: CookieBoss 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/CookieBoss.tsx
git commit -m "feat: add CookieBoss experiment — cookie banner boss fight"
```

---

### Task 3: useCursedSlider 훅 생성

**Files:**
- Create: `hooks/useCursedSlider.ts`

**Step 1: useCursedSlider 훅 작성**

```ts
"use client";

import { useState, useCallback, useRef, useMemo } from "react";

export interface Round {
  id: number;
  target: number;
  curse: string;
  description: string;
  difficulty: string;
}

const ROUNDS: Round[] = [
  { id: 1, target: 50, curse: "log", description: "로그 스케일", difficulty: "★☆☆" },
  { id: 2, target: 75, curse: "reversed", description: "방향 반전", difficulty: "★★☆" },
  { id: 3, target: 30, curse: "inverted", description: "마우스 반대로", difficulty: "★★☆" },
  { id: 4, target: 60, curse: "noisy", description: "랜덤 떨림", difficulty: "★★★" },
  { id: 5, target: 50, curse: "all", description: "전부 동시에", difficulty: "★★★★" },
];

function getGrade(diff: number): string {
  if (diff <= 2) return "S";
  if (diff <= 5) return "A";
  if (diff <= 10) return "B";
  return "C";
}

function getGradeColor(grade: string): string {
  switch (grade) {
    case "S": return "text-mad";
    case "A": return "text-mad-light";
    case "B": return "text-amber";
    default: return "text-gray-500";
  }
}

export function useCursedSlider() {
  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [currentRound, setCurrentRound] = useState(0);
  const [rawValue, setRawValue] = useState(50);
  const [scores, setScores] = useState<{ round: Round; value: number; diff: number; grade: string }[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const noiseRef = useRef(0);

  const round = ROUNDS[currentRound] as Round | undefined;

  // 저주 변환: rawValue(슬라이더 물리적 위치) → displayValue(표시되는 값)
  const applyTransform = useCallback(
    (raw: number, curse: string): number => {
      switch (curse) {
        case "log":
          // 로그 스케일: 0-100 → 비선형 매핑
          return Math.round(Math.pow(raw / 100, 3) * 100);
        case "reversed":
          return 100 - raw;
        case "inverted":
          // input event에서 반전 적용 — 여기서는 그대로
          return raw;
        case "noisy":
          return Math.max(0, Math.min(100, Math.round(raw + noiseRef.current)));
        case "all": {
          let v = Math.pow(raw / 100, 3) * 100; // log
          v = 100 - v; // reversed
          v = Math.max(0, Math.min(100, v + noiseRef.current)); // noisy
          return Math.round(v);
        }
        default:
          return raw;
      }
    },
    [],
  );

  const displayValue = useMemo(() => {
    if (!round) return rawValue;
    return applyTransform(rawValue, round.curse);
  }, [rawValue, round, applyTransform]);

  const handleChange = useCallback(
    (newRaw: number) => {
      if (isLocked || !round) return;

      // "inverted" curse: 마우스 움직임 반대 — delta 반전 적용
      if (round.curse === "inverted" || round.curse === "all") {
        const delta = newRaw - rawValue;
        const inverted = rawValue - delta;
        setRawValue(Math.max(0, Math.min(100, inverted)));
      } else {
        setRawValue(newRaw);
      }
    },
    [isLocked, rawValue, round],
  );

  // 노이즈 생성 (noisy & all)
  const updateNoise = useCallback(() => {
    if (!round) return;
    if (round.curse === "noisy" || round.curse === "all") {
      noiseRef.current = (Math.random() - 0.5) * 10;
    }
  }, [round]);

  const start = useCallback(() => {
    setPhase("playing");
    setCurrentRound(0);
    setRawValue(50);
    setScores([]);
    setIsLocked(false);
    noiseRef.current = 0;
  }, []);

  const lockIn = useCallback(() => {
    if (!round) return;
    setIsLocked(true);
    const diff = Math.abs(displayValue - round.target);
    const grade = getGrade(diff);
    const newScore = { round, value: displayValue, diff, grade };

    setScores((prev) => [...prev, newScore]);

    setTimeout(() => {
      if (currentRound + 1 >= ROUNDS.length) {
        setPhase("result");
      } else {
        setCurrentRound((c) => c + 1);
        setRawValue(50);
        setIsLocked(false);
        noiseRef.current = 0;
      }
    }, 800);
  }, [currentRound, displayValue, round]);

  const finalGrade = useMemo(() => {
    if (scores.length === 0) return { grade: "C", color: "text-gray-500" };
    const avgDiff = scores.reduce((sum, s) => sum + s.diff, 0) / scores.length;
    const grade = getGrade(avgDiff);
    return { grade, color: getGradeColor(grade) };
  }, [scores]);

  return {
    phase,
    round,
    currentRound,
    totalRounds: ROUNDS.length,
    rawValue,
    displayValue,
    isLocked,
    scores,
    finalGrade,
    handleChange,
    updateNoise,
    start,
    lockIn,
  };
}
```

**Step 2: 커밋**

```bash
git add hooks/useCursedSlider.ts
git commit -m "feat: add useCursedSlider hook with round logic and transforms"
```

---

### Task 4: CursedSlider 컴포넌트 생성

**Files:**
- Create: `components/madmax/CursedSlider.tsx`

**Step 1: CursedSlider 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/CursedSlider.tsx
git commit -m "feat: add CursedSlider experiment — cursed slider challenge"
```

---

### Task 5: FakeUpdate 컴포넌트 생성

**Files:**
- Create: `components/madmax/FakeUpdate.tsx`

**Step 1: FakeUpdate 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/FakeUpdate.tsx
git commit -m "feat: add FakeUpdate experiment — fake system update with green screen"
```

---

### Task 6: useCaptchaHell 훅 생성

**Files:**
- Create: `hooks/useCaptchaHell.ts`

**Step 1: useCaptchaHell 훅 작성**

```ts
"use client";

import { useState, useCallback, useMemo } from "react";

export type LevelType = "grid" | "abstract" | "distorted" | "math" | "impossible";

export interface Level {
  id: number;
  type: LevelType;
  instruction: string;
  description: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    type: "grid",
    instruction: "신호등이 포함된 이미지를 모두 선택하세요",
    description: "이미지 선택",
  },
  {
    id: 2,
    type: "abstract",
    instruction: "행복을 포함한 이미지를 모두 선택하세요",
    description: "추상 이미지",
  },
  {
    id: 3,
    type: "distorted",
    instruction: "아래 왜곡된 텍스트를 입력하세요",
    description: "왜곡 텍스트",
  },
  {
    id: 4,
    type: "math",
    instruction: "원주율(π)의 소수점 아래 7자리까지 입력하세요",
    description: "수학 문제",
  },
  {
    id: 5,
    type: "impossible",
    instruction: "이 고양이의 이름을 맞추세요",
    description: "불가능한 문제",
  },
];

// 3x3 그리드: 신호등이 있는 셀 (정답: 인덱스 1, 4, 7)
export const GRID_ANSWERS = [1, 4, 7];

// 그리드 이모지: 신호등과 일반 항목 혼합
export const GRID_ITEMS = ["🏠", "🚦", "🌳", "🚗", "🚥", "🏢", "🌸", "🚦", "🐕"];

// 추상 그리드: 아무거나 정답
export const ABSTRACT_ITEMS = ["🌅", "🎨", "🌧️", "📚", "🎵", "🍕", "💤", "🏃", "🌈"];

// 왜곡 텍스트
export const DISTORTED_TEXT = "xK9mQ";

// 고양이 이름 후보 (전부 오답)
export const CAT_NAMES = ["나비", "야옹이", "치즈", "뽀삐"];

const PI_ANSWER = "3.1415926";

export function useCaptchaHell() {
  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [textInput, setTextInput] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [levelResults, setLevelResults] = useState<{ level: Level; passed: boolean; attempts: number }[]>([]);

  const level = LEVELS[currentLevel] as Level | undefined;

  const start = useCallback(() => {
    setPhase("playing");
    setCurrentLevel(0);
    setSelectedCells([]);
    setTextInput("");
    setFailCount(0);
    setFeedback(null);
    setLevelResults([]);
  }, []);

  const toggleCell = useCallback((idx: number) => {
    setSelectedCells((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  }, []);

  const advanceLevel = useCallback(
    (passed: boolean, attempts: number) => {
      if (!level) return;

      setLevelResults((prev) => [...prev, { level, passed, attempts }]);
      setFeedback(null);
      setSelectedCells([]);
      setTextInput("");
      setFailCount(0);

      if (currentLevel + 1 >= LEVELS.length) {
        setTimeout(() => setPhase("result"), 500);
      } else {
        setCurrentLevel((c) => c + 1);
      }
    },
    [currentLevel, level],
  );

  const submitAnswer = useCallback(() => {
    if (!level) return;

    switch (level.type) {
      case "grid": {
        const correct =
          selectedCells.length === GRID_ANSWERS.length &&
          GRID_ANSWERS.every((a) => selectedCells.includes(a));
        if (correct) {
          setFeedback("정답!");
          setTimeout(() => advanceLevel(true, failCount + 1), 800);
        } else {
          setFailCount((c) => c + 1);
          setFeedback("다시 시도하세요");
          setSelectedCells([]);
        }
        break;
      }
      case "abstract":
        // 아무거나 정답
        if (selectedCells.length > 0) {
          setFeedback("...정답이라고 할게요");
          setTimeout(() => advanceLevel(true, 1), 800);
        } else {
          setFeedback("최소 1개를 선택하세요");
        }
        break;
      case "distorted":
        // 아무거나 입력해도 통과
        if (textInput.trim().length > 0) {
          setFeedback("맞는 것 같기도 하고...");
          setTimeout(() => advanceLevel(true, 1), 800);
        } else {
          setFeedback("무언가를 입력하세요");
        }
        break;
      case "math":
        if (textInput.trim() === PI_ANSWER) {
          setFeedback("정답!");
          setTimeout(() => advanceLevel(true, failCount + 1), 800);
        } else {
          setFailCount((c) => c + 1);
          setFeedback(`틀렸습니다 (시도: ${failCount + 1}회)`);
          setTextInput("");
        }
        break;
      case "impossible":
        setFailCount((c) => {
          const newCount = c + 1;
          if (newCount >= 3) {
            setFeedback("...그냥 통과시켜 드릴게요");
            setTimeout(() => advanceLevel(true, newCount), 800);
          } else {
            setFeedback(`틀렸습니다! (${3 - newCount}회 더 틀리면 자동 통과)`);
          }
          return newCount;
        });
        setTextInput("");
        break;
    }
  }, [level, selectedCells, textInput, failCount, advanceLevel]);

  const humanScore = useMemo(() => {
    return Math.round(30 + Math.random() * 40);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    phase,
    level,
    currentLevel,
    totalLevels: LEVELS.length,
    selectedCells,
    textInput,
    setTextInput,
    failCount,
    feedback,
    levelResults,
    humanScore,
    start,
    toggleCell,
    submitAnswer,
  };
}
```

**Step 2: 커밋**

```bash
git add hooks/useCaptchaHell.ts
git commit -m "feat: add useCaptchaHell hook with level logic and validation"
```

---

### Task 7: CaptchaHell 컴포넌트 생성

**Files:**
- Create: `components/madmax/CaptchaHell.tsx`

**Step 1: CaptchaHell 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/CaptchaHell.tsx
git commit -m "feat: add CaptchaHell experiment — impossible captcha challenge"
```

---

### Task 8: 페이지 통합

**Files:**
- Modify: `app/madmax/page.tsx`

**Step 1: import 및 컴포넌트 추가**

기존 `app/madmax/page.tsx`에 5개 실험 import를 추가하고, `<FortuneLab />` 다음, `<LabGrid />` 이전에 배치한다.

추가할 import (기존 import 블록 뒤에):
```tsx
import { ConsentHell } from "@/components/madmax/ConsentHell";
import { CookieBoss } from "@/components/madmax/CookieBoss";
import { CursedSlider } from "@/components/madmax/CursedSlider";
import { FakeUpdate } from "@/components/madmax/FakeUpdate";
import { CaptchaHell } from "@/components/madmax/CaptchaHell";
```

JSX에 추가 (`<FortuneLab />` 다음):
```tsx
<ConsentHell />
<CookieBoss />
<CursedSlider />
<FakeUpdate />
<CaptchaHell />
```

**Step 2: 커밋**

```bash
git add app/madmax/page.tsx
git commit -m "feat: integrate 5 new experiments into madmax page"
```

---

### Task 9: 빌드 검증

**Step 1: 개발 서버 실행**

```bash
npm run dev
```

**Step 2: 브라우저에서 검증**

1. `http://localhost:3000/madmax` 접속 — 11개 실험 모두 표시 확인
2. 각 실험의 시작 버튼 → Phase 전환 → 완료 화면 확인
3. ConsentHell: 거부 버튼 효과 (축소, 도망, 떨림, 투명) 확인
4. CookieBoss: 배너 확대 → 보스전 → 승리 확인
5. CursedSlider: 라운드별 저주 적용 확인 (로그, 반전, 역방향, 노이즈)
6. FakeUpdate: 프로그레스 → 멈춤 → 그린스크린 → 완료 확인
7. CaptchaHell: 5레벨 진행 → 결과 확인
8. 모바일 반응형 확인

**Step 3: 빌드 검증**

```bash
npm run build
```

Expected: 빌드 성공, 에러 없음

**Step 4: 최종 커밋 (필요시)**

검증 중 발견한 이슈 수정 후 커밋.
