"use client";

import Image from "next/image";
import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
} from "react";
import { renderMarkdown, type CoverKey } from "@/lib/markdown";
import { slugify } from "@/lib/slug";
import {
  ACCEPTED_IMAGE_TYPES,
  uploadImageFile,
} from "@/lib/media-upload";
import {
  createPost,
  updatePost,
  type ActionState,
} from "@/app/admin/actions";

const COVER_OPTIONS: { key: CoverKey; label: string }[] = [
  { key: "cyan", label: "Cyan" },
  { key: "teal", label: "Teal" },
  { key: "navy", label: "Navy" },
  { key: "ocean", label: "Ocean" },
  { key: "glacier", label: "Glacier" },
  { key: "mint", label: "Mint" },
];

export interface EditorPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  author: string;
  cover: CoverKey;
  coverImage: string | null;
  featured: boolean;
  date: string;
  published: boolean;
}

export function PostEditor({ post }: { post?: EditorPost }) {
  const editing = post !== undefined;
  const action = post ? updatePost.bind(null, post.id) : createPost;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [author, setAuthor] = useState(post?.author ?? "CodelyDev Team");
  const [cover, setCover] = useState<CoverKey>(post?.cover ?? "navy");
  const [coverImage, setCoverImage] = useState<string | null>(
    post?.coverImage ?? null
  );
  const [date, setDate] = useState(
    post?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [content, setContent] = useState(post?.content ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState<"cover" | "content" | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);

  function insertIntoContent(markdown: string) {
    const textarea = contentRef.current;
    if (!textarea) {
      setContent((current) => `${current}\n\n${markdown}\n\n`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const insertion = `${markdown}\n\n`;
    const next = content.slice(0, start) + insertion + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    });
  }

  async function handleCoverFile(file: File) {
    setUploading("cover");
    setUploadError(null);
    const result = await uploadImageFile(file);
    if (result.error) setUploadError(result.error);
    else if (result.publicUrl) setCoverImage(result.publicUrl);
    setUploading(null);
  }

  async function handleContentImage(file: File) {
    setUploading("content");
    setUploadError(null);
    const result = await uploadImageFile(file);
    if (result.error) {
      setUploadError(result.error);
    } else if (result.publicUrl) {
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      insertIntoContent(`![${alt}](${result.publicUrl})`);
    }
    setUploading(null);
  }

  function onContentPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const image = Array.from(event.clipboardData?.files ?? []).find((f) =>
      f.type.startsWith("image/")
    );
    if (!image) return;
    event.preventDefault();
    void handleContentImage(image);
  }

  const previewHtml = useMemo(() => {
    if (!content.trim()) {
      return "<p>Nothing to preview yet — start writing on the left.</p>";
    }
    try {
      return renderMarkdown(content);
    } catch {
      return "<p>This content could not be rendered as a preview.</p>";
    }
  }, [content]);

  const statusLabel = editing
    ? post.published
      ? "Published"
      : "Draft"
    : "New draft";

  return (
    <form action={formAction}>
      <input type="hidden" name="cover_image" value={coverImage ?? ""} />

      {uploadError ? (
        <p role="alert" className="mb-4 text-sm text-red-500">
          {uploadError}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column ------------------------------------------------ */}
        <div className="space-y-5">
          <div>
            <label className="label" htmlFor="post-title">
              Title
            </label>
            <input
              id="post-title"
              name="title"
              required
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slugTouched) setSlug(slugify(event.target.value));
              }}
              className="input display !text-xl !font-semibold"
              placeholder="A title worth clicking"
            />
          </div>

          <div>
            <label className="label" htmlFor="post-slug">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="shrink-0 text-sm text-muted">/blog/</span>
              <input
                id="post-slug"
                name="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(slugify(event.target.value));
                }}
                className="input"
                placeholder="generated-from-title"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <label className="label !mb-0" htmlFor="post-content">
                Content (markdown)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={uploading === "content"}
                  onClick={() => contentInputRef.current?.click()}
                  className="btn-ghost !px-3 !py-1.5 !text-xs"
                >
                  {uploading === "content" ? "Uploading…" : "＋ Image"}
                </button>
                <div
                  className="flex gap-1 rounded-full border border-border p-1 lg:hidden"
                  role="tablist"
                  aria-label="Editor view"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "write"}
                    onClick={() => setTab("write")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      tab === "write"
                        ? "bg-brand-soft text-brand"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "preview"}
                    onClick={() => setTab("preview")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      tab === "preview"
                        ? "bg-brand-soft text-brand"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <input
              ref={contentInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) void handleContentImage(file);
                event.target.value = "";
              }}
            />

            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              <textarea
                id="post-content"
                name="content"
                ref={contentRef}
                required
                value={content}
                onChange={(event) => setContent(event.target.value)}
                onPaste={onContentPaste}
                placeholder={"## Heading\n\nWrite in **markdown**…"}
                className={`input min-h-[420px] resize-y font-mono text-sm leading-relaxed ${
                  tab === "write" ? "" : "hidden lg:block"
                }`}
              />
              <div
                aria-label="Markdown preview"
                className={`prose min-h-[420px] overflow-auto rounded-xl border border-border bg-surface p-5 ${
                  tab === "preview" ? "" : "hidden lg:block"
                }`}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar ---------------------------------------------------- */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-3 p-5">
            <p className="label !mb-0">Publish</p>
            <p className="text-sm text-muted">
              Status:{" "}
              <span className="font-medium text-foreground">
                {statusLabel}
              </span>
            </p>

            <div className="flex flex-col gap-2 pt-1">
              {editing ? (
                <>
                  <button
                    type="submit"
                    name="intent"
                    value="save"
                    disabled={pending}
                    className="btn-primary w-full"
                  >
                    {pending ? "Saving…" : "Save changes"}
                  </button>
                  {post.published ? (
                    <button
                      type="submit"
                      name="intent"
                      value="unpublish"
                      disabled={pending}
                      className="btn-ghost w-full"
                    >
                      Unpublish
                    </button>
                  ) : (
                    <button
                      type="submit"
                      name="intent"
                      value="publish"
                      disabled={pending}
                      className="btn-primary w-full"
                    >
                      Publish now
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    name="intent"
                    value="draft"
                    disabled={pending}
                    className="btn-ghost w-full"
                  >
                    {pending ? "Saving…" : "Save as draft"}
                  </button>
                  <button
                    type="submit"
                    name="intent"
                    value="publish"
                    disabled={pending}
                    className="btn-primary w-full"
                  >
                    Publish now
                  </button>
                </>
              )}
            </div>

            {state.error ? (
              <p role="alert" className="text-sm text-red-500">
                {state.error}
              </p>
            ) : null}
            {state.saved ? (
              <p role="status" className="text-sm text-emerald-500">
                ✓ {state.saved}
              </p>
            ) : null}
          </div>

          <div className="card space-y-3 p-5">
            <p className="label !mb-0">Cover image</p>
            {coverImage ? (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={coverImage}
                    alt="Post cover"
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-muted">
                Optional — replaces the gradient cover. Falls back to the
                gradient when empty.
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={uploading === "cover"}
                onClick={() => coverInputRef.current?.click()}
                className="btn-ghost !px-3.5 !py-2 !text-xs"
              >
                {uploading === "cover"
                  ? "Uploading…"
                  : coverImage
                    ? "Replace"
                    : "Upload"}
              </button>
              {coverImage ? (
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="btn-ghost !px-3.5 !py-2 !text-xs transition-colors hover:!border-red-500/50 hover:!text-red-500"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (file) void handleCoverFile(file);
                event.target.value = "";
              }}
            />
          </div>

          <div className="card space-y-4 p-5">
            <div>
              <label className="label" htmlFor="post-date">
                Publish date
              </label>
              <input
                id="post-date"
                name="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="post-author">
                Author
              </label>
              <input
                id="post-author"
                name="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label" htmlFor="post-cover">
                Cover style
              </label>
              <select
                id="post-cover"
                name="cover"
                value={cover}
                onChange={(event) =>
                  setCover(event.target.value as CoverKey)
                }
                className="input"
              >
                {COVER_OPTIONS.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label" htmlFor="post-tags">
                Tags
              </label>
              <input
                id="post-tags"
                name="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="input"
                placeholder="Next.js, React, DX"
              />
              <p className="mt-1.5 text-xs text-muted">
                Comma-separated. The first tag is shown in the breadcrumb.
              </p>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                name="featured"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 accent-[var(--brand)]"
              />
              Featured on the homepage
            </label>
          </div>

          <div className="card space-y-4 p-5">
            <div>
              <label className="label" htmlFor="post-excerpt">
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                name="excerpt"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className="input resize-y"
                placeholder="One or two sentences shown in cards and meta descriptions."
              />
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
