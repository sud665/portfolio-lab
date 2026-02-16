import { type Project } from "@/lib/types";

interface SubProjectCardProps {
  project: Project;
}

export function SubProjectCard({ project }: SubProjectCardProps) {
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
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-gray-700 bg-gray-800/50 px-2 py-0.5 font-mono text-xs text-gray-400">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
