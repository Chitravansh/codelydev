import { createMediaUpload } from "@/app/admin/media-actions";

export const ACCEPTED_IMAGE_TYPES =
  "image/png,image/jpeg,image/webp,image/gif,image/avif";
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function isAllowedImageType(type: string): boolean {
  return (
    type === "image/png" ||
    type === "image/jpeg" ||
    type === "image/webp" ||
    type === "image/gif" ||
    type === "image/avif"
  );
}

/**
 * Client-side upload: ask the server for a presigned URL, then PUT the file
 * straight to IDrive e2. Returns the public (/api/media/...) URL on success.
 */
export async function uploadImageFile(
  file: File
): Promise<{ publicUrl?: string; error?: string }> {
  if (!isAllowedImageType(file.type)) {
    return {
      error: `"${file.type || "unknown"}" is not an allowed image type.`,
    };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Images must be 8 MB or smaller." };
  }

  const signed = await createMediaUpload(file.name, file.type);
  if (signed.error || !signed.uploadUrl || !signed.publicUrl) {
    return { error: signed.error ?? "Could not prepare the upload." };
  }

  const put = await fetch(signed.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!put.ok) {
    return { error: `Storage rejected the upload (HTTP ${put.status}).` };
  }
  return { publicUrl: signed.publicUrl };
}
