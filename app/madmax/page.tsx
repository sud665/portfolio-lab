import type { Metadata } from "next";

import { LAB_EXPERIMENTS } from "@/lib/constants";

import { MadmaxHero } from "@/components/madmax/MadmaxHero";
import { LabGrid } from "@/components/madmax/LabGrid";
import { RunawayButton } from "@/components/madmax/RunawayButton";
import { PasswordHell } from "@/components/madmax/PasswordHell";
import { DontPress } from "@/components/madmax/DontPress";
import { LieDetector } from "@/components/madmax/LieDetector";
import { InfiniteLoading } from "@/components/madmax/InfiniteLoading";
import { FortuneLab } from "@/components/madmax/Fortunelab";
import { ConsentHell } from "@/components/madmax/ConsentHell";
import { CookieBoss } from "@/components/madmax/CookieBoss";
import { CursedSlider } from "@/components/madmax/CursedSlider";
import { FakeUpdate } from "@/components/madmax/FakeUpdate";
import { CaptchaHell } from "@/components/madmax/CaptchaHell";

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
      <RunawayButton />
      <PasswordHell />
      <DontPress />
      <LieDetector />
      <InfiniteLoading />
      <FortuneLab />
      <ConsentHell />
      <CookieBoss />
      <CursedSlider />
      <FakeUpdate />
      <CaptchaHell />
      <LabGrid experiments={LAB_EXPERIMENTS} />
    </>
  );
}
