/**
 * Original brand illustration for the auth pages: an appliance with one
 * missing knob, and the replacement part floating in to complete it - the
 * "find the piece" idea behind Piqnex. Pure SVG, uses the brand palette.
 */
export function AuthIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 440"
      className={className}
      role="img"
      aria-label="An appliance with a missing knob and the matching replacement part floating in to complete it"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* soft background shapes */}
      <circle cx="240" cy="230" r="190" fill="#ffe4d8" />
      <circle cx="400" cy="90" r="46" fill="#d5f6ef" />
      <circle cx="70" cy="360" r="34" fill="#ffc7b0" />
      <g fill="#ffa183">
        <circle cx="60" cy="120" r="5" />
        <circle cx="84" cy="96" r="3" />
        <circle cx="430" cy="330" r="5" />
        <circle cx="410" cy="360" r="3" />
      </g>

      {/* shadow */}
      <ellipse
        cx="225"
        cy="408"
        rx="130"
        ry="14"
        fill="#0f1228"
        opacity="0.08"
      />

      {/* appliance body */}
      <rect
        x="100"
        y="110"
        width="250"
        height="290"
        rx="28"
        fill="#ffffff"
        stroke="#1f2540"
        strokeWidth="5"
      />
      {/* control panel */}
      <rect
        x="100"
        y="110"
        width="250"
        height="70"
        rx="28"
        fill="#eceef5"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <rect x="100" y="150" width="250" height="30" fill="#eceef5" />
      <path d="M100 180H350" stroke="#1f2540" strokeWidth="5" />
      {/* display */}
      <rect x="128" y="132" width="64" height="26" rx="8" fill="#1f2540" />
      <rect x="138" y="141" width="26" height="8" rx="4" fill="#46bfb0" />
      {/* existing knob */}
      <circle cx="262" cy="145" r="19" fill="#1f2540" />
      <circle cx="262" cy="145" r="12" fill="#363d58" />
      <path
        d="M262 135v9"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* missing knob slot */}
      <circle
        cx="315"
        cy="145"
        r="19"
        fill="#fff4ef"
        stroke="#f9582a"
        strokeWidth="3.5"
        strokeDasharray="6 6"
      />
      <circle cx="315" cy="145" r="4" fill="#f9582a" />

      {/* door */}
      <circle
        cx="225"
        cy="293"
        r="82"
        fill="#eceef5"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <circle
        cx="225"
        cy="293"
        r="62"
        fill="#aeeadf"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <path
        d="M180 275a50 50 0 0 1 36-30"
        stroke="#ffffff"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M200 330c14 12 36 12 50-2"
        stroke="#46bfb0"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* feet */}
      <rect x="130" y="398" width="34" height="12" rx="6" fill="#1f2540" />
      <rect x="286" y="398" width="34" height="12" rx="6" fill="#1f2540" />

      {/* path of the replacement part */}
      <path
        d="M402 72C380 70 346 90 326 124"
        fill="none"
        stroke="#f9582a"
        strokeWidth="3.5"
        strokeDasharray="2 9"
        strokeLinecap="round"
      />
      <path
        d="M338 120l-14 8 3-17"
        fill="none"
        stroke="#f9582a"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* floating replacement knob */}
      <g transform="rotate(-14 408 66)">
        <circle
          cx="408"
          cy="66"
          r="30"
          fill="#f9582a"
          stroke="#1f2540"
          strokeWidth="5"
        />
        <circle cx="408" cy="66" r="17" fill="#ff774f" />
        <path
          d="M408 46v18"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      {/* sparkles */}
      <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
        <path d="M444 40v14M437 47h14" />
        <path d="M368 30v10M363 35h10" />
      </g>

      {/* magnifier */}
      <g>
        <circle
          cx="392"
          cy="300"
          r="34"
          fill="#ffffff"
          fillOpacity="0.85"
          stroke="#1f2540"
          strokeWidth="5"
        />
        <path
          d="M416 326l28 28"
          stroke="#1f2540"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M376 296l10 10 18-20"
          fill="none"
          stroke="#1b8379"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* small gear */}
      <g transform="translate(62 230)">
        <circle r="22" fill="#25a395" stroke="#1f2540" strokeWidth="5" />
        <circle r="8" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
        <g stroke="#1f2540" strokeWidth="7" strokeLinecap="round">
          <path d="M0-30v-6M0 30v6M-30 0h-6M30 0h6M21-21l4-4M-21 21l-4 4M21 21l4 4M-21-21l-4-4" />
        </g>
      </g>
    </svg>
  );
}
