import type { Config } from "tailwindcss";

// Design tokens for Piqnex - "bold modern marketplace" template.
//
// White canvas, one confident vivid brand color, deep navy ink, and a fresh
// teal for "available / success". Rounder corners, heavier sans headlines.
//
// NOTE: the token *names* (clay / moss / ink / paper) are kept from the
// previous template so every existing page re-themes without touching its
// class names. `clay` is now the brand (vivid orange-red) scale and `moss`
// is now the teal scale. Rename later if desired.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Brand - vivid tangerine/coral. 600 is the AA-safe button color
        // with white text; 500 is the bright accent for large elements.
        clay: {
          50: "#fff4ef",
          100: "#ffe4d8",
          200: "#ffc7b0",
          300: "#ffa183",
          400: "#ff774f",
          500: "#f9582a",
          600: "#da3f14",
          700: "#b43010",
          800: "#8f2813",
          900: "#752414",
        },
        // Secondary - fresh teal for available / success states.
        moss: {
          50: "#effcf9",
          100: "#d5f6ef",
          200: "#aeeadf",
          300: "#7cd8ca",
          400: "#46bfb0",
          500: "#25a395",
          600: "#1b8379",
          700: "#1a6a63",
          800: "#1a554f",
          900: "#19463f",
        },
        // Cool navy-slate ink.
        ink: {
          50: "#f6f7fb",
          100: "#eceef5",
          200: "#dde0ec",
          300: "#bcc1d6",
          400: "#8a91ae",
          500: "#646c8a",
          600: "#4a5270",
          700: "#363d58",
          800: "#1f2540",
          900: "#0f1228",
        },
        // Page background - clean white.
        paper: "#ffffff",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,18,40,0.04), 0 2px 8px rgba(15,18,40,0.05)",
        "card-hover": "0 12px 32px rgba(15,18,40,0.14)",
        pop: "0 20px 50px -12px rgba(15,18,40,0.25)",
        brand: "0 10px 24px -6px rgba(218,63,20,0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "toast-progress": {
          "0%": { transform: "scaleX(1)" },
          "100%": { transform: "scaleX(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6.5s ease-in-out infinite",
        "toast-in": "toast-in 0.25s ease-out",
        "toast-progress": "toast-progress linear forwards",
        "float-delayed": "float 6.5s ease-in-out -3.2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
