/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0A", soft: "#0E0C0A", surface: "#141210" },
        amber: { DEFAULT: "#FF9F1C", soft: "#F4C77A" },
        gold: "#D4AF37",
        smoke: { DEFAULT: "#A3A3A3", dim: "#737373" },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["'Outfit'", "system-ui", "sans-serif"],
      },
      letterSpacing: { ultra: "0.3em" },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,159,28,0.5), 0 0 30px -4px rgba(255,159,28,0.45)",
        glowsoft: "0 0 40px -8px rgba(255,159,28,0.35)",
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%,100%": { opacity: 0.5 }, "50%": { opacity: 1 } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
