import Image from "next/image";
import type { Metadata } from "next";
import { isMediaConfigured, listMedia } from "@/lib/images";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { DeleteMediaButton } from "@/components/admin/DeleteMediaButton";
import { CopyUrlButton } from "@/components/admin/CopyUrlButton";

export const metadata: Metadata = { title: "Media" };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function baseName(key: string): string {
  return key.split("/").pop() ?? key;
}

export default async function MediaPage() {
  const configured = isMediaConfigured();
  const items = configured ? await listMedia() : [];

  return (
    <div>
      <span className="pill">Media</span>
      <h1 className="display mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
        Image library
      </h1>

      {!configured ? (
        <div className="card mt-8 p-8">
          <p className="font-medium text-foreground">
            Media storage is not configured
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Set <code className="text-xs">IDRIVE_E2_*</code> variables in
            <code className="text-xs"> .env.local</code> (see
            <code className="text-xs"> .env.example</code>) and restart the
            server.
          </p>
        </div>
      ) : null}

      {configured ? (
        <div className="mt-8 max-w-2xl">
          <MediaUploader />
        </div>
      ) : null}

      {configured && items.length === 0 ? (
        <div className="card mt-6 p-8 text-center">
          <p className="display text-lg font-semibold text-foreground">
            No images yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Upload one above, or directly from the post editor.
          </p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.key} className="card overflow-hidden">
              <div className="relative aspect-[16/10] border-b border-border bg-surface">
                <Image
                  src={`/api/media/${item.key.split("/").map(encodeURIComponent).join("/")}`}
                  alt={baseName(item.key)}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-4">
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-medium text-foreground"
                    title={item.key}
                  >
                    {baseName(item.key)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {formatSize(item.size)} ·{" "}
                    {item.lastModified.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <CopyUrlButton path={item.key} />
                  <DeleteMediaButton path={item.key} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
