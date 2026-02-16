import type { Metadata } from "next";
import { getProfile, getHireData, getPortfolio } from "@/lib/content";
import { HireHero } from "@/components/hire/HireHero";
import { ServiceGrid } from "@/components/hire/ServiceGrid";
import { ProcessFlow } from "@/components/hire/ProcessFlow";
import { PortfolioGallery } from "@/components/hire/PortfolioGallery";
import { TrustSection } from "@/components/hire/TrustSection";
import { ContactSection } from "@/components/hire/ContactSection";

export const metadata: Metadata = {
  title: "웹사이트 제작 — 기획부터 배포까지 원스톱",
  description:
    "홈페이지, 쇼핑몰, 랜딩페이지 제작. 기획, 디자인, 개발, 배포 전 과정.",
  openGraph: {
    title: "웹사이트 제작 — 원스톱 서비스",
    description: "기획부터 배포까지 원스톱으로 해결",
  },
};

export default function HirePage() {
  const profile = getProfile();
  const portfolio = getPortfolio();
  const hireData = getHireData();

  return (
    <>
      <HireHero />
      <ServiceGrid services={hireData.services} />
      <ProcessFlow process={hireData.process} />
      <PortfolioGallery portfolio={portfolio} />
      <TrustSection />
      <ContactSection
        phone={profile.phone}
        email={profile.email}
        kakao={profile.kakao}
        services={hireData.services}
      />
    </>
  );
}
