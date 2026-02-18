# MADMAX LAB V3 (테크 밈 실험 5개) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 테크 밈 컨셉의 인터랙티브 실험 5개(AIReviewer, CenterDiv, NodeModules, WorksOnMyMachine, PRHell)를 MADMAX LAB에 추가한다.

**Architecture:** 기존 madmax 실험 패턴(섹션 헤더 + 카드 컨테이너 + 단계별 상태 머신)을 그대로 따른다. 각 실험은 `components/madmax/`에 1파일 1컴포넌트로 생성하고, `app/madmax/page.tsx`에 통합한다.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4 (@theme), Framer Motion, lucide-react, TypeScript strict

---

### Task 1: AIReviewer 컴포넌트

**Files:**
- Create: `components/madmax/AIReviewer.tsx`

**Step 1: 컴포넌트 작성**

```tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageSquare } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "writing" | "reviewing" | "result";

interface ReviewComment {
  id: number;
  text: string;
  severity: "info" | "warning" | "error";
  typedText: string;
  done: boolean;
}

const REASONABLE_COMMENTS = [
  { text: "변수명이 불분명합니다. 좀 더 서술적인 이름을 사용하세요.", severity: "info" as const },
  { text: "매직 넘버를 상수로 추출하세요.", severity: "info" as const },
  { text: "이 함수는 단일 책임 원칙을 위반합니다.", severity: "info" as const },
  { text: "타입 선언이 누락되었습니다.", severity: "info" as const },
];

const WEIRD_COMMENTS = [
  { text: "이 함수는 너무 외로워 보입니다. 친구 함수를 만들어주세요.", severity: "warning" as const },
  { text: "들여쓰기에서 슬픔이 느껴집니다.", severity: "warning" as const },
  { text: "이 변수는 존재의 의미를 찾지 못한 것 같습니다.", severity: "warning" as const },
  { text: "코드에서 미묘한 허무주의가 감지됩니다.", severity: "warning" as const },
];

const INSANE_COMMENTS = [
  { text: "바이브가 안 맞습니다. Rejected.", severity: "error" as const },
  { text: "세미콜론에서 분노가 느껴집니다.", severity: "error" as const },
  { text: "코드를 소리 내어 읽어보셨나요? 운율이 맞지 않습니다.", severity: "error" as const },
  { text: "이 코드는 풍수지리적으로 좋지 않은 위치에 있습니다.", severity: "error" as const },
  { text: "화요일에 작성된 코드는 리뷰할 수 없습니다.", severity: "error" as const },
  { text: "이 PR은 보름달에만 머지할 수 있습니다.", severity: "error" as const },
  { text: "코드에서 커피 냄새가 납니다. 차로 바꾸세요.", severity: "error" as const },
  { text: "폰트가 마음에 안 듭니다.", severity: "error" as const },
];

function pickComments(): { text: string; severity: "info" | "warning" | "error" }[] {
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
  return [
    ...shuffle(REASONABLE_COMMENTS).slice(0, 2),
    ...shuffle(WEIRD_COMMENTS).slice(0, 2),
    ...shuffle(INSANE_COMMENTS).slice(0, 2),
  ];
}

const DEFAULT_CODE = `function add(a, b) {
  return a + b;
}

