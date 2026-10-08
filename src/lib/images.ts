import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MEDIA_PREFIX, mediaUrl } from "./media-url";

export { MEDIA_PREFIX, mediaUrl };

/** Only real raster images — no SVG (scripts) and no surprises. */
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const SIGN_EXPIRES_SECONDS = 600;

let client: S3Client | null = null;

export function isMediaConfigured(): boolean {
  return Boolean(
    process.env.IDRIVE_E2_ENDPOINT &&
      process.env.IDRIVE_E2_ACCESS_KEY_ID &&
      process.env.IDRIVE_E2_SECRET_ACCESS_KEY &&
      process.env.IDRIVE_E2_BUCKET
  );
}

function s3(): S3Client {
  if (!client) {
    client = new S3Client({
      region: process.env.IDRIVE_E2_REGION || "eu-central-1",
      endpoint: process.env.IDRIVE_E2_ENDPOINT!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.IDRIVE_E2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.IDRIVE_E2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return client;
}

export function assertMediaKey(key: string): void {
  if (
    !key.startsWith(MEDIA_PREFIX) ||
    key.includes("..") ||
    key.includes("//") ||
    key.includes("\\")
  ) {
    throw new Error("Invalid media key");
  }
}

export function buildMediaKey(filename: string, contentType: string): string {
  const ext = ALLOWED_IMAGE_TYPES[contentType];
  if (!ext) {
    throw new Error(
      `Unsupported file type "${contentType}". Use PNG, JPEG, WebP, GIF or AVIF.`
    );
  }

  const base =
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";

  const rand = crypto.randomUUID().slice(0, 8);
  const now = new Date();
  const ym = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  return `${MEDIA_PREFIX}${ym}/${base}-${rand}.${ext}`;
}

/** Short-lived PUT URL — the browser uploads straight to IDrive, never through Next. */
export async function createUploadUrl(
  key: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  assertMediaKey(key);
  const uploadUrl = await getSignedUrl(
    s3(),
    new PutObjectCommand({
      Bucket: process.env.IDRIVE_E2_BUCKET!,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: SIGN_EXPIRES_SECONDS }
  );
  return { uploadUrl, publicUrl: mediaUrl(key) };
}

/** Short-lived GET URL used by /api/media/[...key] to302 anonymous visitors. */
export async function createSignedDownloadUrl(key: string): Promise<string> {
  assertMediaKey(key);

  // Presigning is pure computation — confirm the object actually exists so
  // deleted images answer 404 here instead of redirecting to an S3 error.
  try {
    await s3().send(
      new HeadObjectCommand({ Bucket: process.env.IDRIVE_E2_BUCKET!, Key: key })
    );
  } catch {
    throw new Error("Object not found");
  }

  return getSignedUrl(
    s3(),
    new GetObjectCommand({ Bucket: process.env.IDRIVE_E2_BUCKET!, Key: key }),
    { expiresIn: SIGN_EXPIRES_SECONDS }
  );
}

export interface MediaItem {
  key: string;
  size: number;
  lastModified: Date;
}

export async function listMedia(limit = 200): Promise<MediaItem[]> {
  const response = await s3().send(
    new ListObjectsV2Command({
      Bucket: process.env.IDRIVE_E2_BUCKET!,
      Prefix: MEDIA_PREFIX,
      MaxKeys: limit,
    })
  );

  return (response.Contents ?? [])
    .filter((o) => o.Key && o.Key !== MEDIA_PREFIX)
    .map((o) => ({
      key: o.Key!,
      size: o.Size ?? 0,
      lastModified: o.LastModified ?? new Date(),
    }))
    .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
}

export async function deleteMedia(key: string): Promise<void> {
  assertMediaKey(key);
  await s3().send(
    new DeleteObjectCommand({
      Bucket: process.env.IDRIVE_E2_BUCKET!,
      Key: key,
    })
  );
}
