"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { type Project } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/dev/ArchitectureDiagram";

interface ProjectDetailProps {
  project: Project;
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function ProjectDetail({ project }: ProjectDetailProps) {
  const hasArchitecture = Boolean(project.architecture);
  const hasDecisions = project.decisions.length > 0;
  const hasChallenges = project.challenges.length > 0;
  const hasStats = project.stats.filter((s) => s.value && !s.value.includes("[")).length > 0;

  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      {/* Back link */}
      <motion.div {...fadeUp(0)}>
        <Link
          href="/dev"
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-code"
        >
          <ArrowLeft size={14} />
          프로젝트 목록으로
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div {...fadeUp(0.1)} className="mt-8">
        <div className="flex items-start gap-4">
          <span className="text-4xl leading-none">{project.icon}</span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
                {project.title}
              </h1>
              {project.tier === "main" && (
                <span className="rounded-full border border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai">
                  Main
                </span>
              )}
            </div>

            {/* Tech Stack */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-code/20 bg-code/5 px-2.5 py-0.5 font-mono text-xs text-code-light"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      {project.description && (
        <motion.div {...fadeUp(0.2)} className="mt-10">
          <SectionLabel color="text-white/50">Description</SectionLabel>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {project.description}
          </p>
        </motion.div>
      )}

      {/* Stats */}
      {hasStats && (
        <motion.div {...fadeUp(0.25)} className="mt-10">
          <SectionLabel color="text-chem/60">Key Metrics</SectionLabel>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {project.stats
              .filter((s) => s.value && !s.value.includes("["))
              .map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-card-border bg-card p-5 text-center"
                >
                  <div className="font-outfit text-2xl font-bold text-chem">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Architecture */}
      {hasArchitecture && (
        <motion.div {...fadeUp(0.3)} className="mt-10">
          <SectionLabel color="text-code/60">Architecture</SectionLabel>
          <div className="mt-3">
            {project.architectureLayers.length > 0 ? (
              <ArchitectureDiagram layers={project.architectureLayers} />
            ) : (
              <pre className="overflow-x-auto rounded-xl border border-card-border bg-card p-5 font-mono text-sm leading-relaxed text-code-light/80">
                {project.architecture}
              </pre>
            )}
          </div>
        </motion.div>
      )}

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <motion.div {...fadeUp(0.35)} className="mt-10">
          <SectionLabel color="text-chem/60">Highlights</SectionLabel>
          <ul className="mt-3 space-y-2">
            {project.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300"
              >
                <span className="mt-2 h-px w-3 shrink-0 bg-chem/30" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Tech Decisions */}
      {hasDecisions && (
        <motion.div {...fadeUp(0.4)} className="mt-10">
          <SectionLabel color="text-amber/60">Tech Decisions</SectionLabel>
          <div className="mt-3 space-y-3">
            {project.decisions.map((d, i) => (
              <div
                key={i}
                className="rounded-xl border border-card-border bg-card p-4"
              >
                <p className="font-mono text-sm text-amber">
                  왜 {d.question}?
                </p>
                <p className="mt-2 text-sm text-gray-400">{d.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Challenges */}
      {hasChallenges && (
        <motion.div {...fadeUp(0.45)} className="mt-10">
          <SectionLabel color="text-ai/60">Challenges</SectionLabel>
          <div className="mt-3 space-y-3">
            {project.challenges.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-card-border bg-card p-4"
              >
                <p className="text-sm text-gray-400">
                  <span className="font-medium text-ai/80">Problem:</span>{" "}
                  {c.problem}
                </p>
                <p className="mt-2 text-sm text-gray-300">
                  <span className="font-medium text-chem/80">Solution:</span>{" "}
                  {c.solution}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Impact */}
      {project.impact && (
        <motion.div {...fadeUp(0.5)} className="mt-10">
          <div className="rounded-xl border border-chem/15 bg-chem/5 p-6">
            <SectionLabel color="text-chem/60">Impact</SectionLabel>
            <p className="mt-3 text-sm font-medium leading-relaxed text-chem-light">
              {project.impact}
            </p>
          </div>
        </motion.div>
      )}

      {/* Back to list */}
      <motion.div {...fadeUp(0.55)} className="mt-16 text-center">
        <Link
          href="/dev"
          className="inline-flex items-center gap-2 rounded-full border border-code/20 px-6 py-3 text-sm font-medium text-code transition-colors hover:border-code/40 hover:bg-code/5"
        >
          <ArrowLeft size={14} />
          프로젝트 목록으로 돌아가기
        </Link>
      </motion.div>
    </section>
  );
}

function SectionLabel({
  children,
  color,
}: {
  children: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest ${color}`}
    >
      <span
        className={`inline-block h-1 w-1 rounded-full bg-current`}
      />
      {children}
    </span>
  );
}
