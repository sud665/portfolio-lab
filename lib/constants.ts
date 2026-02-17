import type { LabExperiment } from "./types";

export const techStacks = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js", highlight: false },
      { name: "React", highlight: false },
      { name: "TypeScript", highlight: false },
      { name: "Tailwind", highlight: false },
      { name: "Thymeleaf", highlight: false },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Nest.js", highlight: false },
      { name: "Node.js", highlight: false },
      { name: "Java Spring", highlight: false },
      { name: "MyBatis", highlight: false },
    ],
  },
  {
    category: "AI / ML",
    items: [
      { name: "LangChain", highlight: true },
      { name: "LangGraph", highlight: true },
      { name: "AI Agent", highlight: true },
      { name: "OCR", highlight: true },
    ],
  },
  {
    category: "DevOps",
    items: [
      { name: "Git", highlight: false },
      { name: "Docker", highlight: false },
      { name: "CI/CD", highlight: false },
      { name: "Vercel", highlight: false },
      { name: "AWS", highlight: false },
      { name: "GCP", highlight: false },
      { name: "OCI", highlight: false },
    ],
  },
  {
    category: "Domain",
    items: [
      { name: "SaaS Architecture", highlight: false },
      { name: "Chemical Engineering", highlight: false },
      { name: "Manufacturing DX", highlight: false },
    ],
  },
];

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: "jeju-realestate",
    title: "제주도 부동산 API",
    description: "제주 부동산 실거래가 데이터를 API로 제공하는 서비스",
    icon: "Building2",
    status: "idea",
  },
  {
    id: "future-delivery",
    title: "1년 뒤 배송",
    description: "미래의 나에게 보내는 타임캡슐 택배 서비스",
    icon: "Package",
    status: "idea",
  },
  {
    id: "req-to-code",
    title: "요구사항 → 코드",
    description: "요구사항을 입력하면 와이어프레임과 보일러플레이트를 생성",
    icon: "FileCode2",
    status: "idea",
  },
  {
    id: "homepage-builder",
    title: "홈페이지 빌더",
    description: "누구나 쉽게 만드는 원페이지 홈페이지",
    icon: "Globe",
    status: "idea",
  },
  {
    id: "chrome-ext-maker",
    title: "크롬 익스텐션 메이커",
    description: "아이디어만 입력하면 크롬 확장 프로그램을 생성",
    icon: "Puzzle",
    status: "idea",
  },
];
