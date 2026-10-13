import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./auth-cookie";
import { DEMO_MODE, DEMO_SIGNED_OUT_COOKIE, DemoHttpError, demoRequest } from "./demo-data";

/**
 * Base URL of the piqnex-backend NestJS API. Falls back to the default local
 * dev port (see piqnex-backend/.env's PORT=3000) so this "just works" with
 * the docker-compose/README quick start before you've created .env.local.
 */
const API_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Attach the signed-in user's JWT as `Authorization: Bearer <token>`. Default true. */
  authenticated?: boolean;
}

function buildUrl(path: string, query?: ApiFetchOptions["query"]) {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** Reads the JWT cookie set by src/lib/actions/auth.ts, if any. */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  if (DEMO_MODE) return cookieStore.get(DEMO_SIGNED_OUT_COOKIE) ? undefined : "demo-token";
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Fetch wrapper for calling piqnex-backend from Server Components / Server
 * Actions. Adds the signed-in user's token and turns API errors into thrown errors.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, query, authenticated = true } = options;

  if (DEMO_MODE) {
    // Sample data instead of the backend - see src/lib/demo-data.ts.
    const signedIn = !!(await getAuthToken());
    try {
      return demoRequest(method, path, query ?? {}, body, signedIn) as T;
    } catch (error) {
      if (error instanceof DemoHttpError) throw new ApiError(error.status, error.message);
      throw error;
    }
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authenticated) {
    const token = await getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Every one of these calls depends on the signed-in user / current DB
    // state - never let Next.js's fetch cache serve a stale response.
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const raw = (data as { message?: string | string[] } | undefined)?.message;
    const message = Array.isArray(raw) ? raw.join(", ") : raw ?? res.statusText;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

export interface CurrentUser {
  id: string;
  email: string;
  displayName: string;
  location: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  isAdmin: boolean;
  createdAt: string;
}

/**
 * The signed-in user's account and profile in one call (GET /profile/me - see
 * ProfileService.getMe). Fails soft: returns null when there is no token or
 * the backend can't be reached, instead of throwing and breaking every page.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getAuthToken();
  if (!token) return null;

  try {
    return await apiFetch<CurrentUser>("/profile/me");
  } catch {
    return null;
  }
}
