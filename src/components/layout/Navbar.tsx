import { getCurrentUser } from "@/lib/api-client";
import { NavbarClient } from "./NavbarClient";

/**
 * Server component: figures out if someone is logged in (so we can show
 * an avatar instead of "Login"), then hands off to NavbarClient for the
 * interactive bits (mobile menu toggle). getCurrentUser() already fails
 * soft (returns null) if there's no cookie or the backend can't be reached,
 * so there's no separate "is the API configured" check needed here anymore.
 */
export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-paper/90 backdrop-blur">
      <NavbarClient
        isLoggedIn={!!user}
        isAdmin={Boolean(user?.isAdmin)}
        displayName={user?.displayName ?? null}
      />
    </header>
  );
}
