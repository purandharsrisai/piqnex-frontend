"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, PackageOpen, Search, Settings, UserRound } from "lucide-react";
import { Avatar as BaseAvatar } from "@/components/ui/Avatar";
import { signOutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

// Kept short on purpose: Saved and Messages already sit in the main navigation (Messages with its
// unread badge) and "Edit profile" is one click away from My profile and Settings.
const ITEMS = [
  { href: "/profile", label: "My profile", hint: "View and edit your details", icon: UserRound },
  { href: "/my-listings", label: "My listings", hint: "Parts you're offering", icon: PackageOpen },
  { href: "/my-requests", label: "My requests", hint: "Parts you're looking for", icon: Search },
  { href: "/settings", label: "Settings", hint: "Account, password and help", icon: Settings },
];

function Avatar({ displayName, email, avatarUrl, size = "md" }: UserMenuProps & { size?: "md" | "lg" }) {
  return (
    <BaseAvatar
      url={avatarUrl}
      name={displayName || email}
      className={size === "lg" ? "h-11 w-11 text-base" : "h-9 w-9 border-2 border-white text-sm ring-2 ring-ink-300"}
    />
  );
}

function LogoutItem({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        role="menuitem"
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300",
          className
        )}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Log out
      </button>
    </form>
  );
}

/** Desktop: round avatar button that opens a dropdown with the account links and Log out. */
export function UserMenu({ displayName, email, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on navigation, outside click and Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={cn(
          "flex items-center gap-1.5 rounded-full border-2 bg-white py-0.5 pl-0.5 pr-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-400",
          "border-transparent"
        )}
      >
        <Avatar displayName={displayName} email={email} avatarUrl={avatarUrl} />
        <ChevronDown
          className={cn("h-4 w-4 text-ink-500 transition-transform duration-200", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 origin-top-right rounded-2xl border border-ink-100 bg-white p-2 shadow-pop"
        >
          <div className="flex items-center gap-3 rounded-xl bg-clay-50/70 p-3">
            <Avatar displayName={displayName} email={email} avatarUrl={avatarUrl} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink-900">{displayName || "My account"}</p>
              {email && <p className="truncate text-xs text-ink-500">{email}</p>}
            </div>
          </div>

          <div className="mt-2 flex flex-col">
            {ITEMS.map(({ href, label, hint, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-300"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink-600 transition-colors group-hover:bg-clay-100 group-hover:text-clay-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink-900">{label}</span>
                  <span className="block truncate text-xs text-ink-500">{hint}</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-2 border-t border-ink-100 pt-2">
            <LogoutItem />
          </div>
        </div>
      )}
    </div>
  );
}

/** Phone menu: the same options laid out inline inside the slide-down menu. */
export function UserMenuMobile({ displayName, email, avatarUrl, onNavigate }: UserMenuProps & { onNavigate: () => void }) {
  return (
    <div className="flex flex-col gap-1" role="group" aria-label="Account">
      <div className="mb-1 flex items-center gap-3 rounded-xl bg-clay-50/70 p-3">
        <Avatar displayName={displayName} email={email} avatarUrl={avatarUrl} size="lg" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink-900">{displayName || "My account"}</p>
          {email && <p className="truncate text-xs text-ink-500">{email}</p>}
        </div>
      </div>
      {ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-ink-800 hover:bg-ink-50"
        >
          <Icon className="h-5 w-5 text-ink-500" aria-hidden="true" />
          {label}
        </Link>
      ))}
      <LogoutItem className="py-3 text-base" />
    </div>
  );
}
