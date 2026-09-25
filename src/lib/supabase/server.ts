import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PLACEHOLDER_SUPABASE_URL, PLACEHOLDER_SUPABASE_ANON_KEY } from "./config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client for use on the SERVER (Server Components, Route Handlers,
 * Server Actions). It reads the user's auth session from cookies, so
 * `supabase.auth.getUser()` works the same way it would in the browser.
 *
 * Call this fresh on every request - never cache/reuse the client across
 * requests, since it's tied to that request's cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? PLACEHOLDER_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? PLACEHOLDER_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions (see src/middleware.ts).
          }
        },
      },
    }
  );
}
