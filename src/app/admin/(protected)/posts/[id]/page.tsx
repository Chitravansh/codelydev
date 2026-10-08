import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { CoverKey } from "@/lib/markdown";
import { PostEditor, type EditorPost } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "Edit post" };

const COVERS: CoverKey[] = ["cyan", "teal", "navy", "ocean", "glacier", "mint"];

interface Props {
  params: Promise<{ id: string }>;
}

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[] | null;
  author: string;
  cover: string;
  cover_image: string | null;
  featured: boolean;
  date: string;
  published: boolean;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient(await cookies());
  const { data } = await supabase
    .from("posts")
    .select(
      "id, slug, title, excerpt, content, tags, author, cover, cover_image, featured, date, published"
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const row = data as PostRow;

  const post: EditorPost = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    tags: row.tags ?? [],
    author: row.author,
    cover: COVERS.includes(row.cover as CoverKey)
      ? (row.cover as CoverKey)
      : "navy",
    coverImage: row.cover_image,
    featured: row.featured,
    date: row.date,
    published: row.published,
  };

  return (
    <div>
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-muted"
      >
        <Link href="/admin" className="transition-colors hover:text-brand">
          Posts
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{post.title}</span>
      </nav>

      <h1 className="display mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
        Edit post
      </h1>

      <PostEditor post={post} />
    </div>
  );
}
