import Link from "next/link";

import { type Project } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/dev/ArchitectureDiagram";

interface MainProjectCardProps {
  project: Project;
}

export function MainProjectCard({ project }: MainProjectCardProps) {
  const hasDecisions = project.decisions.length > 0;
  const hasChallenges = project.challenges.length > 0;
  const hasArchitecture = Boolean(project.architecture);
  const hasDetailColumn = hasDecisions || hasChallenges || hasArchitecture;

  return (
    <Link href={`/dev/${project.id}`} className="block">
    <article className="group relative overflow-hidden rounded-2xl border border-card-border bg-card transition-all duration-300 hover:border-code/20">
      {/* Left accent gradient */}
      <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-ai via-code to-chem opacity-40 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Hover glow */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-code/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* ── Header ── */}
      <div className="relative py-6 pl-8 pr-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl leading-none">{project.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-playfair text-xl font-bold text-white">
                {project.title}
              </h3>
              <span className="rounded-full border border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai">
                Main
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              {project.description}
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-code/20 bg-code/5 px-2.5 py-0.5 font-mono text-xs text-code-light">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── Content Grid — Everything visible, no accordion ── */}
      {(project.highlights.length > 0 || hasDetailColumn) && (
        <div className="border-t border-card-border">
          <div
            className={`grid grid-cols-1 ${hasDetailColumn ? "lg:grid-cols-2" : ""}`}>
            {/* Left: Highlights */}
            {project.highlights.length > 0 && (
              <div
                className={`p-5 pl-8 ${hasDetailColumn ? "border-b border-card-border lg:border-b-0 lg:border-r" : ""}`}>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-chem/60">
                  <span className="inline-block h-1 w-1 rounded-full bg-chem" />
                  Highlights
                </span>
                <ul className="mt-3 space-y-2">
                  {project.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300">
                      <span className="mt-2 h-px w-3 shrink-0 bg-chem/30" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Right: Decisions → Challenges → Architecture */}
            {hasDetailColumn && (
              <div>
                {hasDecisions && (
                  <div className="p-5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber/60">
                      <span className="inline-block h-1 w-1 rounded-full bg-amber" />
                      Tech Decisions
                    </span>
                    <div className="mt-3 space-y-2">
                      {project.decisions.map((d, i) => (
                        <p
                          key={i}
                          className="text-xs leading-relaxed">
                          <span className="font-mono text-amber/70">
                            왜 {d.question}?
                          </span>
                          <span className="mx-1.5 text-gray-600">→</span>
                          <span className="text-gray-400">{d.answer}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {hasChallenges && (
                  <div
                    className={`p-5 ${hasDecisions ? "border-t border-card-border" : ""}`}>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-ai/60">
                      <span className="inline-block h-1 w-1 rounded-full bg-ai" />
                      Challenges
                    </span>
                    <div className="mt-3 space-y-2">
                      {project.challenges.map((c, i) => (
                        <p
                          key={i}
                          className="text-xs leading-relaxed">
                          <span className="text-gray-400">{c.problem}</span>
                          <span className="mx-1.5 text-gray-600">→</span>
                          <span className="text-gray-300">{c.solution}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {hasArchitecture && (
                  <div
                    className={`p-5 ${hasDecisions || hasChallenges ? "border-t border-card-border" : ""}`}>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-code/60">
                      <span className="inline-block h-1 w-1 rounded-full bg-code" />
                      Architecture
                    </span>
                    <div className="mt-3">
                      {project.architectureLayers.length > 0 ? (
                        <ArchitectureDiagram
                          layers={project.architectureLayers}
                          compact
                        />
                      ) : (
                        <pre className="overflow-x-auto rounded-lg bg-black/30 p-3 font-mono text-[11px] leading-relaxed text-code-light/70">
                          {project.architecture}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Impact Footer ── */}
      {project.impact && (
        <div className="border-t border-card-border bg-gradient-to-r from-chem/[0.03] to-transparent py-4 pl-8 pr-6">
          <p className="text-sm leading-relaxed text-gray-300">
            <span className="mr-2 font-mono text-[10px] text-chem/40">
              // impact
            </span>
            {project.impact}
          </p>
        </div>
      )}
    </article>
    </Link>
  );
}
