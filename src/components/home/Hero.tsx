// import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { RevealOnMount } from "@/components/ui/Reveal";
import { SearchBar } from "./SearchBar";
import { HeroVisual } from "./HeroVisual";

// const POPULAR = ["Earbud charging case", "Laptop charger", "Controller thumbstick", "Watch strap"];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Soft brand wash behind the collage */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full bg-clay-100/70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-[420px] w-[420px] rounded-full bg-moss-100/70 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <RevealOnMount>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 shadow-card">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-moss-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-moss-500" />
              </span>
              The marketplace for spare &amp; replacement parts
            </span>
          </RevealOnMount>

          <RevealOnMount delay={0.08}>
            <h1 className="mt-6 font-display text-[2.9rem] leading-[1.02] text-ink-900 sm:text-6xl lg:text-[4.5rem]">
              Don&rsquo;t replace the product.{" "}
              <span className="relative whitespace-nowrap text-clay-600">
                Find the piece.
                <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-clay-300"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M2 8 C 50 2, 120 2, 198 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
          </RevealOnMount>

          <RevealOnMount delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 sm:text-xl">
              Lost an earbud, a charger, a controller stick? Buy the one missing part from someone
              who has it spare or sell the one gathering dust in your drawer.
            </p>
          </RevealOnMount>

          <RevealOnMount delay={0.24}>
            <div className="mt-8 max-w-xl">
              <SearchBar />
              {/* Popular searches - hidden for now, uncomment to bring back (also uncomment POPULAR and the Link import)
              <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-ink-500">
                <span className="font-semibold text-ink-700">Popular:</span>
                {POPULAR.map((term) => (
                  <Link
                    key={term}
                    href={`/browse?q=${encodeURIComponent(term)}`}
                    className="rounded-full bg-ink-50 px-3 py-1 font-medium text-ink-700 transition-colors hover:bg-clay-100 hover:text-clay-700"
                  >
                    {term}
                  </Link>
                ))}
              </p>
              */}
            </div>
          </RevealOnMount>

          <RevealOnMount delay={0.32}>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/need" size="lg" variant="primary" className="group">
                I need a part
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href="/sell" size="lg" variant="outline">
                I have a part to sell
              </LinkButton>
            </div>
          </RevealOnMount>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
