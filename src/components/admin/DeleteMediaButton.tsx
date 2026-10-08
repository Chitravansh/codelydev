"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { removeMedia } from "@/app/admin/media-actions";

export function DeleteMediaButton({ path }: { path: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action() {
    const confirmed = window.confirm(
      `Delete "${path}"? Posts that still embed it will show a broken image.`
    );
    if (!confirmed) return;

    setPending(true);
    setError(null);
    const result = await removeMedia(path);
    if (result.error) setError(result.error);
    else router.refresh();
    setPending(false);
  }

  return (
    <>
      <form action={action}>
        <button
          type="submit"
          disabled={pending}
          className="btn-ghost !px-3.5 !py-2 !text-xs transition-colors hover:!border-red-500/50 hover:!text-red-500"
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
      </form>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </>
  );
}
