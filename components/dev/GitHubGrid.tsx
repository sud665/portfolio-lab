"use client";

import { useState, useMemo } from "react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const WEEKS = 52;
const DAYS = 7;

const intensityColors = [
  "transparent",
  "rgba(108,92,231,0.2)",
  "rgba(108,92,231,0.4)",
  "rgba(108,92,231,0.6)",
  "rgba(108,92,231,0.9)",
];

export function GitHubGrid() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const grid = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: WEEKS }, () =>
      Array.from({ length: DAYS }, () => {
        const r = rand();
        if (r < 0.3) return 0;
        if (r < 0.55) return 1;
        if (r < 0.75) return 2;
        if (r < 0.9) return 3;
        return 4;
      })
    );
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          GitHub Activity
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="relative overflow-x-auto rounded-xl border border-card-border bg-card p-6">
          <div
            className="mx-auto flex gap-[3px]"
            style={{ width: "fit-content" }}
          >
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((intensity, di) => {
                  const contributions = intensity * 3;
                  return (
                    <div
                      key={di}
                      className="h-[11px] w-[11px] rounded-sm"
                      style={{
                        backgroundColor:
                          intensityColors[intensity] || "transparent",
                      }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          text: `${contributions} contributions`,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1 text-xs text-gray-500">
            <span>Less</span>
            {intensityColors.map((color, i) => (
              <div
                key={i}
                className="h-[11px] w-[11px] rounded-sm border border-card-border"
                style={{ backgroundColor: color }}
              />
            ))}
            <span>More</span>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2 py-1 text-xs text-white"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
