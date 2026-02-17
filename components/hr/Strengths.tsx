"use client";

import { techStacks } from "@/lib/constants";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const categoryAccent: Record<
  string,
  { label: string; border: string; bg: string; text: string; dot: string; highlightBorder: string; highlightBg: string; highlightText: string }
> = {
  Frontend: {
    label: "text-code",
    border: "border-code/15",
    bg: "bg-code/[0.06]",
    text: "text-code/80",
    dot: "bg-code",
    highlightBorder: "border-code/30",
    highlightBg: "bg-code/12",
    highlightText: "text-code",
  },
  Backend: {
    label: "text-chem",
    border: "border-chem/15",
    bg: "bg-chem/[0.06]",
    text: "text-chem/80",
    dot: "bg-chem",
    highlightBorder: "border-chem/30",
    highlightBg: "bg-chem/12",
    highlightText: "text-chem",
  },
  "AI / ML": {
    label: "text-ai",
    border: "border-ai/15",
    bg: "bg-ai/[0.06]",
    text: "text-ai/80",
    dot: "bg-ai",
    highlightBorder: "border-ai/30",
    highlightBg: "bg-ai/12",
    highlightText: "text-ai",
  },
  DevOps: {
    label: "text-amber",
    border: "border-amber/15",
    bg: "bg-amber/[0.06]",
    text: "text-amber/80",
    dot: "bg-amber",
    highlightBorder: "border-amber/30",
    highlightBg: "bg-amber/12",
    highlightText: "text-amber",
  },
  Domain: {
    label: "text-gray-400",
    border: "border-gray-500/15",
    bg: "bg-gray-500/[0.06]",
    text: "text-gray-400/80",
    dot: "bg-gray-500",
    highlightBorder: "border-gray-400/30",
    highlightBg: "bg-gray-400/12",
    highlightText: "text-gray-300",
  },
};

const gridClasses: Record<string, string> = {
  Frontend: "",
  Backend: "",
  "AI / ML": "md:col-span-2",
  DevOps: "md:col-span-2",
  Domain: "md:col-span-2",
};

export function Strengths() {
  return (
    <section aria-label="기술 스택" className="mx-auto max-w-4xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Tech Stack
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            기술 스택
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {techStacks.map((stack, i) => {
          const accent = categoryAccent[stack.category] ?? categoryAccent.Domain;
          const gridClass = gridClasses[stack.category] ?? "";

          return (
            <ScrollReveal
              key={stack.category}
              delay={i * 0.1}
              className={gridClass}
            >
              <div
                className={`h-full rounded-2xl border ${accent.border} bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg md:p-7`}
              >
                {/* Category header */}
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${accent.dot}`}
                  />
                  <h3
                    className={`text-sm font-bold uppercase tracking-wider ${accent.label}`}
                  >
                    {stack.category}
                  </h3>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span
                      key={item.name}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-200 hover:border-opacity-40 ${
                        item.highlight
                          ? `${accent.highlightBorder} ${accent.highlightBg} ${accent.highlightText}`
                          : `${accent.border} ${accent.bg} ${accent.text}`
                      }`}
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
