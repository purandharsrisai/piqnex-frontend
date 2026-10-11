import { RevealOnMount } from "@/components/ui/Reveal";

/** A round white badge holding a small product glyph. */
function Bubble({ x, y, r = 36, delayed = false, children }: { x: number; y: number; r?: number; delayed?: boolean; children: React.ReactNode }) {
  return (
    <g className={delayed ? "motion-safe:animate-float-delayed" : "motion-safe:animate-float"}>
      <g transform={`translate(${x} ${y})`}>
        <circle r={r} fill="#ffffff" stroke="#1f2540" strokeWidth="5" />
        {children}
      </g>
    </g>
  );
}

/**
 * Homepage hero illustration: a listing card for a replacement part, ringed
 * by badges for the kinds of products people shop for (laptops, gaming,
 * watches, cameras) and a "message seller" bubble. Original flat artwork in
 * the brand palette, sized to the window height so the whole illustration is
 * always visible without scrolling.
 */
export function HeroVisual() {
  return (
    <RevealOnMount delay={0.2} className="hidden items-start justify-center lg:flex lg:self-start lg:-mt-8">
      <svg
        viewBox="0 0 560 520"
        className="h-[min(520px,calc(100vh-10rem))] min-h-[340px] w-auto max-w-full"
        role="img"
        aria-label="A listing card for a replacement part, surrounded by badges for laptops, gaming, watches and cameras, with a message to the seller"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* background */}
        <circle cx="280" cy="262" r="236" fill="#ffe4d8" />
        <circle cx="512" cy="64" r="44" fill="#d5f6ef" />
        <circle cx="46" cy="470" r="32" fill="#ffc7b0" />
        <g fill="#ffa183">
          <circle cx="36" cy="64" r="6" />
          <circle cx="64" cy="38" r="3.5" />
          <circle cx="526" cy="460" r="5" />
        </g>

        {/* dotted links from the badges to the card */}
        <g stroke="#f9582a" strokeWidth="4" strokeDasharray="2 11" strokeLinecap="round" fill="none">
          <path d="M128 160C146 170 156 176 172 184" />
          <path d="M434 168C418 174 404 180 390 186" />
          <path d="M120 312C140 304 156 300 172 296" />
          <path d="M442 316C424 310 408 306 390 302" />
        </g>

        {/* listing card */}
        <g>
          <rect x="170" y="66" width="220" height="352" rx="28" fill="#000" opacity="0.07" transform="translate(0 8)" />
          <rect x="170" y="66" width="220" height="352" rx="28" fill="#ffffff" stroke="#1f2540" strokeWidth="6" />
          <rect x="186" y="82" width="188" height="150" rx="18" fill="#ffe4d8" />
          {/* the part */}
          <g className="motion-safe:animate-float">
            <g transform="translate(280 172) scale(0.9)">
              <circle r="42" fill="#f9582a" stroke="#1f2540" strokeWidth="6" />
              <circle r="21" fill="#ff774f" />
              <circle r="8" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
              <g stroke="#1f2540" strokeWidth="8" strokeLinecap="round">
                <path d="M0-50v-7M0 50v7M-50 0h-7M50 0h7M35-35l5-5M-35 35l-5 5M35 35l5 5M-35-35l-5-5" />
              </g>
            </g>
          </g>
          {/* matched badge */}
          <rect x="198" y="94" width="92" height="28" rx="14" fill="#d5f6ef" />
          <circle cx="213" cy="108" r="8" fill="#25a395" />
          <path d="M209 108l3 3 5-6" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="226" y="113" fontSize="13" fontWeight="700" fill="#1a6a63" fontFamily="inherit">Matched</text>
          {/* heart */}
          <circle cx="352" cy="108" r="14" fill="#ffffff" />
          <path d="M352 116c-9-6-12-10-12-14a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 4-3 8-12 14z" fill="#f9582a" />
          {/* details */}
          <text x="188" y="264" fontSize="19" fontWeight="700" fill="#0f1228" fontFamily="inherit">Replacement part</text>
          <text x="188" y="286" fontSize="13" fill="#646c8a" fontFamily="inherit">Fits your product</text>
          <rect x="188" y="298" width="112" height="26" rx="13" fill="#eceef5" />
          <text x="244" y="316" textAnchor="middle" fontSize="12" fontWeight="700" fill="#363d58" fontFamily="inherit">Used · Working</text>
          <path d="M194 346a7 7 0 1 1 14 0c0 6-7 12-7 12s-7-6-7-12z" fill="#f9582a" />
          <circle cx="201" cy="346" r="2.5" fill="#ffffff" />
          <text x="216" y="351" fontSize="13" fontWeight="600" fill="#4a5270" fontFamily="inherit">Near you</text>
          <rect x="186" y="370" width="188" height="36" rx="18" fill="#da3f14" />
          <text x="280" y="393" textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff" fontFamily="inherit">Message seller</text>
        </g>

        {/* product badges */}
        {/* laptop */}
        <Bubble x={92} y={146}>
          <rect x="-18" y="-17" width="36" height="25" rx="4" fill="#aeeadf" stroke="#1f2540" strokeWidth="4" />
          <path d="M-25 14h50" stroke="#1f2540" strokeWidth="5" strokeLinecap="round" />
        </Bubble>
        {/* game controller */}
        <Bubble x={470} y={150} delayed>
          <rect x="-25" y="-12" width="50" height="27" rx="13" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
          <path d="M-14 -1v9M-18.500 3.500h9" stroke="#1f2540" strokeWidth="4" strokeLinecap="round" />
          <circle cx="11" cy="0" r="3.500" fill="#f9582a" />
          <circle cx="18" cy="6" r="3.500" fill="#25a395" />
        </Bubble>
        {/* watch */}
        <Bubble x={84} y={322} delayed>
          <rect x="-7" y="-24" width="14" height="10" rx="3" fill="#bcc1d6" stroke="#1f2540" strokeWidth="3.500" />
          <rect x="-7" y="14" width="14" height="10" rx="3" fill="#bcc1d6" stroke="#1f2540" strokeWidth="3.500" />
          <rect x="-14" y="-16" width="28" height="32" rx="9" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
          <path d="M0 0v-7M0 0l5 3" stroke="#1f2540" strokeWidth="3.500" strokeLinecap="round" />
        </Bubble>
        {/* camera */}
        <Bubble x={476} y={326}>
          <rect x="-9" y="-19" width="18" height="8" rx="3" fill="#1f2540" />
          <rect x="-24" y="-14" width="48" height="31" rx="9" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
          <circle cx="0" cy="2" r="9" fill="#aeeadf" stroke="#1f2540" strokeWidth="3.500" />
        </Bubble>

        {/* chat bubble */}
        <g className="motion-safe:animate-float-delayed">
          <g transform="translate(36 436)">
            <path d="M18 0h138a18 18 0 0 1 18 18v14a18 18 0 0 1-18 18H44l-20 16v-16h-6A18 18 0 0 1 0 32V18A18 18 0 0 1 18 0z" fill="#1f2540" />
            <text x="87" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff" fontFamily="inherit">Is this available?</text>
          </g>
        </g>

        {/* sparkles */}
        <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
          <path d="M440 76v14M433 83h14" />
          <path d="M120 70v10M115 75h10" />
        </g>
      </svg>
    </RevealOnMount>
  );
}
