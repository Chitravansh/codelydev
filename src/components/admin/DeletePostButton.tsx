"use client";

import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  async function action() {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`
    );
    if (!confirmed) return;
    await deletePost(id);
  }

  return (
    <form action={action}>
      <button
        type="submit"
        className="btn-ghost !px-4 !py-2 !text-sm transition-colors hover:!border-red-500/50 hover:!text-red-500"
      >
        Delete
      </button>
    </form>
  );
}
