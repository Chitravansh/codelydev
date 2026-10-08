import { NextResponse, type NextRequest } from "next/server";
import { createSignedDownloadUrl, isMediaConfigured } from "@/lib/images";

export const dynamic = "force-dynamic";

/**
 * The IDrive e2 bucket is private (the provider ignores public-read ACLs and
 * denies anonymous bucket policies). This route keeps storage locked down:
 * it validates the key, signs a 10-minute GET URL and302s the visitor there.
 * The image bytes themselves travel directly from IDrive to the browser.
 */
export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ key: string[] }> }
) {
  const { key } = await ctx.params;
  const objectKey = key.map(decodeURIComponent).join("/");

  if (!isMediaConfigured()) {
    return new NextResponse("Media storage is not configured", { status: 404 });
  }

  try {
    const signedUrl = await createSignedDownloadUrl(objectKey);
    return NextResponse.redirect(signedUrl, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
