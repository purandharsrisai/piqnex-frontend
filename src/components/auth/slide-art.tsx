/** Small original SVG illustrations used by the login slides. */
const base = {
  viewBox: "0 0 480 440",
  preserveAspectRatio: "xMidYMid meet",
} as const;

export function FindArt({ className = "" }: { className?: string }) {
  return (
    <svg
      {...base}
      className={className}
      role="img"
      aria-label="A magnifier highlighting one part of a product"
    >
      <circle cx="240" cy="230" r="190" fill="#ffe4d8" />
      <ellipse
        cx="225"
        cy="396"
        rx="130"
        ry="13"
        fill="#0f1228"
        opacity="0.08"
      />
      {/* product: a kettle-like appliance */}
      <path
        d="M130 210h200v140a30 30 0 0 1-30 30H160a30 30 0 0 1-30-30z"
        fill="#ffffff"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M150 210c0-50 30-80 80-80s80 30 80 80"
        fill="#eceef5"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <rect x="205" y="112" width="50" height="22" rx="10" fill="#1f2540" />
      <path
        d="M330 250c46 0 46 80 0 80"
        fill="none"
        stroke="#1f2540"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect x="160" y="262" width="110" height="14" rx="7" fill="#aeeadf" />
      <rect x="160" y="290" width="70" height="14" rx="7" fill="#dde0ec" />
      {/* the one part we need */}
      <circle
        cx="230"
        cy="330"
        r="22"
        fill="#f9582a"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <path
        d="M230 316v14"
        stroke="#ffffff"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* magnifier */}
      <circle
        cx="262"
        cy="310"
        r="64"
        fill="#ffffff"
        fillOpacity="0.55"
        stroke="#1f2540"
        strokeWidth="6"
      />
      <path
        d="M308 358l54 54"
        stroke="#1f2540"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M222 272a50 50 0 0 1 36-18"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
        <path d="M400 110v14M393 117h14" />
        <path d="M84 150v10M79 155h10" />
      </g>
      <circle cx="400" cy="300" r="26" fill="#d5f6ef" />
      <circle cx="72" cy="330" r="18" fill="#ffc7b0" />
    </svg>
  );
}

export function RequestArt({ className = "" }: { className?: string }) {
  return (
    <svg
      {...base}
      className={className}
      role="img"
      aria-label="A speech bubble with a question mark and a notification bell"
    >
      <circle cx="240" cy="230" r="190" fill="#d5f6ef" />
      <ellipse
        cx="240"
        cy="396"
        rx="130"
        ry="12"
        fill="#0f1228"
        opacity="0.08"
      />
      {/* request bubble */}
      <path
        d="M110 110h230a28 28 0 0 1 28 28v130a28 28 0 0 1-28 28H210l-56 48v-48h-44a28 28 0 0 1-28-28V138a28 28 0 0 1 28-28z"
        fill="#ffffff"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M205 170c0-22 18-34 38-34s36 12 36 30c0 26-34 26-34 52"
        fill="none"
        stroke="#f9582a"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <circle cx="245" cy="248" r="9" fill="#f9582a" />
      <rect x="130" y="302" width="90" height="12" rx="6" fill="#dde0ec" />
      {/* bell */}
      <g transform="translate(380 330)">
        <circle r="52" fill="#ffffff" stroke="#1f2540" strokeWidth="5" />
        <path
          d="M-22 14c8-6 8-14 8-26a14 14 0 0 1 28 0c0 12 0 20 8 26z"
          fill="#25a395"
          stroke="#1f2540"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="M-7 22a7 7 0 0 0 14 0"
          fill="none"
          stroke="#1f2540"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          cx="22"
          cy="-26"
          r="11"
          fill="#f9582a"
          stroke="#1f2540"
          strokeWidth="4"
        />
      </g>
      <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
        <path d="M70 90v14M63 97h14" />
        <path d="M410 90v10M405 95h10" />
      </g>
      <circle cx="72" cy="360" r="20" fill="#ffc7b0" />
    </svg>
  );
}

export function ChatArt({ className = "" }: { className?: string }) {
  return (
    <svg
      {...base}
      className={className}
      role="img"
      aria-label="Two chat bubbles with a star rating"
    >
      <circle cx="240" cy="230" r="190" fill="#e4e7f3" />
      <ellipse
        cx="240"
        cy="400"
        rx="130"
        ry="12"
        fill="#0f1228"
        opacity="0.08"
      />
      {/* buyer bubble */}
      <path
        d="M90 100h200a26 26 0 0 1 26 26v70a26 26 0 0 1-26 26H160l-44 36v-36h-26a26 26 0 0 1-26-26v-70a26 26 0 0 1 26-26z"
        fill="#f9582a"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x="86" y="132" width="120" height="12" rx="6" fill="#ffffff" />
      <rect x="86" y="158" width="80" height="12" rx="6" fill="#ffc7b0" />
      {/* seller bubble */}
      <path
        d="M390 210H230a26 26 0 0 0-26 26v70a26 26 0 0 0 26 26h14v36l44-36h102a26 26 0 0 0 26-26v-70a26 26 0 0 0-26-26z"
        fill="#ffffff"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x="236" y="242" width="110" height="12" rx="6" fill="#aeeadf" />
      <rect x="236" y="268" width="70" height="12" rx="6" fill="#dde0ec" />
      <rect x="236" y="294" width="40" height="12" rx="6" fill="#dde0ec" />
      {/* small gear between */}
      <g transform="translate(375 130)">
        <circle r="24" fill="#25a395" stroke="#1f2540" strokeWidth="5" />
        <circle r="8" fill="#ffffff" stroke="#1f2540" strokeWidth="4" />
        <g stroke="#1f2540" strokeWidth="7" strokeLinecap="round">
          <path d="M0-32v-6M0 32v6M-32 0h-6M32 0h6M23-23l4-4M-23 23l-4 4M23 23l4 4M-23-23l-4-4" />
        </g>
      </g>
      {/* stars */}
      <g
        fill="#ffb400"
        stroke="#1f2540"
        strokeWidth="3.5"
        strokeLinejoin="round"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            transform={`translate(${108 + i * 44} 372)`}
            d="M0-17l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1z"
          />
        ))}
      </g>
    </svg>
  );
}
