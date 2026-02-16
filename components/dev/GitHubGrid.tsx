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

const intensityClasses = [
  "bg-white/5",
  "bg-code/20",
  "bg-code/40",
  "bg-code/60",
  "bg-code/90",
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
      }),
    );
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          GitHub Activity
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="relative overflow-x-auto rounded-xl border border-card-border bg-card p-6">
          <div className="mx-auto flex w-fit gap-[3px]">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((intensity, di) => {
                  const contributions = intensity * 3;
                  return (
                    <div
                      key={di}
                      className={`h-[11px] w-[11px] rounded-sm ${intensityClasses[intensity]}`}
                      onMouseEnter={(e) => {
                        const rect =
                          e.currentTarget.getBoundingClientRect();
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
            {intensityClasses.map((cls, i) => (
              <div
                key={i}
                className={`h-[11px] w-[11px] rounded-sm border border-card-border ${cls}`}
              />
            ))}
            <span>More</span>
          </div>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2 py-1 text-xs text-white"
              style={{ left: tooltip.x, top: tooltip.y }}>
              {tooltip.text}
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
