"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/need-requests", label: "Need Requests" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/catalog", label: "Categories & Brands" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-ink-200 pb-2">
      {TABS.map((tab) => {
        const isActive = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-ink-900 text-paper" : "text-ink-600 hover:bg-ink-100"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
