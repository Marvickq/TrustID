/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // TrustID brand — dark cyber-sovereign palette
        brand: {
          50:  "#f0fdf9",
          100: "#ccfbef",
          200: "#99f6e0",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",  // primary teal
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          850: "#172035",
          900: "#0f172a",
          950: "#080d1a",
        },
      },
      fontFamily: {
        sans:  ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "scan":        "scan 2s linear infinite",
        "glow":        "glow 2s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 5px #14b8a6, 0 0 20px #14b8a640" },
          "50%":      { boxShadow: "0 0 20px #14b8a6, 0 0 60px #14b8a640" },
        },
      },
    },
  },
  plugins: [],
};
