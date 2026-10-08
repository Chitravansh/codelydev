"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";
import { ACCEPTED_IMAGE_TYPES, uploadImageFile } from "@/lib/media-upload";

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await uploadImageFile(file);
    if (result.error) setError(result.error);
    else router.refresh();
    setUploading(false);
  }

  return (
    <div className="card p-5">
      <p className="label">Upload an image</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        PNG, JPEG, WebP, GIF or AVIF up to 8 MB. Uploaded straight to IDrive e2
        — use <code className="text-xs">Copy URL</code> to embed it in a post,
        or upload from inside the post editor.
      </p>
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="btn-primary mt-4"
      >
        {uploading ? "Uploading…" : "Choose file"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        className="hidden"
        onChange={onPick}
      />
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
