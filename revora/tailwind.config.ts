import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        revora: {
          steel: "#4C6D8B",
          muted: "#6E8CA2",
          sky: "#60ADD9",
          dark: "#070B0D",
          charcoal: "#0E151A",
          charcoalLight: "#162028",
          textPrimary: "#111214",
          textSecondary: "#585E64",
          mainBg: "#FAFAFA",
          cardBg: "#FFFFFF",
          border: "#E5E7EB",
          borderDark: "#1E293B",
          success: "#2CC168",
        },
      },
      fontFamily: {
        heading: ["Manrope", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        cardHover: "0 12px 30px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)",
        glow: "0 0 40px -10px rgba(96, 173, 217, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
