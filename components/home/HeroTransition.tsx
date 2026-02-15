"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ── Phase Data ── */
const phases = [
  {
    label: "Chapter 1 — Chemistry",
    title: "화학에서 시작된 끝없는 호기심",
    desc: "KCC에서 7년, 화학 소재 현장에서 산업의 비효율을 직접 마주하며 기술적 해결의 갈망이 시작되었습니다.",
    color: "chem",
    hex: "#00e5a0",
  },
  {
    label: "Chapter 2 — Code",
    title: "코드로 문제를 해결하는 개발자",
    desc: "풀스택 개발자로 전환, 다수의 서비스를 기획부터 배포·운영까지 전 과정을 경험했습니다.",
    color: "code",
    hex: "#6c5ce7",
  },
  {
    label: "Chapter 3 — AI",
    title: "AI와 함께 진화하는 미래",
    desc: "LangChain/LangGraph 기반 AI Agent 업무관리 시스템을 설계·구축하며 지능화의 시대를 열고 있습니다.",
    color: "ai",
    hex: "#ff6b6b",
  },
];

/* ── SVG Components ── */
function ChemistrySvg() {
  return (
    <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-64 md:w-64">
      {/* Benzene ring */}
      <polygon
        points="100,40 145,65 145,115 100,140 55,115 55,65"
        fill="none"
        stroke="#00e5a0"
        strokeWidth="2"
        opacity="0.8"
      />
      <polygon
        points="100,55 135,73 135,107 100,125 65,107 65,73"
        fill="none"
        stroke="#00e5a0"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Atoms */}
      {[
        [100, 40],
        [145, 65],
        [145, 115],
        [100, 140],
        [55, 115],
        [55, 65],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill="#00e5a0" opacity="0.9">
          <animate
            attributeName="r"
            values="3;5;3"
            dur={`${1.5 + i * 0.2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {/* Electron orbit */}
      <ellipse
        cx="100"
        cy="90"
        rx="80"
        ry="30"
        fill="none"
        stroke="#00e5a0"
        strokeWidth="0.5"
        opacity="0.3"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 100 90"
          to="360 100 90"
          dur="8s"
          repeatCount="indefinite"
        />
      </ellipse>
      {/* Outer bonds */}
      <line x1="100" y1="40" x2="100" y2="15" stroke="#00e5a0" strokeWidth="1.5" opacity="0.5" />
      <line x1="145" y1="65" x2="168" y2="52" stroke="#00e5a0" strokeWidth="1.5" opacity="0.5" />
      <line x1="55" y1="65" x2="32" y2="52" stroke="#00e5a0" strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function CodeSvg() {
  return (
    <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-64 md:w-64">
      {/* Monitor */}
      <rect x="30" y="30" width="140" height="100" rx="8" fill="none" stroke="#6c5ce7" strokeWidth="2" opacity="0.8" />
      <rect x="30" y="30" width="140" height="14" rx="8" fill="#6c5ce7" opacity="0.15" />
      {/* Code lines */}
      <rect x="48" y="58" width="50" height="4" rx="2" fill="#6c5ce7" opacity="0.6" />
      <rect x="48" y="70" width="70" height="4" rx="2" fill="#a29bfe" opacity="0.4" />
      <rect x="58" y="82" width="40" height="4" rx="2" fill="#6c5ce7" opacity="0.5" />
      <rect x="58" y="94" width="55" height="4" rx="2" fill="#a29bfe" opacity="0.3" />
      <rect x="48" y="106" width="30" height="4" rx="2" fill="#6c5ce7" opacity="0.6" />
      {/* Cursor */}
      <rect x="108" y="58" width="2" height="12" fill="#6c5ce7">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Stand */}
      <line x1="100" y1="130" x2="100" y2="155" stroke="#6c5ce7" strokeWidth="2" opacity="0.5" />
      <line x1="75" y1="155" x2="125" y2="155" stroke="#6c5ce7" strokeWidth="2" opacity="0.5" />
      {/* Floating symbols */}
      <text x="20" y="170" fill="#6c5ce7" fontSize="14" opacity="0.3" fontFamily="monospace">{"{ }"}</text>
      <text x="145" y="170" fill="#a29bfe" fontSize="14" opacity="0.3" fontFamily="monospace">{"</>"}</text>
    </svg>
  );
}

function AiSvg() {
  return (
    <svg viewBox="0 0 200 200" className="h-48 w-48 md:h-64 md:w-64">
      {/* Neural network background lines */}
      {[
        [30, 60, 80, 100],
        [80, 100, 120, 60],
        [120, 60, 170, 100],
        [80, 100, 120, 140],
        [30, 140, 80, 100],
        [120, 140, 170, 100],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ff6b6b" strokeWidth="0.5" opacity="0.2" />
      ))}
      {/* Robot head */}
      <rect x="65" y="50" width="70" height="60" rx="12" fill="none" stroke="#ff6b6b" strokeWidth="2" opacity="0.8" />
      {/* Eyes */}
      <circle cx="85" cy="80" r="6" fill="#ff6b6b" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="115" cy="80" r="6" fill="#ff6b6b" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite" />
      </circle>
      {/* Antenna */}
      <line x1="100" y1="50" x2="100" y2="30" stroke="#ff6b6b" strokeWidth="2" opacity="0.6" />
      <circle cx="100" cy="26" r="5" fill="#ff6b6b" opacity="0.6">
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Body */}
      <rect x="72" y="115" width="56" height="40" rx="8" fill="none" stroke="#ff6b6b" strokeWidth="2" opacity="0.6" />
      {/* Arms */}
      <line x1="72" y1="125" x2="50" y2="140" stroke="#ff6b6b" strokeWidth="2" opacity="0.5" />
      <line x1="128" y1="125" x2="150" y2="140" stroke="#ff6b6b" strokeWidth="2" opacity="0.5" />
      {/* Chest light */}
      <circle cx="100" cy="135" r="4" fill="#ff6b6b" opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ── Particles ── */
function Particles() {
  const colors = ["#00e5a0", "#6c5ce7", "#ff6b6b"];
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      color: string;
      duration: number;
      delay: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        color: colors[i % 3],
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
        opacity: 0.1 + Math.random() * 0.2,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          from { transform: translateY(0) translateX(0); }
          to { transform: translateY(-40px) translateX(20px); }
        }
      `}</style>
    </div>
  );
}

/* ── Main Component ── */
export function HeroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const phase1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
  const phase2Opacity = useTransform(scrollYProgress, [0.25, 0.33, 0.58, 0.66], [0, 1, 1, 0]);
  const phase3Opacity = useTransform(scrollYProgress, [0.58, 0.66, 1], [0, 1, 1]);

  const bgR = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 108, 255, 255]);
  const bgG = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [229, 92, 107, 107]);
  const bgB = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [160, 231, 107, 107]);

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const phaseIndex = useTransform(scrollYProgress, (v) =>
    v < 0.33 ? 0 : v < 0.66 ? 1 : 2
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* Background radial gradient */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              [bgR, bgG, bgB],
              ([r, g, b]) =>
                `radial-gradient(circle at 50% 50%, rgba(${r},${g},${b},0.08) 0%, transparent 70%)`
            ),
          }}
        />

        <Particles />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
          {/* Phase 1 */}
          <motion.div
            className="absolute flex flex-col items-center gap-6"
            style={{ opacity: phase1Opacity }}
          >
            <span className="rounded-full border border-chem/30 bg-chem/10 px-4 py-1 text-xs font-medium text-chem">
              {phases[0].label}
            </span>
            <ChemistrySvg />
            <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
              {phases[0].title}
            </h2>
            <p className="max-w-lg text-gray-400">{phases[0].desc}</p>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            className="absolute flex flex-col items-center gap-6"
            style={{ opacity: phase2Opacity }}
          >
            <span className="rounded-full border border-code/30 bg-code/10 px-4 py-1 text-xs font-medium text-code">
              {phases[1].label}
            </span>
            <CodeSvg />
            <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
              {phases[1].title}
            </h2>
            <p className="max-w-lg text-gray-400">{phases[1].desc}</p>
          </motion.div>

          {/* Phase 3 */}
          <motion.div
            className="absolute flex flex-col items-center gap-6"
            style={{ opacity: phase3Opacity }}
          >
            <span className="rounded-full border border-ai/30 bg-ai/10 px-4 py-1 text-xs font-medium text-ai">
              {phases[2].label}
            </span>
            <AiSvg />
            <h2 className="font-playfair text-3xl font-bold text-white md:text-4xl">
              {phases[2].title}
            </h2>
            <p className="max-w-lg text-gray-400">{phases[2].desc}</p>
          </motion.div>
        </div>

        {/* Progress indicator - desktop only */}
        <div className="absolute right-8 hidden flex-col items-center gap-0 md:flex" style={{ top: "50%", transform: "translateY(-50%)" }}>
          <div className="relative h-48 w-0.5 bg-white/10">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-chem via-code to-ai"
              style={{ height: progressHeight }}
            />
          </div>
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              className="absolute flex items-center gap-3"
              style={{ top: `${i * 50}%`, transform: "translateY(-50%)" }}
            >
              <motion.div
                className="h-3 w-3 rounded-full border-2"
                style={{
                  borderColor: phase.hex,
                  backgroundColor: useTransform(phaseIndex, (idx) =>
                    idx >= i ? phase.hex : "transparent"
                  ),
                }}
              />
              <motion.span
                className="whitespace-nowrap text-xs"
                style={{
                  color: useTransform(phaseIndex, (idx) =>
                    idx >= i ? phase.hex : "#666"
                  ),
                }}
              >
                {phase.label.split(" — ")[1]}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 flex flex-col items-center gap-2"
          style={{ opacity: scrollHintOpacity }}
        >
          <span className="text-xs text-gray-500">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="#666" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