const x = add(1, 2);
console.log(x);`;

export function AIReviewer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [currentComment, setCurrentComment] = useState(0);
  const [score] = useState(() => Math.floor(Math.random() * 30) + 10);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
  }, []);

  const handleStart = () => {
    if (!code.trim()) return;
    const picked = pickComments();
    setComments(
      picked.map((c, i) => ({
        id: i,
        text: c.text,
        severity: c.severity,
        typedText: "",
        done: false,
      })),
    );
    setCurrentComment(0);
    setPhase("reviewing");
  };

  // 타이핑 애니메이션
  useEffect(() => {
    if (phase !== "reviewing") return;
    if (currentComment >= comments.length) {
      setTimeout(() => setPhase("result"), 600);
      return;
    }

    const comment = comments[currentComment];
    if (!comment) return;
    let charIndex = 0;

    typingRef.current = setInterval(() => {
      charIndex++;
      setComments((prev) =>
        prev.map((c, i) =>
          i === currentComment
            ? { ...c, typedText: c.text.slice(0, charIndex) }
            : c,
        ),
      );

      if (charIndex >= comment.text.length) {
        cleanup();
        setComments((prev) =>
          prev.map((c, i) =>
            i === currentComment ? { ...c, done: true } : c,
          ),
        );
        setTimeout(() => setCurrentComment((c) => c + 1), 400);
      }
    }, 30);

    return cleanup;
  }, [phase, currentComment, comments, cleanup]);

  const handleReset = () => {
    cleanup();
    setPhase("idle");
    setComments([]);
    setCurrentComment(0);
  };

  const severityColor = {
    info: "border-code/30 bg-code/5 text-code",
    warning: "border-amber/30 bg-amber/5 text-amber",
    error: "border-chem/30 bg-chem/5 text-chem",
  };

  const severityLabel = {
    info: "INFO",
    warning: "WARNING",
    error: "CRITICAL",
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
            Experiment #011
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            AI 코드 리뷰어
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            당신의 코드를 AI가 리뷰합니다. 점점 이상해집니다.
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
          {/* 시작: 코드 입력 */}
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-96 flex-col items-center justify-center px-6 text-center"
            >
              <Bot size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                AI 코드 리뷰 봇 v0.0.1
              </h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                코드를 입력하고 리뷰를 요청하세요. AI가 성심성의껏 리뷰해드립니다.
              </p>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={5}
                spellCheck={false}
                className="mt-4 w-full max-w-md rounded-lg border border-card-border bg-dark px-4 py-3 font-mono text-xs text-mad/80 placeholder:text-gray-600 focus:border-mad/30 focus:outline-none"
                placeholder="코드를 입력하세요..."
              />
              <button
                onClick={handleStart}
                disabled={!code.trim()}
                className="mt-4 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)] disabled:opacity-50"
              >
                리뷰 요청
              </button>
            </motion.div>
          )}

          {/* 리뷰 중: 코멘트가 하나씩 나타남 */}
          {phase === "reviewing" && (
            <motion.div
              key="reviewing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-8 md:px-8"
            >
              <div className="mb-4 flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 rounded-full border-2 border-mad/20 border-t-mad"
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-mad/70">
                  AI Reviewing...
                </span>
                <span className="font-mono text-[10px] text-gray-600">
                  {comments.filter((c) => c.done).length}/{comments.length} comments
                </span>
              </div>

              <div className="mx-auto max-w-lg space-y-3">
                {comments.slice(0, currentComment + 1).map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-lg border px-4 py-3 ${severityColor[comment.severity]}`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <MessageSquare size={10} />
                      <span className="font-mono text-[10px] font-bold uppercase">
                        {severityLabel[comment.severity]}
                      </span>
                    </div>
                    <p className="font-mono text-xs">
                      {comment.typedText}
                      {!comment.done && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          █
                        </motion.span>
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 결과 */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex h-auto min-h-96 flex-col items-center justify-center px-6 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Bot size={48} className="mx-auto text-chem" />
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-chem">
                리뷰 완료
              </h3>

              {/* 코드 품질 점수 */}
              <div className="mt-4 rounded-xl border border-card-border bg-dark/50 px-8 py-4">
                <p className="font-mono text-[10px] text-gray-600">코드 품질 점수</p>
                <p className="font-mono text-4xl font-bold text-chem">{score}/100</p>
              </div>

              {/* 코멘트 요약 */}
              <div className="mx-auto mt-4 max-w-md space-y-2">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-lg border px-3 py-2 text-left ${severityColor[c.severity]}`}
                  >
                    <span className="font-mono text-[10px] font-bold uppercase">
                      {severityLabel[c.severity]}
                    </span>
                    <p className="font-mono text-[11px]">{c.text}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-mono text-[10px] text-gray-600">
                리뷰어 감정 상태: 지침 · 평가 시간: {(Math.random() * 0.5 + 0.1).toFixed(2)}초
              </p>

              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                다시 리뷰 요청
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
```

**Step 2: 빌드 확인**

Run: `npm run build 2>&1 | tail -5`
Expected: 컴포넌트 단독으로는 import되지 않으므로 빌드 오류 없음

**Step 3: 커밋**

```bash
git add components/madmax/AIReviewer.tsx
git commit -m "feat: add AIReviewer experiment (#011)"
```

---

### Task 2: CenterDiv 컴포넌트

**Files:**
- Create: `components/madmax/CenterDiv.tsx`

**Step 1: 컴포넌트 작성**

```tsx
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
    spin: { rotate: 720, scale: 0.5, transition: { duration: 1.5, ease: "linear" } },
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
```

**Step 2: 커밋**

```bash
git add components/madmax/CenterDiv.tsx
git commit -m "feat: add CenterDiv experiment (#012)"
```

---

### Task 3: NodeModules 컴포넌트

**Files:**
- Create: `components/madmax/NodeModules.tsx`

**Step 1: 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/NodeModules.tsx
git commit -m "feat: add NodeModules experiment (#013)"
```

---

### Task 4: WorksOnMyMachine 컴포넌트

**Files:**
- Create: `components/madmax/WorksOnMyMachine.tsx`

**Step 1: 컴포넌트 작성**

```tsx
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
```

**Step 2: 커밋**

```bash
git add components/madmax/WorksOnMyMachine.tsx
git commit -m "feat: add WorksOnMyMachine experiment (#014)"
```

---

### Task 5: PRHell 컴포넌트

**Files:**
- Create: `components/madmax/PRHell.tsx`

**Step 1: 컴포넌트 작성**

```tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitPullRequest, MessageCircle, Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Phase = "idle" | "submitted" | "result";

interface PRComment {
  id: number;
  reviewer: string;
  avatar: string;
  text: string;
  resolved: boolean;
  isNew?: boolean;
}

const INITIAL_COMMENTS: Omit<PRComment, "id" | "resolved">[] = [
  { reviewer: "@senior-dev", avatar: "👨‍💻", text: "변수명이 불분명합니다. `x`는 무엇을 의미하나요?" },
  { reviewer: "@clean-coder", avatar: "🧹", text: "상수 ONE을 선언해서 사용하세요: `const ONE = 1;`" },
  { reviewer: "@semicolon-fan", avatar: "⚡", text: "세미콜론을 추가해주세요." },
  { reviewer: "@test-zealot", avatar: "🧪", text: "const 선언에 대한 유닛 테스트가 없습니다." },
  { reviewer: "@design-reviewer", avatar: "🎨", text: "이 코드의 폰트가 마음에 안 듭니다." },
  { reviewer: "@bot", avatar: "🤖", text: "이 PR은 47일째 열려있습니다. 머지하시겠습니까?" },
];

const HYDRA_COMMENTS: Omit<PRComment, "id" | "resolved">[] = [
  { reviewer: "@no-semicolon", avatar: "🚫", text: "세미콜론을 제거해주세요. (반대 의견)" },
  { reviewer: "@tabs-over-spaces", avatar: "⌨️", text: "탭 대신 스페이스를 사용하고 있습니다. 수정해주세요." },
  { reviewer: "@spaces-over-tabs", avatar: "🔤", text: "스페이스 대신 탭을 사용해주세요. (반대 의견)" },
  { reviewer: "@performance-guru", avatar: "🏎️", text: "이 한 줄이 O(n)인 것 같습니다. O(1)로 최적화해주세요." },
  { reviewer: "@accessibility-bot", avatar: "♿", text: "이 변수에 aria-label이 없습니다." },
  { reviewer: "@security-scanner", avatar: "🔒", text: "이 코드에서 잠재적 SQL injection이 감지됩니다. (const x = 1인데요?)" },
  { reviewer: "@grammar-nazi", avatar: "📝", text: "변수명에 오타가 있습니다. x → χ (그리스 문자)로 수정해주세요." },
  { reviewer: "@senior-dev", avatar: "👨‍💻", text: "아까 코멘트 해결했다고요? 다시 보니 마음이 바뀌었습니다." },
  { reviewer: "@intern", avatar: "🐣", text: "저라면 이렇게 안 할 것 같습니다. (이유는 모름)" },
  { reviewer: "@pm", avatar: "📊", text: "이 PR에 JIRA 티켓 번호가 없습니다." },
  { reviewer: "@ceo", avatar: "👔", text: "이 코드가 OKR에 align되나요?" },
  { reviewer: "@ai-reviewer", avatar: "🤖", text: "이 코드에서 바이브가 안 맞습니다. Vibe check 실패." },
  { reviewer: "@legal-team", avatar: "⚖️", text: "이 변수명이 상표권을 침해할 수 있습니다." },
  { reviewer: "@feng-shui-dev", avatar: "🧘", text: "이 코드는 풍수지리적으로 좋지 않습니다." },
];

export function PRHell() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [comments, setComments] = useState<PRComment[]>([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const nextIdRef = useRef(0);
  const hydraIndexRef = useRef(0);

  const handleStart = () => {
    const initial = INITIAL_COMMENTS.map((c, i) => ({
      ...c,
      id: i,
      resolved: false,
    }));
    nextIdRef.current = initial.length;
    hydraIndexRef.current = 0;
    setComments(initial);
    setResolvedCount(0);
    setTotalSpawned(initial.length);
    setStartTime(Date.now());
    setPhase("submitted");
  };

  // 경과 시간 트래커
  useEffect(() => {
    if (phase !== "submitted") return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, startTime]);

  const handleResolve = useCallback((commentId: number) => {
    setComments((prev) => {
      const updated = prev.map((c) =>
        c.id === commentId ? { ...c, resolved: true } : c,
      );

      // 히드라: 1개 해결 → 2개 생성
      const newComments: PRComment[] = [];
      for (let i = 0; i < 2; i++) {
        const hydra = HYDRA_COMMENTS[hydraIndexRef.current % HYDRA_COMMENTS.length]!;
        hydraIndexRef.current++;
        newComments.push({
          ...hydra,
          id: nextIdRef.current++,
          resolved: false,
          isNew: true,
        });
      }

      setTotalSpawned((c) => c + 2);
      setResolvedCount((c) => c + 1);

      return [...updated, ...newComments];
    });
  }, []);

  const handleMerge = () => {
    setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    setPhase("result");
  };

  const handleReset = () => {
    setPhase("idle");
    setComments([]);
    setResolvedCount(0);
    setTotalSpawned(0);
    setElapsedTime(0);
  };

  const unresolvedCount = comments.filter((c) => !c.resolved).length;

  const getSurvivalGrade = () => {
    if (resolvedCount >= 10) return { grade: "S", title: "PR 서바이벌 챔피언", color: "text-mad" };
    if (resolvedCount >= 6) return { grade: "A", title: "코드 리뷰 전사", color: "text-mad-light" };
    if (resolvedCount >= 3) return { grade: "B", title: "머지 희망자", color: "text-amber" };
    return { grade: "C", title: "Draft PR 전문가", color: "text-gray-500" };
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
            Experiment #015
          </span>
          <h2 className="mt-4 font-playfair text-2xl font-bold text-white md:text-3xl">
            PR 리뷰 지옥
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            1줄짜리 PR에 코멘트가 47개. Resolve하면 히드라처럼 2개가 생겨납니다.
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
              <GitPullRequest size={40} className="text-mad/50" />
              <h3 className="mt-4 font-playfair text-lg font-bold text-white">
                Pull Request #4827
              </h3>
              <div className="mt-3 rounded-lg border border-card-border bg-dark/80 px-4 py-3">
                <p className="font-mono text-[10px] text-gray-600">feat: add constant</p>
                <div className="mt-2 rounded border border-card-border bg-dark px-3 py-2">
                  <p className="font-mono text-xs">
                    <span className="text-mad">+ const x = 1;</span>
                  </p>
                </div>
                <p className="mt-2 font-mono text-[10px] text-gray-600">
                  1 file changed, 1 insertion(+)
                </p>
              </div>
              <button
                onClick={handleStart}
                className="mt-6 rounded-full bg-mad px-8 py-3 font-semibold text-dark transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(57,255,20,0.3)]"
              >
                PR 제출하기
              </button>
            </motion.div>
          )}

          {/* PR 리뷰 진행 */}
          {phase === "submitted" && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-auto min-h-96"
            >
              {/* 상태 바 */}
              <div className="flex items-center justify-between border-b border-card-border bg-dark/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <GitPullRequest size={14} className="text-mad" />
                  <span className="font-mono text-xs text-white">PR #4827</span>
                  <span className="rounded bg-amber/10 px-2 py-0.5 font-mono text-[10px] text-amber">
                    Changes Requested
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="text-chem">{unresolvedCount} unresolved</span>
                  <span className="text-gray-600">{resolvedCount} resolved</span>
                  <span className="text-gray-600">{elapsedTime}s</span>
                </div>
              </div>

              {/* PR 코드 */}
              <div className="border-b border-card-border bg-dark/30 px-4 py-2">
                <p className="font-mono text-xs">
                  <span className="text-gray-600">1 </span>
                  <span className="text-mad">+ const x = 1;</span>
                </p>
              </div>

              {/* 코멘트 목록 */}
              <div className="max-h-64 overflow-y-auto px-4 py-3">
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {comments
                      .filter((c) => !c.resolved)
                      .map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                            comment.isNew
                              ? "border-chem/20 bg-chem/5"
                              : "border-card-border bg-dark/50"
                          }`}
                        >
                          <span className="mt-0.5 text-base">{comment.avatar}</span>
                          <div className="flex-1">
                            <p className="font-mono text-[10px] font-bold text-gray-500">
                              {comment.reviewer}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-300">{comment.text}</p>
                          </div>
                          <button
                            onClick={() => handleResolve(comment.id)}
                            className="flex-shrink-0 rounded border border-card-border px-2 py-1 font-mono text-[9px] text-gray-500 transition-colors hover:border-mad/30 hover:text-mad"
                          >
                            Resolve
                          </button>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* 머지 버튼 */}
              <div className="border-t border-card-border px-4 py-3 text-center">
                <p className="mb-2 font-mono text-[10px] text-gray-600">
                  총 코멘트: {totalSpawned} · 해결: {resolvedCount} · 미해결: {unresolvedCount}
                </p>
                <button
                  onClick={handleMerge}
                  className="rounded-lg border border-mad/30 bg-mad/10 px-6 py-2 font-mono text-xs font-semibold text-mad transition-all duration-200 hover:bg-mad/20"
                >
                  강제 Merge (YOLO)
                </button>
              </div>
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Check size={48} className="mx-auto text-mad" />
              </motion.div>
              <h3 className="mt-4 font-playfair text-xl font-bold text-mad">
                PR Merged! 🎉
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                1줄 코드가 드디어 머지되었습니다
              </p>

              <div className="mt-4 rounded-xl border border-card-border bg-dark/50 px-6 py-4">
                <p className="font-mono text-[10px] text-gray-600">PR 서바이벌 등급</p>
                <p className={`mt-1 font-mono text-4xl font-bold ${getSurvivalGrade().color}`}>
                  {getSurvivalGrade().grade}
                </p>
                <p className={`mt-1 font-mono text-xs ${getSurvivalGrade().color}`}>
                  {getSurvivalGrade().title}
                </p>
              </div>

              <div className="mt-3 font-mono text-[10px] text-gray-600">
                <p>총 코멘트: {totalSpawned}개 · 해결: {resolvedCount}개</p>
                <p>머지까지 소요: {elapsedTime}초</p>
              </div>

              <button
                onClick={handleReset}
                className="mt-6 rounded-lg border border-card-border px-6 py-2 font-mono text-xs text-gray-400 transition-colors duration-200 hover:border-mad/30 hover:text-mad"
              >
                새 PR 제출
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
git add components/madmax/PRHell.tsx
git commit -m "feat: add PRHell experiment (#015)"
```

---

### Task 6: 페이지 통합

**Files:**
- Modify: `app/madmax/page.tsx`

**Step 1: import 추가 및 컴포넌트 배치**

`app/madmax/page.tsx`에 5개 새 실험 import + JSX 추가:

```tsx
import type { Metadata } from "next";

import { LAB_EXPERIMENTS } from "@/lib/constants";

import { MadmaxHero } from "@/components/madmax/MadmaxHero";
import { LabGrid } from "@/components/madmax/LabGrid";
import { RunawayButton } from "@/components/madmax/RunawayButton";
import { PasswordHell } from "@/components/madmax/PasswordHell";
import { DontPress } from "@/components/madmax/DontPress";
import { LieDetector } from "@/components/madmax/LieDetector";
import { InfiniteLoading } from "@/components/madmax/InfiniteLoading";
import { FortuneLab } from "@/components/madmax/Fortunelab";
import { ConsentHell } from "@/components/madmax/ConsentHell";
import { CookieBoss } from "@/components/madmax/CookieBoss";
import { CursedSlider } from "@/components/madmax/CursedSlider";
import { FakeUpdate } from "@/components/madmax/FakeUpdate";
import { CaptchaHell } from "@/components/madmax/CaptchaHell";
import { AIReviewer } from "@/components/madmax/AIReviewer";
import { CenterDiv } from "@/components/madmax/CenterDiv";
import { NodeModules } from "@/components/madmax/NodeModules";
import { WorksOnMyMachine } from "@/components/madmax/WorksOnMyMachine";
import { PRHell } from "@/components/madmax/PRHell";

export const metadata: Metadata = {
  title: "MADMAX LAB — 희안한 거 만드는 연구실",
  description:
    "매드맥스 연구실. 실험적인 웹서비스 아이디어를 만들고 검증하는 공간.",
  openGraph: {
    title: "MADMAX LAB",
    description: "희안한 거 만드는 연구실",
  },
};

export default function MadmaxPage() {
  return (
    <>
      <MadmaxHero />
      <RunawayButton />
      <PasswordHell />
      <DontPress />
      <LieDetector />
      <InfiniteLoading />
      <FortuneLab />
      <ConsentHell />
      <CookieBoss />
      <CursedSlider />
      <FakeUpdate />
      <CaptchaHell />
      <AIReviewer />
      <CenterDiv />
      <NodeModules />
      <WorksOnMyMachine />
      <PRHell />
      <LabGrid experiments={LAB_EXPERIMENTS} />
    </>
  );
}
```

**Step 2: 커밋**

```bash
git add app/madmax/page.tsx
git commit -m "feat: integrate V3 experiments into madmax page"
```

---

### Task 7: 빌드 검증

**Step 1: 빌드 실행**

Run: `npm run build 2>&1 | tail -20`
Expected: 빌드 성공, 모든 라우트 정상 생성

**Step 2: 문제 발생 시 수정**

빌드 에러가 발생하면 해당 파일을 수정하고 다시 빌드.

**Step 3: 빌드 성공 확인 후 커밋 (필요한 경우만)**

에러 수정이 있었다면:
```bash
git add -A && git commit -m "fix: resolve build errors in V3 experiments"
```
