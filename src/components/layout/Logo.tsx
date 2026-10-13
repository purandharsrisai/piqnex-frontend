import Link from "next/link";
import { useId } from "react";

/**
 * Piqnex logo: a rounded app-style tile with a bold white "P" and a small
 * teal "piece" docking beside it - the "replace the missing piece" idea from
 * the tagline. Split into its own file so NavbarClient ("use client") can
 * render it too. The same shape backs src/app/icon.svg and apple-icon.png
 * (static files, kept in sync by hand).
 */
export function Logo({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 font-display text-2xl ${onDark ? "text-white" : "text-ink-900"}`}
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span>
        Piq<span className={onDark ? "text-clay-400" : "text-clay-600"}>nex</span>
      </span>
    </Link>
  );
}

/** The tile alone, no wordmark. Colors are baked in, so it works on any background. */
export function LogoMark({ className }: { className?: string }) {
  const gradId = useId();
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className ?? "h-8 w-8"}>
      <defs>
        <linearGradient id={gradId} x1="8" y1="4" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff7a4d" />
          <stop offset="1" stopColor="#d23510" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${gradId})`} />
      <path
        d="M21 47V17h10.5a11 11 0 0 1 0 22H21"
        fill="none"
        stroke="#fff"
        strokeWidth="8.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="40" y="41" width="12" height="12" rx="3.5" fill="#7cd8ca" transform="rotate(12 46 47)" />
    </svg>
  );
}
