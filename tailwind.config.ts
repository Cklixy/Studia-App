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

        // Apple Frosted White surfaces
        "frost-base": "#F4F6FB",
        "frost-surface": "rgba(255, 255, 255, 0.72)",
        "frost-elevated": "rgba(255, 255, 255, 0.92)",
        "frost-card": "#FFFFFF",
        "frost-border": "rgba(0, 0, 0, 0.07)",
        "frost-border-light": "rgba(255, 255, 255, 0.8)",

        // Cool tone accents
        "glacier-blue": "#0066CC",
        "polar-cyan": "#0EA5E9",
        "ice-mint": "#06B6D4",
        "cool-iris": "#4F46E5",
        "cool-berry": "#C10A2B",
        "cool-amber": "#F59E0B",

        // Apple Light Mode typography
        "arctic-slate": "#1D1D1F",
        "arctic-secondary": "#6E6E73",
        "arctic-tertiary": "#636366",
        // Borde de campos de formulario: 3,5:1 sobre blanco (WCAG 1.4.11)
        "arctic-borde": "#8A8A8E",


        // Apple HIG accents
        "apple-blue": "#0066CC",
        "apple-green": "#34C759",
        "apple-orange": "#F59E0B",
        "apple-red": "#C10A2B",
        "apple-purple": "#AF52DE",
        "apple-teal": "#06B6D4",
      },
      boxShadow: {
        "apple-sm": "0 2px 8px rgba(0, 20, 50, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        "apple-md": "0 8px 24px -4px rgba(0, 25, 60, 0.06), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        "apple-lg": "0 20px 48px -12px rgba(0, 30, 80, 0.09), 0 4px 12px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.95)",
        "apple-glow": "0 0 24px -2px rgba(0, 113, 227, 0.25)",
        "apple-glow-blue": "0 0 24px -2px rgba(14, 165, 233, 0.25)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "22px",
        "4xl": "28px",
      },
      letterSpacing: {
        tightest: "-0.035em",
        tighter: "-0.025em",
        tight: "-0.015em",
        normal: "0em",
        wide: "0.02em",
        wider: "0.04em",
        widest: "0.06em",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "sans-serif"],
        display: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "var(--font-geist-sans)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
