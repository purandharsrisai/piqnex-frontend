import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, decodeJwtPayload, isTokenValid } from "@/lib/auth-cookie";

/**
 * Route-protection gate, now checking the JWT cookie (set by
 * src/lib/actions/auth.ts after a successful POST /auth/login or
 * /auth/signup against piqnex-backend) instead of a Supabase session - see
 * the old src/lib/supabase/middleware.ts for the previous version of this.
 *
 * This only decodes the token (no signature verification - that needs a
 * crypto lib and the shared JWT_SECRET, which this Edge middleware doesn't
 * have). That's an acceptable tradeoff here: it's purely a UX redirect for
 * signed-out visitors, never the actual authorization boundary - every real
 * read/write still goes through the backend's JwtAuthGuard, which DOES
 * verify the signature server-side.
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedPaths = ["/sell", "/profile", "/admin"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!isTokenValid(token)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/admin")) {
    const payload = decodeJwtPayload(token!);
    if (!payload?.isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static, _next/image (static/image assets)
     * - favicon.ico
     * - public files with common extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
