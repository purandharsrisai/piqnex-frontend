import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Whether the service-role key is present. Mirrors `isSupabaseConfigured()`
 * in `config.ts` - the admin area fails soft with a friendly message rather
 * than crashing if this hasn't been added to `.env.local` yet.
 */
export function isAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Supabase client authenticated as the SERVICE ROLE - bypasses Row Level
 * Security entirely. Server-only: never import this from a "use client"
 * file, and never send this key to the browser.
 *
 * Used for admin reads/writes across any user's data (all listings, all
 * need requests, all profiles, catalog writes) - the same approach the
 * "Catalog tables" RLS comment in 0001_init_schema.sql already anticipated
 * for a future admin panel, applied consistently to every admin operation
 * rather than adding parallel is_admin-aware RLS policies table by table.
 *
 * Every caller MUST call `requireAdmin()` (see lib/actions/admin.ts) first -
 * this client itself does not check who's asking.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
