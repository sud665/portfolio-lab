import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProjects, getProjectById } from "@/lib/content";
import { ProjectDetail } from "@/components/dev/ProjectDetail";

export function generateStaticParams() {
  const projects = getProjects();
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectById(slug);

  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };

  return {
    title: `${project.title} — 프로젝트 상세`,
    description: project.description.slice(0, 155),
    openGraph: {
      title: project.title,
      description: project.impact || project.description.slice(0, 155),
    },
  };
}

export default async function ProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = getProjectById(slug);

  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
