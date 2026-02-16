import { type Phase } from "@/lib/types";

import { PhaseSection } from "@/components/home/PhaseSection";

const phases: Phase[] = [
  {
    num: "01",
    category: "Chemistry",
    color: "chem",
    title: "화학에서 시작된 끝없는 호기심",
    desc: "KCC에서 7년, 화학 소재 현장에서 산업의 비효율을 직접 마주하며 기술적 해결의 갈망이 시작되었습니다.",
    hex: "#d81159",
  },
  {
    num: "02",
    category: "Code",
    color: "code",
    title: "코드로 문제를 해결하는 개발자",
    desc: "풀스택 개발자로 전환, 다수의 서비스를 기획부터 배포·운영까지 전 과정을 경험했습니다.",
    hex: "#0496ff",
  },
  {
    num: "03",
    category: "AI",
    color: "ai",
    title: "AI와 함께 진화하는 미래",
    desc: "LangChain/LangGraph 기반 AI Agent 업무관리 시스템을 설계·구축하며 지능화의 시대를 열고 있습니다.",
    hex: "#8f2d56",
  },
];

export function HeroTransition() {
  return (
    <div>
      {phases.map((phase, i) => (
        <PhaseSection
          key={phase.num}
          phase={phase}
          index={i}
          isLast={i === phases.length - 1}
        />
      ))}
    </div>
  );
}
