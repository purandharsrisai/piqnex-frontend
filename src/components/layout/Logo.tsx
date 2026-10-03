import Link from "next/link";
import { useId } from "react";

/**
 * Split into its own file (rather than living in Navbar.tsx) because
 * NavbarClient.tsx ("use client") needs to render it too - if it lived
 * alongside the server-only Navbar component, importing Logo would drag
 * server-only code (next/headers via the Supabase server client) into the
 * client bundle.
 *
 * Deliberately not the "icon in a rounded colored square next to a bold
 * sans wordmark" pattern - that's the single most recognizable
 * template-generator tell. Instead: a serif wordmark (matching the
 * headline typography elsewhere) with one small inline mark, no
 * container, no drop shadow.
 *
 * The mark (see LogoMark below): a price tag - this is a marketplace,
 * buy and sell - with a single jigsaw-piece-shaped hole punched through
 * it, standing in for "parts" / the "missing piece" from the tagline.
 * Both cutouts are real SVG mask holes rather than shapes painted to
 * match a background color, so the mark looks correct wherever it's
 * used: the translucent paper-colored navbar, the dark ink-900 footer,
 * or a plain browser tab favicon.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-1.5 font-display text-xl text-ink-900"
    >
      <LogoMark className="h-5 w-5 shrink-0 text-clay-600 transition-transform group-hover:-rotate-6" />
      <span>
        Piq<span className="text-clay-600">nex</span>
      </span>
    </Link>
  );
}

/**
 * The icon alone, no wordmark - reused in the Footer lockup. The same
 * shape also backs src/app/icon.svg (the browser-tab favicon) and
 * apple-icon.png; those are static files Next.js serves directly, so
 * they're kept in sync with this path data by hand rather than shared
 * code.
 */
export function LogoMark({ className }: { className?: string }) {
  const maskId = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className ?? "h-5 w-5"}
    >
      <mask id={maskId}>
        <rect width="100" height="100" fill="white" />
        {/* The jigsaw-piece "missing piece" cutout */}
        <path
          d="M22,42 a4,4 0 0 1 4,-4 h5 a6,6 0 0 1 12,0 h5 a4,4 0 0 1 4,4 v5 a6,6 0 0 1 0,12 v5 a4,4 0 0 1 -4,4 h-22 a4,4 0 0 1 -4,-4 z"
          fill="black"
        />
        {/* The tag's string hole */}
        <circle cx="70" cy="50" r="7" fill="black" />
      </mask>
      <path
        d="M26,14 H58 L90,50 L58,86 H26 A12,12 0 0 1 14,74 V26 A12,12 0 0 1 26,14 Z"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
