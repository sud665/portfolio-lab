import { type ReactNode } from "react";
import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiThymeleaf,
  SiNestjs,
  SiNodedotjs,
  SiSpring,
  SiDocker,
  SiGit,
  SiAmazonwebservices,
  SiGooglecloud,
  SiOracle,
  SiVercel,
  SiLangchain,
  SiOpenai,
} from "react-icons/si";
import { Bot, ScanLine, Database, Building2, FlaskConical, Factory, RefreshCw } from "lucide-react";

import { techStacks } from "@/lib/constants";

import { ScrollReveal } from "@/components/common/ScrollReveal";

const ICON_SIZE = 30;

const techIcon: Record<string, ReactNode> = {
  "Next.js": <SiNextdotjs size={ICON_SIZE} />,
  React: <SiReact size={ICON_SIZE} />,
  TypeScript: <SiTypescript size={ICON_SIZE} />,
  Tailwind: <SiTailwindcss size={ICON_SIZE} />,
  Thymeleaf: <SiThymeleaf size={ICON_SIZE} />,
  "Nest.js": <SiNestjs size={ICON_SIZE} />,
  "Node.js": <SiNodedotjs size={ICON_SIZE} />,
  "Java Spring": <SiSpring size={ICON_SIZE} />,
  MyBatis: <Database size={ICON_SIZE} />,
  LangChain: <SiLangchain size={ICON_SIZE} />,
  LangGraph: <SiOpenai size={ICON_SIZE} />,
  "AI Agent": <Bot size={ICON_SIZE} />,
  OCR: <ScanLine size={ICON_SIZE} />,
  Git: <SiGit size={ICON_SIZE} />,
  Docker: <SiDocker size={ICON_SIZE} />,
  "CI/CD": <RefreshCw size={ICON_SIZE} />,
  Vercel: <SiVercel size={ICON_SIZE} />,
  AWS: <SiAmazonwebservices size={ICON_SIZE} />,
  GCP: <SiGooglecloud size={ICON_SIZE} />,
  OCI: <SiOracle size={ICON_SIZE} />,
  "SaaS Architecture": <Building2 size={ICON_SIZE} />,
  "Chemical Engineering": <FlaskConical size={ICON_SIZE} />,
  "Manufacturing DX": <Factory size={ICON_SIZE} />,
};

const categoryAccent: Record<string, { label: string; dot: string }> = {
  Frontend: { label: "text-code", dot: "bg-code" },
  Backend: { label: "text-chem", dot: "bg-chem" },
  "AI / ML": { label: "text-ai", dot: "bg-ai" },
  DevOps: { label: "text-amber", dot: "bg-amber" },
  Domain: { label: "text-gray-400", dot: "bg-gray-500" },
};

export function TechStack() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-600">
            Skills
          </span>
          <h2 className="mt-2 font-playfair text-3xl font-bold text-white">
            Tech Stack
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-12 overflow-hidden rounded-xl border border-card-border bg-card">
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-card-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-chem/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-ai/60" />
            <span className="ml-2 font-mono text-xs text-gray-600">
              stack.config
            </span>
          </div>

          {/* Category rows */}
          <div className="divide-y divide-card-border/50">
            {techStacks.map((stack) => {
              const accent =
                categoryAccent[stack.category] ?? categoryAccent.Domain;
              return (
                <div
                  key={stack.category}
                  className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span
                    className={`flex w-28 shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-wider ${accent.label}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${accent.dot}`}
                    />
                    {stack.category}
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {stack.items.map((item) => (
                      <span
                        key={item.name}
                        className={`group inline-flex items-center gap-3 rounded-xl border px-5 py-3 font-mono text-sm transition-all duration-200 ${
                          item.highlight
                            ? "border-ai/20 bg-ai/8 text-ai hover:border-ai/35 hover:bg-ai/12"
                            : "border-code/12 bg-code/5 text-code-light hover:border-code/25 hover:bg-code/8"
                        }`}
                      >
                        <span className="shrink-0 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                          {techIcon[item.name]}
                        </span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
