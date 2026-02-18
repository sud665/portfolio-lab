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
