"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { type Project } from "@/lib/types";

interface MainProjectCardProps {
  project: Project;
}

interface SectionConfig {
  key: string;
  label: string;
}

export function MainProjectCard({ project }: MainProjectCardProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  const handleToggle = (key: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const sections: SectionConfig[] = [];
  if (project.highlights.length > 0)
    sections.push({ key: "highlights", label: "Highlights" });
  if (project.architecture)
    sections.push({ key: "architecture", label: "Architecture" });
  if (project.decisions.length > 0)
    sections.push({ key: "decisions", label: "Tech Decisions" });
  if (project.challenges.length > 0)
    sections.push({ key: "challenges", label: "Challenges" });

  return (
    <div className="overflow-hidden rounded-2xl border border-card-border bg-card">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{project.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-playfair text-xl font-bold text-white">
                {project.title}
              </h3>
              <span className="rounded-full border border-ai/30 bg-ai/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai">
                Main
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
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

      {/* Expandable Sections */}
      {sections.length > 0 && (
        <div className="border-t border-card-border">
          {sections.map((section) => {
            const isOpen = openSections.has(section.key);
            return (
              <div
                key={section.key}
                className="border-b border-card-border last:border-b-0">
                <button
                  onClick={() => handleToggle(section.key)}
                  className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-white/[0.02]">
                  <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
                    {section.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.25,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="overflow-hidden">
                      <div className="px-6 pb-4">
                        {section.key === "highlights" && (
                          <ul className="space-y-1.5">
                            {project.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="mt-0.5 text-code">→</span>
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {section.key === "architecture" && (
                          <pre className="overflow-x-auto rounded-lg bg-black/30 p-4 font-mono text-sm leading-relaxed text-code-light">
                            {project.architecture}
                          </pre>
                        )}
                        {section.key === "decisions" && (
                          <div className="space-y-2.5">
                            {project.decisions.map((d, i) => (
                              <div
                                key={i}
                                className="rounded-lg bg-black/20 px-4 py-3">
                                <p className="font-mono text-sm text-code">
                                  Q: 왜 {d.question}?
                                </p>
                                <p className="mt-1 text-sm text-gray-300">
                                  A: {d.answer}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        {section.key === "challenges" && (
                          <div className="space-y-2.5">
                            {project.challenges.map((c, i) => (
                              <div
                                key={i}
                                className="grid grid-cols-1 gap-2 rounded-lg bg-black/20 px-4 py-3 md:grid-cols-2 md:gap-4">
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ai/60">
                                    Problem
                                  </span>
                                  <p className="mt-1 text-sm text-gray-300">
                                    {c.problem}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-chem/60">
                                    Solution
                                  </span>
                                  <p className="mt-1 text-sm text-gray-300">
                                    {c.solution}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Impact */}
      {project.impact && (
        <div className="border-t border-card-border px-6 py-4">
          <span className="font-mono text-[10px] tracking-wider text-gray-600">
            // impact
          </span>
          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            {project.impact}
          </p>
        </div>
      )}
    </div>
  );
}
