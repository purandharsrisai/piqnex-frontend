/**
 * A small hand-built illustration of the core loop (need <-> have),
 * standing in for the generic gradient blob / stock illustration you'd get
 * from a template. Built from two plain "sticky note" style cards and an
 * SVG connector - nothing here is a stock asset, and it's specific to what
 * this product actually does.
 */
export function HeroVisual() {
  return (
    <div className="relative hidden h-[340px] w-full max-w-sm md:block" aria-hidden="true">
      <svg
        className="absolute inset-0 h-full w-full text-clay-300"
        viewBox="0 0 320 340"
        fill="none"
      >
        <path
          d="M70 90 C 160 130, 150 210, 240 250"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute left-0 top-8 w-52 -rotate-3 rounded-xl border border-ink-200 bg-white p-4 shadow-card">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
          Missing
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-ink-900">Right Earbud</p>
        <p className="mt-0.5 text-xs text-ink-500">Sony WF-1000XM4</p>
      </div>

      <div className="absolute bottom-6 right-0 w-56 rotate-2 rounded-xl border border-ink-200 bg-white p-4 shadow-card-hover">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-moss-700">
          Available nearby
        </p>
        <p className="mt-1 font-display text-lg leading-snug text-ink-900">Right Earbud</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-ink-500">Used - Working</p>
          <p className="font-display text-base text-ink-900">₹2,500</p>
        </div>
      </div>

      <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-clay-200 bg-clay-50 text-clay-700 shadow-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
