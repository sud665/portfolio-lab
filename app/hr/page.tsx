import type { Metadata } from "next";
import { getProfile } from "@/lib/content";
import { StoryHero } from "@/components/hr/StoryHero";
import { CareerTimeline } from "@/components/hr/CareerTimeline";
import { ImpactCards } from "@/components/hr/ImpactCards";
import { Strengths } from "@/components/hr/Strengths";
import { Education } from "@/components/hr/HRDebate";
import { PeerReviews } from "@/components/hr/PeerReviews";
import { PortfolioGrid } from "@/components/hr/PortfolioGrid";
import { HRContact } from "@/components/hr/HRContact";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} — 이력서 | 풀스택 개발자 · AI Engineer`,
  description:
    "풀스택 개발자 서외구의 이력서. 화학공학 7년 → 풀스택 개발 → AI Agent.",
  openGraph: {
    title: `${profile.name} — 이력서`,
    description: "풀스택 개발자 · AI Engineer 포트폴리오 & 이력서",
  },
};

export default function HrPage() {
  return (
    <>
      <StoryHero
        name={profile.name}
        email={profile.email}
        phone={profile.phone}
        github={profile.github}
        blog={profile.blog}
        resumePdf={profile.resume_pdf}
      />
      <CareerTimeline />
      <PortfolioGrid />
      <ImpactCards />
      <Strengths />
      <Education />
      <PeerReviews />
      <HRContact
        resumePdf={profile.resume_pdf}
        email={profile.email}
        phone={profile.phone}
        github={profile.github}
        blog={profile.blog}
      />
    </>
  );
}
