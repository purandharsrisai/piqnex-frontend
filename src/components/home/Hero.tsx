import { LinkButton } from "@/components/ui/Button";
import { SearchBar } from "./SearchBar";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="border-b border-ink-200/70 bg-paper bg-grain">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-6">
        <div className="max-w-xl">
          <p className="font-display text-base italic text-clay-700">
            A part didn&rsquo;t break. It just went missing.
          </p>
          <h1 className="mt-3 font-display text-[2.75rem] leading-[1.05] text-ink-900 sm:text-6xl">
            Find your
            <br />
            missing piece.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-600">
            Don&rsquo;t replace the whole product. Replace the missing piece. A
            marketplace for the one part you&rsquo;re missing - and the one someone
            else has spare.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href="/need" size="lg" variant="primary">
              I Need a Part
            </LinkButton>
            <LinkButton href="/sell" size="lg" variant="outline">
              I Have a Part
            </LinkButton>
          </div>

          <div className="mt-8 border-t border-ink-200 pt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
              Or search what&rsquo;s already listed
            </p>
            <SearchBar />
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
