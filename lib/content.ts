import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type {
  Profile,
  Project,
  Career,
  HireService,
  HireProcess,
  PortfolioItem,
} from "./types";

const contentDir = path.join(process.cwd(), "content");

function splitSections(body: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = body.split(/^## /m);

  for (const part of parts) {
    if (!part.trim()) continue;
    const newlineIdx = part.indexOf("\n");
    if (newlineIdx === -1) {
      sections[part.trim()] = "";
    } else {
      const heading = part.slice(0, newlineIdx).trim();
      const content = part.slice(newlineIdx + 1).trim();
      sections[heading] = content;
    }
  }

  return sections;
}

function parseListItems(text: string): string[] {
  return text
    .split("\n")
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

export function getProfile(): Profile {
  const defaults: Profile = {
    name: "",
    title: "",
    email: "",
    phone: "",
    github: "",
    blog: "",
    linkedin: "",
    kakao: "",
    resume_pdf: "",
    tagline: "",
    bio: "",
  };

  try {
    const filePath = path.join(contentDir, "profile.md");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { ...defaults, ...data, bio: content.trim() };
  } catch {
    return defaults;
  }
}

export function getProjects(): Project[] {
  try {
    const dir = path.join(contentDir, "projects");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    return files
      .map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data, content } = matter(raw);
        const sections = splitSections(content);

        const highlights = sections["하이라이트"]
          ? parseListItems(sections["하이라이트"])
          : [];

        const decisions = sections["기술의사결정"]
          ? parseListItems(sections["기술의사결정"]).map((item) => {
              const match = item.match(/^왜 (.+?)\?\s*→\s*(.+)$/);
              return match
                ? { question: match[1], answer: match[2] }
                : { question: item, answer: "" };
            })
          : [];

        const challenges = sections["챌린지"]
          ? parseListItems(sections["챌린지"]).map((item) => {
              const match = item.match(
                /^문제:\s*(.+?)\s*→\s*해결:\s*(.+)$/
              );
              return match
                ? { problem: match[1], solution: match[2] }
                : { problem: item, solution: "" };
            })
          : [];

        const stats = sections["수치"]
          ? parseListItems(sections["수치"]).map((item) => {
              const colonIdx = item.indexOf(":");
              return colonIdx !== -1
                ? {
                    label: item.slice(0, colonIdx).trim(),
                    value: item.slice(colonIdx + 1).trim(),
                  }
                : { label: item, value: "" };
            })
          : [];

        return {
          id: data.id ?? "",
          tier: data.tier ?? "main",
          title: data.title ?? "",
          icon: data.icon ?? "",
          order: data.order ?? 99,
          techStack: data.techStack ?? [],
          description: sections["설명"] ?? "",
          highlights,
          architecture: sections["아키텍처"] ?? "",
          decisions,
          challenges,
          impact: sections["임팩트"] ?? "",
          stats,
        } satisfies Project;
      })
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export function getCareers(): Career[] {
  try {
    const dir = path.join(contentDir, "career");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    return files
      .map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data, content } = matter(raw);

        return {
          phase: data.phase ?? "code",
          title: data.title ?? "",
          period: data.period ?? "",
          icon: data.icon ?? "",
          order: data.order ?? 99,
          description: content.trim(),
        } satisfies Career;
      })
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export function getPortfolio(): PortfolioItem[] {
  try {
    const dir = path.join(contentDir, "hire", "portfolio");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    return files
      .map((file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data, content } = matter(raw);

        return {
          id: data.id ?? "",
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          category: data.category ?? "",
          client: data.client ?? "",
          year: data.year ?? 2024,
          color: data.color ?? "chem",
          techStack: data.techStack ?? [],
          features: data.features ?? [],
          description: content.trim(),
          url: data.url ?? "#",
          order: data.order ?? 99,
        } satisfies PortfolioItem;
      })
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export function getHireData(): {
  services: HireService[];
  process: HireProcess[];
} {
  const defaults = { services: [] as HireService[], process: [] as HireProcess[] };

  try {
    const filePath = path.join(contentDir, "hire", "services.md");
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);
    const sections = splitSections(content);

    const services: HireService[] = [];
    if (sections["서비스"]) {
      const parts = sections["서비스"].split(/^### /m).filter((p) => p.trim());
      for (const part of parts) {
        const newlineIdx = part.indexOf("\n");
        const heading = newlineIdx === -1 ? part.trim() : part.slice(0, newlineIdx).trim();
        const desc = newlineIdx === -1 ? "" : part.slice(newlineIdx + 1).trim();

        const emojiMatch = heading.match(/^(\S+)\s+(.+)$/);
        services.push({
          icon: emojiMatch ? emojiMatch[1] : "",
          title: emojiMatch ? emojiMatch[2] : heading,
          description: desc,
        });
      }
    }

    const process: HireProcess[] = [];
    if (sections["프로세스"]) {
      const lines = sections["프로세스"]
        .split("\n")
        .filter((l) => /^\d+\./.test(l.trim()));
      for (const line of lines) {
        const match = line.match(/^(\d+)\.\s*(.+?)\s*—\s*(.+)$/);
        if (match) {
          process.push({
            step: parseInt(match[1]),
            title: match[2],
            description: match[3],
          });
        }
      }
    }

    return { services, process };
  } catch {
    return defaults;
  }
}
