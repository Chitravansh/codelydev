export const MEDIA_PREFIX = "posts/";

/** Public, cacheable URL served by /api/media/[...key] (bucket stays private). */
export function mediaUrl(key: string): string {
  return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}
