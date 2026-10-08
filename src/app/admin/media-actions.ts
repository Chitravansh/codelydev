"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "./actions";
import {
  ALLOWED_IMAGE_TYPES,
  buildMediaKey,
  createUploadUrl,
  deleteMedia,
  isMediaConfigured,
} from "@/lib/images";

export type UploadResult = { error?: string; uploadUrl?: string; publicUrl?: string };

/**
 * Returns a short-lived presigned PUT URL. The client uploads the file
 * directly to IDrive e2 (no size limit through Next), then uses `publicUrl`.
 */
export async function createMediaUpload(
  filename: string,
  contentType: string
): Promise<UploadResult> {
  const { isAuthorized } = await requireAdmin();
  if (!isAuthorized) return { error: "This account does not have admin access." };
  if (!isMediaConfigured()) {
    return { error: "Media storage is not configured (IDRIVE_E2_* env vars)." };
  }
  if (!ALLOWED_IMAGE_TYPES[contentType]) {
    return {
      error: `Unsupported file type "${contentType}". Use PNG, JPEG, WebP, GIF or AVIF.`,
    };
  }

  try {
    const key = buildMediaKey(filename, contentType);
    const { uploadUrl, publicUrl } = await createUploadUrl(key, contentType);
    return { uploadUrl, publicUrl };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not sign the upload." };
  }
}

export async function removeMedia(
  key: string
): Promise<{ error?: string }> {
  const { isAuthorized } = await requireAdmin();
  if (!isAuthorized) return { error: "This account does not have admin access." };

  try {
    await deleteMedia(key);
    revalidatePath("/admin/media");
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not delete the image." };
  }
}
