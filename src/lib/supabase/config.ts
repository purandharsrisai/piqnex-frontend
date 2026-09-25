/**
 * Whether real Supabase credentials are present (see .env.example).
 *
 * Used throughout the app so that BEFORE you've created a Supabase project
 * and filled in .env.local, the site still runs - it just shows sample data
 * and treats everyone as logged out - instead of crashing with a confusing
 * "Your project's URL and Key are required" error on every page.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Harmless placeholders so `createServerClient`/`createBrowserClient` never
// throw at construction time when env vars are missing. Any attempt to
// actually use them (a real query) will fail, which calling code already
// handles with try/catch and a friendly fallback/error state.
export const PLACEHOLDER_SUPABASE_URL = "https://placeholder.supabase.co";
export const PLACEHOLDER_SUPABASE_ANON_KEY = "placeholder-anon-key";
