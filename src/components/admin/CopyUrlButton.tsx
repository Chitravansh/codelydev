"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/media-url";

export function CopyUrlButton({ path }: { path: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${mediaUrl(path)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-ghost !px-3.5 !py-2 !text-xs"
    >
      {copied ? "Copied ✓" : "Copy URL"}
    </button>
  );
}
