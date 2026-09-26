import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { NavbarClient } from "./NavbarClient";

/**
 * Server component: figures out if someone is logged in (so we can show
 * an avatar instead of "Login"), then hands off to NavbarClient for the
 * interactive bits (mobile menu toggle).
 */
export async function Navbar() {
  let user = null;
  let isAdmin = false;
  let displayName: string | null = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, display_name")
          .eq("id", user.id)
          .maybeSingle();
        isAdmin = Boolean(profile?.is_admin);
        displayName = profile?.display_name ?? null;
      }
    } catch {
      // Treat as logged-out rather than breaking every page.
      user = null;
      isAdmin = false;
      displayName = null;
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-paper/90 backdrop-blur">
      <NavbarClient isLoggedIn={!!user} isAdmin={isAdmin} displayName={displayName} />
    </header>
  );
}
