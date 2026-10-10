import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";
import { AUTH_COOKIE_NAME, decodeJwtPayload } from "@/lib/auth-cookie";

interface ExchangeResponse {
  accessToken: string;
  redirectTo: string;
}

/**
 * Landing point after the backend finished the Google sign-in. Trades the
 * one-time code for the real login token, stores it in the same httpOnly
 * cookie the password login uses, then sends the user on.
 */
export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(`${origin}/login?google=failed`);

  try {
    const result = await apiFetch<ExchangeResponse>("/auth/google/exchange", {
      method: "POST",
      authenticated: false,
      body: { code },
    });
    const payload = decodeJwtPayload(result.accessToken);
    const maxAge = payload?.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : undefined;
    const store = await cookies();
    store.set(AUTH_COOKIE_NAME, result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    const dest = /^\/(?!\/)/.test(result.redirectTo) ? result.redirectTo : "/profile";
    return NextResponse.redirect(`${origin}${dest}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?google=failed`);
  }
}
