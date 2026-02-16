import type { Metadata } from "next";

import { getProfile, getProjects } from "@/lib/content";

import { TerminalHero } from "@/components/dev/TerminalHero";
import { TechStack } from "@/components/dev/TechStack";
import { ProjectList } from "@/components/dev/ProjectList";
import { GitHubGrid } from "@/components/dev/GitHubGrid";
import { DevContact } from "@/components/dev/DevContact";

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
      <DevContact github={profile.github} email={profile.email} />
    </>
  );
}
