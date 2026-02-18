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
