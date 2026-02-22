"use client";

import { useState, useMemo } from "react";

const ELEMENT_SYMBOLS = [
  "He","Li","Be","Na","Mg","Al","Si","Fe","Co","Ni","Cu","Zn","Ag","Au","Pt",
];

const COLOR_NAMES = [
  "red","blue","green","yellow","orange","purple","pink","black","white","gray",
];

const ROMAN_NUMERALS = ["Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ","Ⅷ","Ⅸ","Ⅹ"];

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function getDigitSum(str: string): number {
  return str.split("").reduce((sum, ch) => {
    const n = parseInt(ch, 10);
    return isNaN(n) ? sum : sum + n;
  }, 0);
}

function getDayKorean(): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[new Date().getDay()];
}

function hasEmoji(str: string): boolean {
  const emojiRegex = /\p{Extended_Pictographic}/u;
  return emojiRegex.test(str);
}

export interface Rule {
  id: number;
  text: string;
  check: (pw: string) => boolean;
}

export interface RuleResult extends Rule {
  passed: boolean;
}

function getRules(): Rule[] {
  const dayKr = getDayKorean();
  return [
    {
      id: 1,
      text: "5자 이상이어야 합니다",
      check: (pw) => [...pw].length >= 5,
    },
    {
      id: 2,
      text: "대문자를 포함해야 합니다",
      check: (pw) => /[A-Z]/.test(pw),
    },
    {
      id: 3,
      text: "숫자를 포함해야 합니다",
      check: (pw) => /\d/.test(pw),
    },
    {
      id: 4,
      text: "특수문자를 포함해야 합니다 (!@#$%...)",
      check: (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pw),
    },
    {
      id: 5,
      text: '"password"를 포함해야 합니다',
      check: (pw) => pw.toLowerCase().includes("password"),
    },
    {
      id: 6,
      text: "숫자의 합이 25여야 합니다",
      check: (pw) => getDigitSum(pw) === 25,
    },
    {
      id: 7,
      text: "화학 원소 기호를 포함해야 합니다 (He, Na, Fe...)",
      check: (pw) => ELEMENT_SYMBOLS.some((el) => pw.includes(el)),
    },
    {
      id: 8,
      text: "이모지를 포함해야 합니다",
      check: (pw) => hasEmoji(pw),
    },
    {
      id: 9,
      text: "로마 숫자를 포함해야 합니다 (Ⅳ, Ⅶ...)",
      check: (pw) => ROMAN_NUMERALS.some((r) => pw.includes(r)),
    },
    {
      id: 10,
      text: '"ㅋ"을 3개 이상 포함해야 합니다',
      check: (pw) => (pw.match(/ㅋ/g) || []).length >= 3,
    },
    {
      id: 11,
      text: `오늘 요일을 한글로 포함해야 합니다 (오늘: ${dayKr})`,
      check: (pw) => pw.includes(dayKr),
    },
    {
      id: 12,
      text: "비밀번호 길이가 소수여야 합니다",
      check: (pw) => isPrime([...pw].length),
    },
    {
      id: 13,
      text: "색상 이름을 영어로 포함해야 합니다 (red, blue...)",
      check: (pw) => COLOR_NAMES.some((c) => pw.toLowerCase().includes(c)),
    },
    {
      id: 14,
      text: "π의 처음 5자리를 포함해야 합니다 (3.141)",
      check: (pw) => pw.includes("3.141"),
    },
    {
      id: 15,
      text: "이 모든 것을 만족하면서 40자 이내여야 합니다",
      check: (pw) => [...pw].length <= 40,
    },
  ];
}

export function usePasswordHell() {
  const [password, setPassword] = useState("");
  const rules = useMemo(() => getRules(), []);

  const ruleResults: RuleResult[] = useMemo(() => {
    return rules.map((rule) => ({
      ...rule,
      passed: rule.check(password),
    }));
  }, [password, rules]);

  const visibleCount = useMemo(() => {
    let count = 1;
    for (let i = 0; i < ruleResults.length; i++) {
      if (ruleResults[i].passed) {
        count = Math.max(count, i + 2);
      }
    }
    return Math.min(count, rules.length);
  }, [ruleResults, rules.length]);

  const allPassed = ruleResults.every((r) => r.passed);
  const passedCount = ruleResults.filter((r) => r.passed).length;
  const totalCount = rules.length;
  const charLength = [...password].length;
  const digitSum = getDigitSum(password);
  const isPrimeLength = isPrime(charLength);

  return {
    password,
    setPassword,
    ruleResults,
    visibleCount,
    allPassed,
    passedCount,
    totalCount,
    charLength,
    digitSum,
    isPrimeLength,
  };
}
