import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // Forces a token refresh when the session is about to expire.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public auth pages (sign-in, forgot/reset password) never require a
  // session; signed-in users are bounced off the sign-in page.
  const publicAuthPages = [
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
  ];
  if (publicAuthPages.includes(pathname)) {
    if (user && pathname === "/admin/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Everything else under /admin requires a session (the layout and RLS
  // verify admin membership — this check is only the optimistic guard).
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
