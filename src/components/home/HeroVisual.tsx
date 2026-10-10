import { BadgeCheck, MapPin, Search } from "lucide-react";
import { RevealOnMount } from "@/components/ui/Reveal";

/**
 * Hand-built collage of the core loop: someone is missing a part, someone
 * else has it spare, Piqnex matches them. Three bold cards on a dotted
 * brand panel; the two main cards float gently out of phase.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto hidden h-[520px] w-full max-w-[560px] lg:block" aria-hidden="true">
      {/* Panel */}
      <div className="absolute inset-x-4 inset-y-6 overflow-hidden rounded-3xl bg-clay-600 shadow-pop">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1.5px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-clay-400/60 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-clay-800/50 blur-2xl" />
      </div>

      {/* Card 1 - missing */}
      <div className="absolute left-0 top-14 w-[270px] -rotate-3 motion-safe:animate-float">
        <RevealOnMount delay={0.25}>
        <div className="rounded-2xl bg-white p-5 shadow-pop">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-clay-100 px-2.5 py-1 text-xs font-bold text-clay-700">
              <Search className="h-3 w-3" /> I need
            </span>
          </div>
          <p className="mt-4 font-display text-2xl leading-tight text-ink-900">Right earbud</p>
          <p className="mt-1 text-sm text-ink-500">Sony WF-1000XM4</p>
          <div className="mt-4 h-2 w-2/3 rounded-full bg-ink-100" />
          <div className="mt-2 h-2 w-1/2 rounded-full bg-ink-100" />
        </div>
        </RevealOnMount>
      </div>

      {/* Card 2 - available */}
      <div className="absolute bottom-16 right-0 w-[290px] rotate-2 motion-safe:animate-float-delayed">
        <RevealOnMount delay={0.4}>
        <div className="rounded-2xl bg-white p-5 shadow-pop">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-100 px-2.5 py-1 text-xs font-bold text-moss-700">
              <BadgeCheck className="h-3.5 w-3.5" /> Available nearby
            </span>
            <span className="font-display text-xl text-ink-900">₹2,500</span>
          </div>
          <p className="mt-4 font-display text-2xl leading-tight text-ink-900">Right earbud</p>
          <p className="mt-1 text-sm text-ink-500">Used &middot; Working</p>
          <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-ink-600">
            <MapPin className="h-4 w-4 text-clay-600" /> Bengaluru, KA
          </p>
        </div>
        </RevealOnMount>
      </div>

      {/* Match chip */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <RevealOnMount delay={0.55}>
        <div className="flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-bold text-white shadow-pop">
          <BadgeCheck className="h-4 w-4 text-moss-300" /> Matched
        </div>
        </RevealOnMount>
      </div>
    </div>
  );
}
