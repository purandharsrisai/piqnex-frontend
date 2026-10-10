"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/browse", label: "Browse Parts" },
  { href: "/need", label: "I Need" },
  { href: "/sell", label: "I Have" },
  { href: "/how-it-works", label: "How It Works" },
];

/** Round avatar linking to /profile - the user's initial, or a generic icon if they have no name. */
function ProfileAvatar({ displayName, onClick }: { displayName?: string | null; onClick?: () => void }) {
  const initial = displayName?.trim().charAt(0).toUpperCase();
  return (
    <Link
      href="/profile"
      onClick={onClick}
      aria-label="My profile"
      title="My profile"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-clay-600 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-brand"
    >
      {initial || <User className="h-5 w-5" />}
    </Link>
  );
}

export function NavbarClient({
  isLoggedIn,
  isAdmin = false,
  displayName = null,
  unread = 0,
}: {
  isLoggedIn: boolean;
  isAdmin?: boolean;
  displayName?: string | null;
  unread?: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [...navLinks, { href: "/saved", label: "Saved" }, { href: "/messages", label: "Messages" }];
  const badge = (href: string) =>
    href === "/messages" && unread > 0 ? (
      <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-600 px-1 text-[11px] font-bold text-white">{unread}</span>
    ) : null;

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
      <Logo />

      <div className="hidden items-center gap-1 md:flex">
        {isLoggedIn && links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900",
              pathname === link.href && "bg-ink-100 text-ink-900"
            )}
          >
            {link.label}{badge(link.href)}
          </Link>
        ))}
      </div>

      <div className="hidden items-center gap-2 md:flex">
        {isLoggedIn ? (
          <>
            {isAdmin && (
              <LinkButton href="/admin" variant="ghost" size="sm">
                Admin
              </LinkButton>
            )}
            <ProfileAvatar displayName={displayName} />
          </>
        ) : (
          <>
            <LinkButton href="/login" variant="ghost" size="sm">
              Login
            </LinkButton>
            <LinkButton href="/signup" variant="primary" size="sm">
              Sign Up
            </LinkButton>
          </>
        )}
      </div>

      <button
        type="button"
        className="rounded-full p-2 text-ink-800 hover:bg-ink-100 md:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-ink-100 bg-white px-4 py-3 shadow-pop md:hidden">
          <div className="flex flex-col gap-1">
            {isLoggedIn && links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-semibold text-ink-800 hover:bg-ink-50"
              >
                {link.label}{badge(link.href)}
              </Link>
            ))}
            <div className={cn("flex gap-2", isLoggedIn && "mt-2 border-t border-ink-100 pt-3")}>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <LinkButton href="/admin" variant="ghost" size="sm" className="flex-1">
                      Admin
                    </LinkButton>
                  )}
                  <ProfileAvatar displayName={displayName} onClick={() => setOpen(false)} />
                </>
              ) : (
                <>
                  <LinkButton href="/login" variant="outline" size="sm" className="flex-1">
                    Login
                  </LinkButton>
                  <LinkButton href="/signup" variant="primary" size="sm" className="flex-1">
                    Sign Up
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
