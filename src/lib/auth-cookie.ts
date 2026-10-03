/**
 * Shared, Edge-safe helpers for the JWT auth cookie. This file has NO
 * server-only imports (no `next/headers`) so it can be imported from both:
 *  - src/middleware.ts (runs on the Edge runtime)
 *  - src/lib/api-client.ts (Server Components / Server Actions, Node runtime)
 *
 * The backend (piqnex-backend) issues a plain JWT from POST /auth/login and
 * /auth/signup. We store it in an httpOnly cookie (set by
 * src/lib/actions/auth.ts) instead of a Supabase session cookie, and send it
 * back as `Authorization: Bearer <token>` on every API call (see
 * api-client.ts) - the backend's JwtStrategy only reads it from that header,
 * never from a cookie.
 */

export const AUTH_COOKIE_NAME = "piqnex_token";

export interface JwtPayload {
  sub: string;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

/**
 * Decodes (does NOT verify) a JWT's payload. Good enough for middleware's
 * "is someone probably logged in, and are they probably an admin" UX gate -
 * the backend independently verifies the signature on every real request
 * via JwtAuthGuard, so a forged/expired token here only ever results in a
 * confusing UI, never unauthorized data access.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}
