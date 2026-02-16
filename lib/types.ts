export interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  blog: string;
  linkedin: string;
  kakao: string;
  resume_pdf: string;
  tagline: string;
  position: string;
  bio: string;
}

export interface ArchitectureLayer {
  name: string;
  color: "chem" | "code" | "ai";
  items: string[];
}

export interface Project {
  id: string;
  tier: "main" | "sub";
  title: string;
  icon: string;
  order: number;
  techStack: string[];
  description: string;
  highlights: string[];
  architecture: string;
  architectureLayers: ArchitectureLayer[];
  decisions: { question: string; answer: string }[];
  challenges: { problem: string; solution: string }[];
  impact: string;
  stats: { label: string; value: string }[];
}

export interface Career {
  phase: "chem" | "code" | "ai";
  title: string;
  period: string;
  icon: string;
  order: number;
  description: string;
}

export interface HireService {
  icon: string;
  title: string;
  description: string;
}

export interface HireProcess {
  step: number;
  title: string;
  description: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  client: string;
  year: number;
  color: "chem" | "code" | "ai" | "amber";
  techStack: string[];
  features: string[];
  description: string;
  url: string;
  order: number;
}

export interface Phase {
  num: string;
  category: string;
  color: "chem" | "code" | "ai";
  title: string;
  desc: string;
  hex: string;
}

// ── Chat ──

export interface ChatSession {
  id: string;
  visitor_name: string | null;
  page: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: "visitor" | "owner";
  content: string;
  created_at: string;
}
