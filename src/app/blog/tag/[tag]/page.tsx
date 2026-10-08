import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { getAllTags, getPostsByTag } from "@/lib/posts";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const label = safeDecode(tag);
  return {
    title: `${label} articles`,
    description: `All articles tagged ${label} on the CodelyDev blog.`,
    alternates: { canonical: `/blog/tag/${encodeURIComponent(label)}` },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const label = safeDecode(tag);
  const posts = await getPostsByTag(label);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/blog" className="transition-colors hover:text-brand">
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">Topics</span>
      </nav>

      <header className="mt-6 flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="pill">{posts.length} articles</span>
          <h1 className="display mt-4 text-4xl font-semibold text-foreground sm:text-5xl">
            {label}
          </h1>
        </div>
        <Link href="/blog" className="btn-ghost">
          ← All topics
        </Link>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
