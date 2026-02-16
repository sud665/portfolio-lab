import type { Metadata } from "next";
import { getProfile, getProjects, getCareers } from "@/lib/content";
import { StoryHero } from "@/components/hr/StoryHero";
import { CareerTimeline } from "@/components/hr/CareerTimeline";
import { ImpactCards } from "@/components/hr/ImpactCards";
import { Strengths } from "@/components/hr/Strengths";
import { PeerReviews } from "@/components/hr/PeerReviews";
import { HRContact } from "@/components/hr/HRContact";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} — 경력 소개 | 화학공학 → 풀스택 → AI`,
  description:
    "커리어 전환 스토리와 핵심 성과. 인사팀/리크루터를 위한 포트폴리오.",
  openGraph: {
    title: `${profile.name} — 경력 소개`,
    description: "화학공학 → 풀스택 → AI 커리어 전환 스토리",
  },
};

export default function HrPage() {
  const projects = getProjects();
  const careers = getCareers();

  return (
    <>
      <StoryHero
        name={profile.name}
        title={profile.title}
        tagline={profile.tagline}
        email={profile.email}
        resumePdf={profile.resume_pdf}
      />
      <CareerTimeline careers={careers} />
      <ImpactCards projects={projects} />
      <Strengths />
      <PeerReviews />
      <HRContact
        resumePdf={profile.resume_pdf}
        email={profile.email}
        phone={profile.phone}
      />
    </>
  );
}
