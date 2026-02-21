import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogPosts, getBlogPostBySlug } from "@/lib/content";
import { BlogDetail } from "@/components/blog/BlogDetail";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) return { title: "글을 찾을 수 없습니다" };

  return {
    title: `${post.title} — Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  return <BlogDetail post={post} />;
}
