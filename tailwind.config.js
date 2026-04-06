/*
  tailwind.config.js — Movie Diary
  ══════════════════════════════════════════════════════════════
  Load order in HTML:
    1. <script src="https://cdn.tailwindcss.com">
    2. <script src="./tailwind.config.js">
    3. <style type="text/tailwindcss"> ... @layer ... </style>

  Two-level color system:
    Level 1 — Palette   : concrete shades (gold-400, cinema-900…)
    Level 2 — Semantic  : roles (accent, bg-base, surface…)
  ══════════════════════════════════════════════════════════════
*/

tailwind.config = {
  theme: {
    extend: {
      /* ── LEVEL 1: PALETTE ───────────────────────────────── */
      colors: {
        gold: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b", // main accent
          600: "#d97706", // hover
          700: "#b45309",
        },
        cinema: {
          50: "#f8f7f4",
          900: "#0d0c10", // deepest bg
          850: "#111018",
          800: "#16141f", // cards
          750: "#1c1a28",
          700: "#242236", // borders/dividers
          600: "#2e2b44",
        },

        /* ── LEVEL 2: SEMANTIC TOKENS ───────────────────────── */
        // Use these in HTML — describe role, not shade
        // Rebrand = change value here only

        // Accent (interactive elements, highlights)
        accent: "#f59e0b", // gold-500
        "accent-dark": "#d97706", // hover state
        "accent-light": "#fef3c7", // subtle tinted bg
        "accent-dim": "rgba(245,158,11,0.15)", // glows, overlays

        // Backgrounds (darkest → lightest)
        "bg-base": "#0d0c10", // page background
        "bg-deep": "#111018", // hero overlay areas
        "bg-card": "#16141f", // movie cards
        "bg-raised": "#1c1a28", // elevated panels
        "bg-border": "#2e2b44", // dividers, borders

        // Surfaces
        surface: "#16141f", // cards, dialogs

        // Text
        "text-primary": "#f5f3ef", // headings, important
        "text-body": "#a09ab5", // body, descriptions
        muted: "#5e5a78", // placeholders, captions
        "text-gold": "#f59e0b", // accent text

        /* ── RATING COLOURS ─────────────────────────────────── */
        "rating-high": "#22c55e", // 7+  green
        "rating-mid": "#f59e0b", // 5-7 gold
        "rating-low": "#ef4444", // <5  red
      },

      /* ── FONTS ──────────────────────────────────────────────
       font-display → Bebas Neue  (cinematic, all-caps headings)
       font-sans    → DM Sans     (clean body text)
    ────────────────────────────────────────────────────────── */
      fontFamily: {
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },

      /* ── SHADOWS ─────────────────────────────────────────── */
      boxShadow: {
        soft: "0 2px 16px rgba(0,0,0,0.4)",
        card: "0 4px 32px rgba(0,0,0,0.6)",
        "card-hover": "0 8px 48px rgba(0,0,0,0.8)",
        gold: "0 0 24px rgba(245,158,11,0.3)", // accent glow
        "gold-sm": "0 0 10px rgba(245,158,11,0.2)",
      },

      /* ── BORDER RADIUS ───────────────────────────────────── */
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      /* ── ANIMATIONS ──────────────────────────────────────── */
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          // Mobile nav from right
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        shimmer: {
          // Skeleton loading effect
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease both",
        "fade-in": "fade-in 0.3s ease both",
        "slide-in": "slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
};
