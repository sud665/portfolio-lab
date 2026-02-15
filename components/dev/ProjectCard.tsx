"use client";

import { type Project } from "@/lib/types";
import { ScrollReveal } from "@/components/common/ScrollReveal";

interface ProjectCardProps {
  project: Project;
}

function MainProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-card-border p-6">
        <span className="text-3xl">{project.icon}</span>
        <div>
          <h3 className="font-playfair text-xl font-bold text-white">
            {project.title}
          </h3>
          <span className="mt-1 inline-block rounded-full border border-ai/30 bg-ai/10 px-2 py-0.5 text-xs text-ai">
            MAIN
          </span>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Description */}
        <p className="text-gray-300">{project.description}</p>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              Highlights
            </h4>
            <ul className="space-y-1">
              {project.highlights.map((h, i) => (
                <li key={i} className="text-sm text-gray-300">
                  <span className="mr-2 text-code">→</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Architecture */}
        {project.architecture && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              Architecture
            </h4>
            <pre className="overflow-x-auto rounded-lg bg-black/30 p-4 font-mono text-sm text-code-light">
              {project.architecture}
            </pre>
          </div>
        )}

        {/* Tech Decisions */}
        {project.decisions.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              Tech Decisions
            </h4>
            <div className="space-y-3">
              {project.decisions.map((d, i) => (
                <div key={i}>
                  <p className="text-sm text-code">Q: 왜 {d.question}?</p>
                  <p className="text-sm text-gray-300">A: {d.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Challenges */}
        {project.challenges.length > 0 && (
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-widest text-gray-500">
              Challenges
            </h4>
            <div className="space-y-2">
              {project.challenges.map((c, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 text-sm">
                  <p className="text-ai">Problem: {c.problem}</p>
                  <p className="text-chem">Solution: {c.solution}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Impact */}
        {project.impact && (
          <p className="rounded-lg border border-code/20 bg-code/5 p-4 text-sm text-gray-300">
            {project.impact}
          </p>
        )}

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-code/20 bg-code/10 px-3 py-1 text-xs text-code-light"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <span className="cursor-default rounded-lg border border-code/30 px-4 py-2 text-sm text-code opacity-50">
            GitHub
          </span>
          <span className="cursor-default rounded-lg border border-code/30 px-4 py-2 text-sm text-code opacity-50">
            Demo
          </span>
        </div>
      </div>
    </div>
  );
}

function SubProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-6 transition-all duration-300 hover:border-code/40">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{project.icon}</span>
        <div>
          <h3 className="font-bold text-white">{project.title}</h3>
          <span className="text-xs text-gray-500">SUB</span>
        </div>
      </div>
      {project.description && (
        <p className="mt-3 text-sm text-gray-400">{project.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-xs text-gray-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const mainProjects = projects.filter((p) => p.tier === "main");
  const subProjects = projects.filter((p) => p.tier === "sub");

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          Projects
        </h2>
      </ScrollReveal>

      <div className="space-y-8">
        {mainProjects.map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 0.1}>
            <MainProjectCard project={p} />
          </ScrollReveal>
        ))}
      </div>

      {subProjects.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {subProjects.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 0.1}>
              <SubProjectCard project={p} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
