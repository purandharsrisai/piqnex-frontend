import type { Config } from "tailwindcss";

// Design tokens for Piqnex.
//
// Deliberately steering away from the generic "AI tool" look: no
// blue/purple SaaS gradient, no bright all-caps neon accent, no maximally
// rounded corners on everything. Instead: a warm paper background, a single
// considered clay/terracotta accent (used sparingly, not painted on every
// element), a muted moss green for secondary states, and a restrained
// corner-radius scale that reads more like a well-made print product than
// a template.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Primary accent - a muted clay/terracotta, not a bright SaaS orange.
        // Used for the two core actions (I Need / I Have) and little else.
        clay: {
          50: "#fbf4f0",
          100: "#f4e2d8",
          200: "#e7c3ac",
          300: "#d69f7d",
          400: "#c17e54",
          500: "#a8613a",
          600: "#8c4d2d",
          700: "#703c24",
          800: "#57301f",
          900: "#43261a",
        },
        // Secondary accent - muted moss/olive, used sparingly for
        // "open"/"available" style states so not everything is clay.
        moss: {
          50: "#f3f5ef",
          100: "#e3e8d9",
          200: "#c7d1b3",
          300: "#a6b489",
          400: "#849168",
          500: "#69754f",
          600: "#535d3e",
          700: "#414833",
          800: "#33382a",
          900: "#292d22",
        },
        // Warm neutral ink - slightly brown-gray rather than blue-gray, so
        // it sits comfortably next to the clay/moss accents.
        ink: {
          50: "#f8f6f3",
          100: "#eee9e2",
          200: "#dcd3c7",
          300: "#bbaf9e",
          400: "#93887a",
          500: "#6f6559",
          600: "#544c43",
          700: "#403a33",
          800: "#2c2823",
          900: "#1c1916",
        },
        // The page background - warm off-white "paper" instead of stark
        // white or a gradient.
        paper: "#faf7f2",
      },
      fontFamily: {
        // Body copy: a dependable system-font stack. No network fetch at
        // build time, zero layout shift, looks native on every platform.
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        // Headlines only: a serif with real character (Fraunces), self
        // hosted via @fontsource so there's no runtime Google Fonts
        // dependency. This one change does more to make the product feel
        // designed-by-a-person than any layout tweak.
        serif: ["var(--font-serif)", "Georgia", "Cambria", "serif"],
      },
      borderRadius: {
        // Restrained on purpose - the "everything is a giant rounded
        // bubble" look is one of the biggest AI-template tells.
        lg: "0.5rem",
        xl: "0.625rem",
        "2xl": "0.875rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,25,22,0.05), 0 1px 6px rgba(28,25,22,0.05)",
        "card-hover": "0 6px 20px rgba(28,25,22,0.10)",
      },
      backgroundImage: {
        // A barely-there grain texture for large flat backgrounds (the
        // hero), so it reads as paper rather than a flat digital gradient.
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
