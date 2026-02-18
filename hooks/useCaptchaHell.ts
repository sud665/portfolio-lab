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
