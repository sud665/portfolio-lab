import type { Metadata } from "next";

import { getBlogPosts } from "@/lib/content";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogGrid } from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — 실전에서 배운 CS 개념들",
  description:
    "프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록. DB, 네트워크, OS 등.",
  openGraph: {
    title: "Blog — 실전에서 배운 CS 개념들",
    description: "프로젝트에서 마주친 문제를 CS 개념으로 풀어낸 기록",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <BlogHero postCount={posts.length} />
      <BlogGrid posts={posts} />
    </>
  );
}
