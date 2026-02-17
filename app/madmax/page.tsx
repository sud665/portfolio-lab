import type { Metadata } from "next";

import { LAB_EXPERIMENTS } from "@/lib/constants";

import { MadmaxHero } from "@/components/madmax/MadmaxHero";
import { LabGrid } from "@/components/madmax/LabGrid";

export const metadata: Metadata = {
  title: "MADMAX LAB — 희안한 거 만드는 연구실",
  description:
    "매드맥스 연구실. 실험적인 웹서비스 아이디어를 만들고 검증하는 공간.",
  openGraph: {
    title: "MADMAX LAB",
    description: "희안한 거 만드는 연구실",
  },
};

export default function MadmaxPage() {
  return (
    <>
      <MadmaxHero />
      <LabGrid experiments={LAB_EXPERIMENTS} />
    </>
  );
}
