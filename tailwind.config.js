tailwind.config = {
  theme: {
    extend: {
      /*  PALETTE */
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

        /* SEMANTIC TOKENS */
        accent: "#f59e0b", // gold-500
        "accent-dark": "#d97706", // hover 
        "accent-light": "#fef3c7", 
        "accent-dim": "rgba(245,158,11,0.15)", // glows, overlays

        // Backgrounds
        "bg-base": "#0d0c10", // page background
        "bg-card": "#16141f", // movie cards
        "bg-textarea": "#1c1a28", 
        "bg-border": "#2e2b44", // dividers, borders

        // Surfaces
        surface: "#16141f", // cards, dialogs

        // Text
        "text-primary": "#f5f3ef", // headings, important
        "text-body": "#a09ab5", // body, descriptions
        muted: "#5e5a78", // placeholders, captions
        "text-gold": "#f59e0b", // accent text

        /* RATING COLOURS  */
        "rating-high": "#22c55e", // 7+  green
        "rating-mid": "#f59e0b", // 5-7 gold
        "rating-low": "#ef4444", // <5  red
      },

      /*  FONTS  */
      fontFamily: {
        headings: ['"Bebas Neue"', "Impact", "sans-serif"], // headings
        body: ['"DM Sans"', "system-ui", "sans-serif"], // body text
      },

      /*  SHADOWS  */
      boxShadow: {
        card: "0 4px 32px rgba(0,0,0,0.6)",
        "card-hover": "0 8px 48px rgba(0,0,0,0.8)",
        gold: "0 0 24px rgba(245,158,11,0.3)", // accent glow
      },

      /*  BORDER RADIUS  */
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },

      /*  ANIMATIONS  */
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease both",
        "fade-in": "fade-in 0.3s ease both",
      },
    },
  },
};
