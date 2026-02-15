import type { Metadata } from "next";
import { getProfile } from "@/lib/content";
import { RouteCards } from "@/components/home/RouteCards";
import { HeroTransition } from "@/components/home/HeroTransition";

const profile = getProfile();

export const metadata: Metadata = {
  title: `${profile.name} 포트폴리오 — 화학에서 코드로, 코드에서 AI로`,
  description:
    "화학공학 7년 + 풀스택 4년 + AI Agent. 도메인 지식을 가진 풀스택 개발자 포트폴리오.",
  openGraph: {
    title: `${profile.name} 포트폴리오`,
    description: "화학에서 코드로, 코드에서 AI로",
  },
};

export default function Home() {
  return (
    <>
      <RouteCards tagline={profile.tagline} name={profile.name} />
      <HeroTransition />
    </>
  );
}
