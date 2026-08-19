import { Metadata } from "next";
import { notFound } from "next/navigation";

import PageTileSingle from "@/components/blogs/blog-single/PageTileSingle";
import BlogSingle from "@/components/blogs/blog-single/BlogSingle";
import Related from "@/components/blogs/blog-single/Related";
import {
  blogPostRegistry,
  getAdjacentBlogPosts,
  getBlogPostById,
} from "@/data/blogs";

const siteName = "Amerce - Multipurpose eCommerce React Nextjs Template";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return blogPostRegistry.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getBlogPostById(id);
  if (!post) {
    return { title: `Blog | ${siteName}`, description: siteName };
  }
  return {
    title: `${post.title} | ${siteName}`,
    description: post.desc.slice(0, 160),
  };
}

export default async function BlogSingleDynamicPage({ params }: Props) {
  const { id } = await params;
  const post = getBlogPostById(id);
  if (!post) notFound();

  const { prev, next } = getAdjacentBlogPosts(id);

  return (
    <>
      <PageTileSingle title={post.title} prevId={prev?.id} nextId={next?.id} />
      <BlogSingle post={post} prevPost={prev} nextPost={next} />
      <Related currentId={post.id} />
    </>
  );
}
