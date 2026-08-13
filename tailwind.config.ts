import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        primary: { 50: "#eff6ff", 100: "#dbeafe", 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb", 700: "#1d4ed8", 900: "#1e3a5f" },
        success: { 50: "#f0fdf4", 100: "#dcfce7", 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
        danger: { 50: "#fef2f2", 100: "#fee2e2", 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
        warning: { 50: "#fffbeb", 100: "#fef3c7", 400: "#fbbf24", 500: "#f59e0b", 600: "#d97706" },
        violet: { 400: "#a78bfa", 500: "#8b5cf6", 600: "#7c3aed" },
        rose: { 400: "#fb7185", 500: "#f43f5e" },
        teal: { 400: "#2dd4bf", 500: "#14b8a6" },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        bounceSoft: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
      },
    },
  },
  plugins: [],
};

export default config;
