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

interface TerminalLine {
  type: string;
  text: string;
  displayed: string;
}

export function TerminalHero({ name }: TerminalHeroProps) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const resolvedLines = lines.map((l) =>
    l.text === "" && l.type === "out"
      ? { ...l, text: `> fullstack_developer (${name})` }
      : l,
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
    <section className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden rounded-xl border border-card-border bg-terminal">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-card-border px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-chem/80" />
          <span className="h-3 w-3 rounded-full bg-amber/80" />
          <span className="h-3 w-3 rounded-full bg-ai/80" />
          <span className="ml-3 font-mono text-xs text-gray-500">
            terminal — portfolio
          </span>
        </div>

        {/* Terminal content */}
        <div className="p-6 font-mono text-sm leading-7 md:text-base">
          {visibleLines.map((line, i) => (
            <div key={i}>
              <span
                className={
                  line.type === "cmd" ? "text-gray-500" : "text-chem"
                }>
                {line.displayed}
              </span>
            </div>
          ))}
          {currentLine < resolvedLines.length && (
            <span
              className={`inline-block w-2 text-chem ${showCursor ? "opacity-100" : "opacity-0"}`}>
              |
            </span>
          )}
          {currentLine >= resolvedLines.length && (
            <div>
              <span className="text-gray-500">$ </span>
              <span
                className={`inline-block w-2 text-chem ${showCursor ? "opacity-100" : "opacity-0"}`}>
                |
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
