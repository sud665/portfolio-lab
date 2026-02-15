"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TerminalHeroProps {
  name: string;
}

const lines = [
  { type: "cmd", text: "$ whoami" },
  { type: "out", text: "" },
  { type: "cmd", text: "$ experience --years" },
  { type: "out", text: "> 4y_dev + 7y_chemical_engineering" },
  { type: "cmd", text: "$ stack --primary" },
  { type: "out", text: "> Next.js | React | Nest.js | AI_Agent" },
  { type: "cmd", text: "$ status" },
  { type: "out", text: "> open_to_opportunities ✓" },
];

export function TerminalHero({ name }: TerminalHeroProps) {
  const [visibleLines, setVisibleLines] = useState<
    { type: string; text: string; displayed: string }[]
  >([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const resolvedLines = lines.map((l) =>
    l.text === "" && l.type === "out"
      ? { ...l, text: `> fullstack_developer (${name})` }
      : l
  );

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentLine >= resolvedLines.length) return;

    const line = resolvedLines[currentLine];
    const text = line.text;

    if (currentChar < text.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => {
          const updated = [...prev];
          if (updated.length <= currentLine) {
            updated.push({ ...line, displayed: text[0] });
          } else {
            updated[currentLine] = {
              ...line,
              displayed: text.slice(0, currentChar + 1),
            };
          }
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar, resolvedLines]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-xl border border-card-border"
        style={{ background: "#0d0d14" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-card-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 font-mono text-xs text-gray-500">
            terminal — portfolio
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 font-mono text-sm leading-7 md:text-base">
          {visibleLines.map((line, i) => (
            <div key={i} className="flex">
              <span
                className={
                  line.type === "cmd" ? "text-gray-500" : "text-chem"
                }
              >
                {line.displayed}
                {i === currentLine - 1 || (i === visibleLines.length - 1 && currentLine < resolvedLines.length) ? null : null}
              </span>
            </div>
          ))}
          {currentLine < resolvedLines.length && (
            <span
              className="inline-block w-2 text-chem"
              style={{ opacity: showCursor ? 1 : 0 }}
            >
              |
            </span>
          )}
          {currentLine >= resolvedLines.length && (
            <div className="flex">
              <span className="text-gray-500">$ </span>
              <span
                className="inline-block w-2 text-chem"
                style={{ opacity: showCursor ? 1 : 0 }}
              >
                |
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
