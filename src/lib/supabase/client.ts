"use client";

/**
 * Supabase client for use in the BROWSER (Client Components).
 *
 * Why a separate file from server.ts? Supabase needs different plumbing to
 * read/write the auth session depending on where the code runs (browser vs.
 * server). Splitting them keeps that complexity out of your components -
 * you just call `createClient()` and get a working client either way.
 */
import { createBrowserClient } from "@supabase/ssr";
import { PLACEHOLDER_SUPABASE_URL, PLACEHOLDER_SUPABASE_ANON_KEY } from "./config";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? PLACEHOLDER_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? PLACEHOLDER_SUPABASE_ANON_KEY
  );
}
