"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { slugify } from "@/lib/slug";

export type ActionState = { error?: string; saved?: string };

const COVERS = ["cyan", "teal", "navy", "ocean", "glacier", "mint"] as const;

export async function requireAdmin() {
  const supabase = await createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return { supabase, isAuthorized: Boolean(adminRow) };
}

interface ParsedPost {
  intent: string;
  fields: {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    tags: string[];
    author: string;
    cover: string;
    cover_image: string | null;
    featured: boolean;
    date: string;
  };
  publishIntent: boolean;
}

function readPostForm(formData: FormData): ParsedPost {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const coverInput = String(formData.get("cover") ?? "navy");
  const intent = String(formData.get("intent") ?? "draft");
  const dateInput = String(formData.get("date") ?? "").trim();

  return {
    intent,
    publishIntent: intent === "publish" || intent === "unpublish",
    fields: {
      slug: slugify(rawSlug || title),
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tags: String(formData.get("tags") ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author:
        String(formData.get("author") ?? "").trim() || "CodelyDev Team",
      cover: (COVERS as readonly string[]).includes(coverInput)
        ? coverInput
        : "navy",
      cover_image: String(formData.get("cover_image") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
      date: /^\d{4}-\d{2}-\d{2}$/.test(dateInput)
        ? dateInput
        : new Date().toISOString().slice(0, 10),
    },
  };
}

function validate(fields: ParsedPost["fields"]): ActionState | null {
  if (!fields.title) return { error: "A title is required." };
  if (!fields.content) return { error: "The content is required." };
  if (!fields.slug) {
    return { error: "Could not derive a slug — add at least one letter or number." };
  }
  return null;
}

/**
 * Expires the cached post list and refreshes every route that renders it.
 * updateTag gives server actions read-your-own-writes on the data cache,
 * revalidatePath refreshes the statically rendered HTML.
 */
function revalidatePosts() {
  updateTag("posts");
  revalidatePath("/", "page");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/tag/[tag]", "page");
  revalidatePath("/rss.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/posts/[id]", "page");
}

export async function createPost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, isAuthorized } = await requireAdmin();
  if (!isAuthorized) {
    return { error: "This account does not have admin access." };
  }

  const { fields, intent } = readPostForm(formData);
  const invalid = validate(fields);
  if (invalid) return invalid;

  const { data, error } = await supabase
    .from("posts")
    .insert({ ...fields, published: intent === "publish" })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        error: `The slug "${fields.slug}" is already in use — change it and save again.`,
      };
    }
    return { error: `Could not create the post: ${error.message}` };
  }

  revalidatePosts();
  redirect(`/admin/posts/${data.id}`);
}

export async function updatePost(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { supabase, isAuthorized } = await requireAdmin();
  if (!isAuthorized) {
    return { error: "This account does not have admin access." };
  }

  const { fields, intent } = readPostForm(formData);
  const invalid = validate(fields);
  if (invalid) return invalid;

  let published = intent === "publish";
  if (intent === "save") {
    const { data: existing } = await supabase
      .from("posts")
      .select("published")
      .eq("id", id)
      .maybeSingle();
    published = existing?.published ?? false;
  }

  const { error } = await supabase
    .from("posts")
    .update({ ...fields, published })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return {
        error: `The slug "${fields.slug}" is already in use — change it and save again.`,
      };
    }
    return { error: `Could not save the post: ${error.message}` };
  }

  revalidatePosts();
  return {
    saved: published
      ? "Saved and published."
      : "Saved — still a draft.",
  };
}

export async function deletePost(id: string): Promise<void> {
  const { supabase, isAuthorized } = await requireAdmin();
  if (!isAuthorized) {
    redirect("/admin");
  }

  await supabase.from("posts").delete().eq("id", id);

  revalidatePosts();
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient(await cookies());
  await supabase.auth.signOut();
  redirect("/admin/login");
}
