"use client";

import { ScrollReveal } from "@/components/common/ScrollReveal";

interface EducationEntry {
  institution: string;
  detail: string;
  period: string;
  icon: string;
  highlights: string[];
  accent: "chem" | "code";
}

const education: EducationEntry[] = [
  {
    institution: "코드스테이츠 (Code States)",
    detail: "Immersive Program 36기",
    period: "2021.09 - 2022.04",
    icon: "💻",
    highlights: [
      "자기주도 학습으로 JavaScript 기반 풀스택 과정 학습",
      "프론트엔드: React, React Hooks, Redux / 백엔드: Node.js, Express",
      "20주 동안 매일 알고리즘 문제풀이",
      "웹개발 과제 수행 및 페어 프로그래밍과 코드 리뷰 경험",
      "협업 프로젝트 2회 진행",
    ],
    accent: "code",
  },
  {
    institution: "광운대학교",
    detail: "화학공학과 전공",
    period: "2007.03 - 2014.08",
    icon: "🎓",
    highlights: [],
    accent: "chem",
  },
];

interface LanguageScore {
  test: string;
  score: string;
  date: string;
  flag: string;
}

const languages: LanguageScore[] = [
  { test: "TOEIC", score: "845점", date: "2014.02.15", flag: "🇺🇸" },
  { test: "TOEIC Speaking", score: "Level 6", date: "2017.09.12", flag: "🇺🇸" },
];

const accentMap: Record<string, { border: string; dot: string; badge: string }> = {
  chem: {
    border: "border-chem/15",
    dot: "bg-chem",
    badge: "bg-chem/10 text-chem border-chem/20",
  },
  code: {
    border: "border-code/15",
    dot: "bg-code",
    badge: "bg-code/10 text-code border-code/20",
  },
};

export function Education() {
  return (
    <section aria-label="학력 & 어학" className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Education
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            학력 & 어학
          </h2>
        </div>
      </ScrollReveal>

      {/* Education cards */}
      <div className="space-y-5">
        {education.map((edu, i) => {
          const accent = accentMap[edu.accent];

          return (
            <ScrollReveal key={edu.institution} delay={i * 0.1}>
              <div
                className={`rounded-2xl border ${accent.border} bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg md:p-8`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{edu.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white md:text-lg">
                        {edu.institution}
                      </h3>
                      <p className="mt-0.5 text-sm text-gray-400">
                        {edu.detail}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-lg border px-3 py-1 text-xs font-semibold ${accent.badge}`}
                  >
                    {edu.period}
                  </span>
                </div>

                {edu.highlights.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {edu.highlights.map((h, hi) => (
                      <li
                        key={hi}
                        className="flex items-start gap-2.5 text-sm text-gray-400"
                      >
                        <span
                          className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot} opacity-50`}
                        />
                        <span className="leading-relaxed">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Language scores */}
      <ScrollReveal delay={0.25}>
        <div className="mt-8 rounded-2xl border border-amber/15 bg-card/60 p-6 backdrop-blur-sm md:p-8">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-amber" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber">
              Languages
            </h3>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {languages.map((lang) => (
              <div
                key={lang.test}
                className="flex items-center justify-between rounded-xl border border-card-border bg-card/40 px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{lang.flag}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {lang.test}
                    </p>
                    <p className="mt-0.5 text-[10px] text-gray-500">
                      {lang.date}
                    </p>
                  </div>
                </div>
                <span className="font-outfit text-lg font-bold text-amber">
                  {lang.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
