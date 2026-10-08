import type { Metadata } from "next";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div>
      <span className="pill">New</span>
      <h1 className="display mt-4 text-3xl font-semibold text-foreground sm:text-4xl">
        Write a post
      </h1>
      <PostEditor />
    </div>
  );
}
