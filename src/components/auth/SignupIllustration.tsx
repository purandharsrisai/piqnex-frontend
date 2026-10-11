/**
 * Original illustration for the signup page: an open parcel full of spare
 * parts with a price tag and a "sold" check - the sell-your-spare-part side
 * of Piqnex. Pure SVG, uses the brand palette.
 */
export function SignupIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 440"
      className={className}
      role="img"
      aria-label="An open parcel full of spare parts with a price tag, ready to be listed and sold"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="240" cy="235" r="190" fill="#d5f6ef" />
      <circle cx="80" cy="90" r="40" fill="#ffe4d8" />
      <circle cx="420" cy="350" r="32" fill="#ffc7b0" />
      <g fill="#46bfb0">
        <circle cx="52" cy="230" r="5" />
        <circle cx="72" cy="254" r="3" />
        <circle cx="438" cy="120" r="5" />
        <circle cx="418" cy="146" r="3" />
      </g>

      <ellipse
        cx="240"
        cy="404"
        rx="150"
        ry="14"
        fill="#0f1228"
        opacity="0.08"
      />

      {/* parts popping out of the box */}
      {/* big gear */}
      <g transform="translate(180 170)">
        <circle r="38" fill="#25a395" stroke="#1f2540" strokeWidth="5" />
        <circle r="13" fill="#ffffff" stroke="#1f2540" strokeWidth="5" />
        <g stroke="#1f2540" strokeWidth="9" strokeLinecap="round">
          <path d="M0-46v-8M0 46v8M-46 0h-8M46 0h8M33-33l6-6M-33 33l-6 6M33 33l6 6M-33-33l-6-6" />
        </g>
      </g>
      {/* knob */}
      <g transform="rotate(12 292 150)">
        <circle
          cx="292"
          cy="150"
          r="30"
          fill="#f9582a"
          stroke="#1f2540"
          strokeWidth="5"
        />
        <circle cx="292" cy="150" r="16" fill="#ff774f" />
        <path
          d="M292 132v16"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      {/* bolt */}
      <g transform="rotate(-24 350 215)">
        <rect
          x="320"
          y="203"
          width="60"
          height="24"
          rx="6"
          fill="#bcc1d6"
          stroke="#1f2540"
          strokeWidth="5"
        />
        <path
          d="M334 203v24M346 203v24M358 203v24"
          stroke="#1f2540"
          strokeWidth="3.5"
        />
        <rect
          x="302"
          y="198"
          width="24"
          height="34"
          rx="8"
          fill="#ffc7b0"
          stroke="#1f2540"
          strokeWidth="5"
        />
      </g>

      {/* box back flaps */}
      <path
        d="M90 250l-34-40h84l20 40z"
        fill="#e7a15f"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M390 250l34-40h-84l-20 40z"
        fill="#e7a15f"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* box front */}
      <path
        d="M90 240h300v140a22 22 0 0 1-22 22H112a22 22 0 0 1-22-22z"
        fill="#f2b877"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M90 240h300l-8 34H98z"
        fill="#e7a15f"
        stroke="#1f2540"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* tape */}
      <rect
        x="214"
        y="240"
        width="52"
        height="162"
        fill="#ffe4d8"
        stroke="#1f2540"
        strokeWidth="5"
      />
      <path
        d="M226 300h28M226 316h28"
        stroke="#1f2540"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* price tag */}
      <g transform="rotate(-10 130 330)">
        <path
          d="M84 308h82l22 22-22 22H84z"
          fill="#ffffff"
          stroke="#1f2540"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <circle cx="168" cy="330" r="5" fill="#1f2540" />
        <path
          d="M98 322h34M98 338h22"
          stroke="#f9582a"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>

      {/* sold check badge */}
      <g transform="translate(402 302)">
        <circle r="32" fill="#25a395" stroke="#1f2540" strokeWidth="5" />
        <path
          d="M-14 0l10 11 19-22"
          fill="none"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* sparkles */}
      <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
        <path d="M110 100v14M103 107h14" />
        <path d="M410 60v10M405 65h10" />
      </g>
    </svg>
  );
}
