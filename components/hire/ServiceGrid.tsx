"use client";

import { type HireService } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

const accentCycle = ["chem", "code", "ai", "amber"] as const;

const accentStyles: Record<
  string,
  {
    line: string;
    iconFrame: string;
    hoverShadow: string;
    hoverBorder: string;
    blob: string;
  }
> = {
  chem: {
    line: "via-chem/50",
    iconFrame: "border-chem/20 bg-chem/[0.07]",
    hoverShadow: "group-hover:shadow-chem/15",
    hoverBorder: "group-hover:border-chem/40",
    blob: "bg-chem/15",
  },
  code: {
    line: "via-code/50",
    iconFrame: "border-code/20 bg-code/[0.07]",
    hoverShadow: "group-hover:shadow-code/15",
    hoverBorder: "group-hover:border-code/40",
    blob: "bg-code/15",
  },
  ai: {
    line: "via-ai/50",
    iconFrame: "border-ai/20 bg-ai/[0.07]",
    hoverShadow: "group-hover:shadow-ai/15",
    hoverBorder: "group-hover:border-ai/40",
    blob: "bg-ai/15",
  },
  amber: {
    line: "via-amber/50",
    iconFrame: "border-amber/20 bg-amber/[0.07]",
    hoverShadow: "group-hover:shadow-amber/15",
    hoverBorder: "group-hover:border-amber/40",
    blob: "bg-amber/15",
  },
};

const gridClasses = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

interface ServiceGridProps {
  services: HireService[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <ScrollReveal>
        <div className="mb-14">
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-chem">
            Services
          </p>
          <h2 className="font-playfair text-4xl font-bold text-white md:text-5xl">
            이런 걸 만들어드려요
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {services.map((service, i) => {
          const accentKey = accentCycle[i % accentCycle.length];
          const accent = accentStyles[accentKey];
          const isHero = i === 0;
          const gridPos =
            i < gridClasses.length ? gridClasses[i] : "md:col-span-4";

          return (
            <ScrollReveal
              key={service.title}
              delay={i * 0.07}
              className={gridPos}
            >
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${accent.hoverShadow} ${accent.hoverBorder}`}
              >
                {/* Top accent line */}
                <div
                  className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${accent.line} to-transparent`}
                />

                {/* Content */}
                <div
                  className={
                    isHero
                      ? "flex flex-col gap-6 p-8 md:flex-row md:items-start md:p-10"
                      : "p-7"
                  }
                >
                  {/* Icon container */}
                  <div
                    className={`flex items-center justify-center rounded-2xl border backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 ${accent.iconFrame} ${
                      isHero
                        ? "h-20 w-20 shrink-0"
                        : "mb-5 h-14 w-14"
                    }`}
                  >
                    <span className={isHero ? "text-4xl" : "text-2xl"}>
                      {service.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className={isHero ? "flex-1" : ""}>
                    <h3
                      className={`font-semibold text-white ${
                        isHero ? "font-playfair text-2xl" : "text-lg"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-2 leading-relaxed text-gray-400 ${
                        isHero ? "text-base" : "text-sm"
                      }`}
                    >
                      {service.description}
                    </p>
                    {isHero && (
                      <span className="mt-4 inline-block rounded-full bg-chem/10 px-3 py-1 text-xs font-semibold text-chem">
                        인기 서비스
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover glow blob */}
                <div
                  className={`pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full ${accent.blob} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Hero card watermark */}
                {isHero && (
                  <div className="pointer-events-none absolute -bottom-4 -right-2 font-playfair text-[120px] font-bold leading-none text-white/[0.02]">
                    01
                  </div>
                )}
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
