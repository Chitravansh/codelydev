import fs from "fs";
import path from "path";
import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  CoverKey,
  parseFrontmatter,
  readingTime,
  renderMarkdown,
} from "./markdown";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  author: string;
  cover: CoverKey;
  coverImage: string | null;
  featured: boolean;
  readingMinutes: number;
  html: string;
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const COVERS: readonly CoverKey[] = [
  "cyan",
  "teal",
  "navy",
  "ocean",
  "glacier",
  "mint",
];

function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

interface PostRow {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tags: string[] | null;
  author: string | null;
  cover: string | null;
  cover_image: string | null;
  featured: boolean | null;
  date: string | null;
}

function rowToPost(row: PostRow): Post {
  const content = row.content ?? "";
  const cover = COVERS.includes(row.cover as CoverKey)
    ? (row.cover as CoverKey)
    : "navy";

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    date: row.date ?? "2026-01-01",
    tags: row.tags ?? [],
    author: row.author ?? "CodelyDev Team",
    cover,
    coverImage: row.cover_image ?? null,
    featured: row.featured === true,
    readingMinutes: readingTime(content),
    html: renderMarkdown(content),
  };
}

async function fetchPublishedPosts(): Promise<Post[]> {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data, error } = await supabase
    .from("posts")
    .select(
      "slug,title,excerpt,content,tags,author,cover,cover_image,featured,date"
    )
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) throw new Error(`supabase query failed: ${error.message}`);

  return (data as PostRow[]).map(rowToPost);
}

function loadPostsFromFiles(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map<Post>((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = parseFrontmatter(raw);
    const slug = file.replace(/\.md$/, "");

    return {
      slug,
      title: data.title ?? slug,
      excerpt: data.excerpt ?? data.description ?? "",
      date: data.date ?? "2026-01-01",
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author ?? "CodelyDev Team",
      cover: (data.cover as CoverKey) ?? "navy",
      coverImage: null,
      featured: data.featured === true,
      readingMinutes: readingTime(content),
      html: renderMarkdown(content),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Supabase is the source of truth for published posts once seeded.
 * Falls back to local markdown when Supabase is not configured,
 * unreachable, or has not been seeded yet (keeps builds and the
 * starter content working without a database).
 */
async function loadPosts(): Promise<Post[]> {
  if (supabaseConfigured()) {
    try {
      const posts = await fetchPublishedPosts();
      if (posts.length > 0) return posts;
      console.warn(
        "[posts] supabase returned 0 published posts — falling back to content/posts"
      );
    } catch (err) {
      console.warn(
        "[posts] supabase unavailable — falling back to content/posts:",
        err instanceof Error ? err.message : err
      );
    }
  }
  return loadPostsFromFiles();
}

export const getAllPosts = unstable_cache(
  async () => loadPosts(),
  ["all-posts"],
  { tags: ["posts"], revalidate: 3600 }
);

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((p) => p.featured);
  return (featured.length ? featured : posts).slice(0, limit);
}

export async function getRecentPosts(
  limit = 4,
  exclude?: string
): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.slug !== exclude).slice(0, limit);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const target = tag.toLowerCase();
  const posts = await getAllPosts();
  return posts.filter((p) =>
    p.tags.some((t) => t.toLowerCase() === target)
  );
}

export async function getAllTags(): Promise<
  { tag: string; count: number }[]
> {
  const posts = await getAllPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getRelatedPosts(
  slug: string,
  limit = 2
): Promise<Post[]> {
  const posts = await getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  return posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, limit)
    .map((x) => x.post);
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
