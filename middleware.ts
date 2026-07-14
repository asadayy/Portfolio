import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the admin area and all mutating admin APIs.
 * - Unauthenticated page requests → redirect to /admin/login
 * - Unauthenticated /api/admin/** requests → 401 JSON
 * - Authenticated visits to /admin/login → redirect to the dashboard
 * Route handlers additionally re-check the session server-side.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Derive the session-cookie flavor from the actual request protocol.
  // getToken's default derives it from NEXTAUTH_URL.startsWith("https://"),
  // which silently reads the wrong cookie name (and rejects every valid
  // session) when NEXTAUTH_URL is set without its protocol prefix.
  const token = await getToken({
    req: request,
    secureCookie: request.nextUrl.protocol === "https:",
  });

  if (pathname === "/admin/login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (token) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
