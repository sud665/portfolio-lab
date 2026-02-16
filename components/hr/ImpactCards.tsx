"use client";

import { type Project } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const accentCycle = ["chem", "code", "ai", "amber"] as const;

const accentConfig: Record<
  string,
  {
    bar: string;
    impactBg: string;
    impactText: string;
    badge: string;
    arrow: string;
    hoverGlow: string;
  }
> = {
  chem: {
    bar: "bg-chem",
    impactBg: "bg-chem/[0.06] border-chem/10",
    impactText: "text-chem-light",
    badge: "bg-chem/10 text-chem",
    arrow: "text-chem",
    hoverGlow: "hover:shadow-chem/[0.08]",
  },
  code: {
    bar: "bg-code",
    impactBg: "bg-code/[0.06] border-code/10",
    impactText: "text-code-light",
    badge: "bg-code/10 text-code",
    arrow: "text-code",
    hoverGlow: "hover:shadow-code/[0.08]",
  },
  ai: {
    bar: "bg-ai",
    impactBg: "bg-ai/[0.06] border-ai/10",
    impactText: "text-ai-light",
    badge: "bg-ai/10 text-ai",
    arrow: "text-ai",
    hoverGlow: "hover:shadow-ai/[0.08]",
  },
  amber: {
    bar: "bg-amber",
    impactBg: "bg-amber/[0.06] border-amber/10",
    impactText: "text-amber",
    badge: "bg-amber/10 text-amber",
    arrow: "text-amber",
    hoverGlow: "hover:shadow-amber/[0.08]",
  },
};

interface ImpactCardsProps {
  projects: Project[];
}

export function ImpactCards({ projects }: ImpactCardsProps) {
  return (
    <section aria-label="핵심 성과" className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-amber">
            Impact
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            핵심 성과
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, i) => {
          const accentKey = accentCycle[i % accentCycle.length];
          const accent = accentConfig[accentKey];

          return (
            <ScrollReveal key={project.id} delay={i * 0.1}>
              <div
                className={`group relative overflow-hidden rounded-xl border border-card-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${accent.hoverGlow}`}
              >
                {/* Colored accent bar */}
                <div
                  className={`absolute bottom-0 left-0 top-0 w-[3px] ${accent.bar}`}
                />

                {/* Header: Icon + Title + Badge */}
                <div className="flex items-start gap-4 p-6 pb-0 pl-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl backdrop-blur-sm">
                    {project.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {project.title}
                      </h3>
                      {project.tier === "main" && (
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${accent.badge}`}
                        >
                          Main
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Impact highlight box */}
                {project.impact && (
                  <div
                    className={`mx-6 ml-7 mt-5 rounded-lg border ${accent.impactBg} p-4`}
                  >
                    <p
                      className={`text-sm font-medium leading-relaxed ${accent.impactText}`}
                    >
                      {project.impact}
                    </p>
                  </div>
                )}

                {/* Quantitative stats */}
                {project.stats.length > 0 && (
                  <div className="mx-6 ml-7 mt-3 flex flex-wrap gap-4">
                    {project.stats
                      .filter((s) => s.value && !s.value.includes("["))
                      .map((s) => (
                        <div key={s.label} className="text-center">
                          <div
                            className={`font-outfit text-lg font-bold ${accent.impactText}`}
                          >
                            {s.value}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {s.label}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* Key highlights */}
                {project.highlights.length > 0 && (
                  <ul className="space-y-1.5 p-6 pl-7 pt-4">
                    {project.highlights.slice(0, 3).map((h, hi) => (
                      <li
                        key={hi}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <span className={`mt-0.5 text-xs ${accent.arrow}`}>
                          →
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
