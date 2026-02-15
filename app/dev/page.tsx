import type { Metadata } from "next";
import { getProfile, getProjects } from "@/lib/content";
import { TerminalHero } from "@/components/dev/TerminalHero";
import { TechStack } from "@/components/dev/TechStack";
import { ProjectList } from "@/components/dev/ProjectCard";
import { GitHubGrid } from "@/components/dev/GitHubGrid";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Github, Mail } from "lucide-react";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} — Developer Portfolio | Full-Stack & AI Agent`,
  description:
    "Next.js, React, Nest.js, LangChain/LangGraph. 아키텍처와 기술 의사결정 중심 포트폴리오.",
  openGraph: {
    title: `${profile.name} — Developer Portfolio`,
    description: "아키텍처와 기술 의사결정 중심 포트폴리오",
  },
};

export default function DevPage() {
  const projects = getProjects();

  return (
    <>
      <TerminalHero name={profile.name} />
      <TechStack />
      <ProjectList projects={projects} />
      <GitHubGrid />

      <section aria-label="연락처" className="mx-auto max-w-6xl px-6 py-20">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-bold text-white">
              함께 만들어 나갈 다음 코드
            </h2>
            <div className="mt-8 flex justify-center gap-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-code/30 bg-code/10 px-6 py-3 text-sm text-code transition-colors hover:bg-code/20"
                >
                  <Github size={18} aria-hidden="true" />
                  GitHub
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 rounded-lg border border-code/30 bg-code/10 px-6 py-3 text-sm text-code transition-colors hover:bg-code/20"
                >
                  <Mail size={18} aria-hidden="true" />
                  Email
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
