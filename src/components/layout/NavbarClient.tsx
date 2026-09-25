"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/browse", label: "Browse Parts" },
  { href: "/need", label: "I Need" },
  { href: "/sell", label: "I Have" },
  { href: "/how-it-works", label: "How It Works" },
];

export function NavbarClient({ isLoggedIn, isAdmin = false }: { isLoggedIn: boolean; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
      <Logo />

      <div className="hidden items-center gap-1 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "border-b-2 border-transparent px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900",
              pathname === link.href
                ? "border-clay-600 text-ink-900"
                : "hover:border-ink-200"
            )}
          >
            {link.label}
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
            <LinkButton href="/profile" variant="outline" size="sm">
              Profile
            </LinkButton>
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
        className="rounded-lg p-2 text-ink-700 hover:bg-ink-50 md:hidden"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-ink-100 bg-paper px-4 py-3 shadow-card md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-ink-100 pt-3">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <LinkButton href="/admin" variant="ghost" size="sm" className="flex-1">
                      Admin
                    </LinkButton>
                  )}
                  <LinkButton href="/profile" variant="outline" size="sm" className="flex-1">
                    Profile
                  </LinkButton>
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
