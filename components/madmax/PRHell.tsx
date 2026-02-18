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
