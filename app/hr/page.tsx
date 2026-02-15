import type { Metadata } from "next";
import { getProfile, getProjects, getCareers } from "@/lib/content";
import { StoryHero } from "@/components/hr/StoryHero";
import { CareerTimeline } from "@/components/hr/CareerTimeline";
import { ImpactCards } from "@/components/hr/ImpactCards";
import { Strengths } from "@/components/hr/Strengths";
import { HRDebate } from "@/components/hr/HRDebate";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Download, Mail, Phone } from "lucide-react";

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
      <StoryHero resumePdf={profile.resume_pdf} />
      <CareerTimeline careers={careers} />
      <ImpactCards projects={projects} />
      <Strengths />
      <HRDebate />

      <section aria-label="연락처" className="mx-auto max-w-4xl px-6 py-20">
        <ScrollReveal>
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-bold text-white">
              새로운 도전을 함께할 팀을 찾고 있습니다
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={profile.resume_pdf}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber to-yellow-500 px-8 py-3 font-medium text-white transition-opacity hover:opacity-90"
              >
                <Download size={18} aria-hidden="true" />
                이력서 PDF
              </a>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 rounded-full border border-amber/30 px-8 py-3 text-amber transition-colors hover:bg-amber/10"
                >
                  <Mail size={18} aria-hidden="true" />
                  이메일
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 rounded-full border border-amber/30 px-8 py-3 text-amber transition-colors hover:bg-amber/10"
                >
                  <Phone size={18} aria-hidden="true" />
                  전화
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
