import type { ReactNode } from "react";
import { BadgeCheck, MessageCircle, Search } from "lucide-react";
import { LogoMark } from "@/components/layout/Logo";

const POINTS = [
  { icon: Search, text: "Search by exact brand, product and part" },
  { icon: BadgeCheck, text: "Only confirmed matches, no guesswork" },
  { icon: MessageCircle, text: "Message sellers directly" },
];

/**
 * Split-screen auth layout: a bold brand panel (desktop only) beside the
 * form. Used by login, signup, forgot and reset password.
 */
export function AuthShell({
  title,
  subtitle,
  wide = false,
  children,
}: {
  title: string;
  subtitle: string;
  /** Wider form column - used by forms that lay their fields out in two columns. */
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-140px)] max-w-7xl lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-clay-600 p-12 text-white lg:m-6 lg:flex lg:flex-col lg:justify-between lg:rounded-3xl">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-clay-400/60 blur-3xl" aria-hidden="true" />
        <LogoMark className="relative h-12 w-12 rounded-[18px] ring-2 ring-white/50" />
        <div className="relative">
          <h2 className="font-display text-4xl leading-tight">
            Don&rsquo;t replace the product. Find the piece.
          </h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-clay-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className={wide ? "w-full max-w-xl" : "w-full max-w-md"}>
          <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-ink-500">{subtitle}</p>
          <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-6 shadow-pop sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
