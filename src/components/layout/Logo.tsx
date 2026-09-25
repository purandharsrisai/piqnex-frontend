import Link from "next/link";

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
 * headline typography elsewhere) with one small inline mark standing in
 * for the missing piece, no container, no drop shadow.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-1.5 font-display text-xl text-ink-900"
    >
      <PuzzleNotch />
      <span>
        Piq<span className="text-clay-600">nex</span>
      </span>
    </Link>
  );
}

function PuzzleNotch() {
  // A single puzzle-piece notch, drawn as a plain glyph (no background
  // shape) so it reads as part of the wordmark rather than an app icon.
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-clay-600 transition-transform group-hover:rotate-6"
    >
      <path
        d="M9 3.5h4v2.25a1.75 1.75 0 1 0 0 3.5V13H16a1.75 1.75 0 1 1 0-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 13v4a1.75 1.75 0 1 1-3.5 0V13H5.5V9a1.75 1.75 0 1 0 3.5 0V5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
