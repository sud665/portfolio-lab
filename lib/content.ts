import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

import type {
  Profile,
  Project,
  ArchitectureLayer,
  Career,
  HireService,
  HireProcess,
  PortfolioItem,
  BlogPost,
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

function parseArchitecture(raw: string): ArchitectureLayer[] {
  const layers: ArchitectureLayer[] = [];
  let current: ArchitectureLayer | null = null;

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    const layerMatch = trimmed.match(/^@layer\s+(.+?)\s*\|\s*(chem|code|ai)$/);
    if (layerMatch) {
      current = { name: layerMatch[1], color: layerMatch[2] as ArchitectureLayer["color"], items: [] };
      layers.push(current);
      continue;
    }
    if (current && trimmed.startsWith("- ")) {
      current.items.push(trimmed.slice(2).trim());
    }
  }

  return layers;
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
    position: "",
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

        const architectureRaw = sections["아키텍처"] ?? "";
        const architectureLayers = parseArchitecture(architectureRaw);

        return {
          id: data.id ?? "",
          tier: data.tier ?? "main",
          title: data.title ?? "",
          icon: data.icon ?? "",
          order: data.order ?? 99,
          techStack: data.techStack ?? [],
          description: sections["설명"] ?? "",
          highlights,
          architecture: architectureRaw,
          architectureLayers,
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

export function getProjectById(id: string): Project | null {
  const projects = getProjects();
  return projects.find((p) => p.id === id) ?? null;
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

async function renderMarkdown(md: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(md);
  return String(result);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const dir = path.join(contentDir, "blog");
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"));

    const posts = await Promise.all(
      files.map(async (file) => {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data, content } = matter(raw);
        const html = await renderMarkdown(content);

        return {
          id: data.id ?? file.replace(".md", ""),
          title: data.title ?? "",
          subtitle: data.subtitle ?? "",
          date: data.date ?? "",
          category: data.category ?? "",
          tags: data.tags ?? [],
          summary: data.summary ?? "",
          content: html,
        } satisfies BlogPost;
      })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.id === slug) ?? null;
}
