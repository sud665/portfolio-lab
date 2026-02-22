import type { Metadata } from "next";

import { getProfile, getPortfolio } from "@/lib/content";
import { WishketHero } from "@/components/wishket/WishketHero";
import { CompactPortfolio } from "@/components/wishket/CompactPortfolio";
import { WhyMe } from "@/components/wishket/WhyMe";
import { CoreSkills } from "@/components/wishket/CoreSkills";
import { PricingTable } from "@/components/wishket/PricingTable";
import { WishketProcess } from "@/components/wishket/WishketProcess";
import { FAQ } from "@/components/wishket/FAQ";
import { WishketCTA } from "@/components/wishket/WishketCTA";

export const metadata: Metadata = {
  title: "서외구 — 웹사이트 제작 파트너",
  description:
    "프로젝트 11건 완료. 기획부터 배포까지 1인 풀스택 개발. 견적 범위, 포트폴리오, 작업 프로세스를 확인하세요.",
};

export default function WishketPage() {
  const profile = getProfile();
  const portfolio = getPortfolio();

  return (
    <>
      <WishketHero />
      <CompactPortfolio portfolio={portfolio} />
      <WhyMe />
      <CoreSkills />
      <PricingTable />
      <WishketProcess />
      <FAQ />
      <WishketCTA profile={profile} />
    </>
  );
}
