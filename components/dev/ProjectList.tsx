import { type Project } from "@/lib/types";

import { ScrollReveal } from "@/components/common/ScrollReveal";
import { MainProjectCard } from "@/components/dev/MainProjectCard";
import { SubProjectCard } from "@/components/dev/SubProjectCard";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const mainProjects = projects.filter((p) => p.tier === "main");
  const subProjects = projects.filter((p) => p.tier === "sub");

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <h2 className="mb-12 text-center font-playfair text-3xl font-bold text-white">
          Projects
        </h2>
      </ScrollReveal>

      <div className="space-y-8">
        {mainProjects.map((p, i) => (
          <ScrollReveal
            key={p.id}
            delay={i * 0.1}>
            <MainProjectCard project={p} />
          </ScrollReveal>
        ))}
      </div>

      {subProjects.length > 0 && (
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {subProjects.map((p, i) => (
            <ScrollReveal
              key={p.id}
              delay={i * 0.1}>
              <SubProjectCard project={p} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </section>
  );
}
