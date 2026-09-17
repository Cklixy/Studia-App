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
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Apple Frosted White surfaces
        "frost-base": "#F4F6FB",
        "frost-surface": "rgba(255, 255, 255, 0.72)",
        "frost-elevated": "rgba(255, 255, 255, 0.92)",
        "frost-card": "#FFFFFF",
        "frost-border": "rgba(0, 0, 0, 0.07)",
        "frost-border-light": "rgba(255, 255, 255, 0.8)",

        // Cool tone accents
        "glacier-blue": "#0071E3",
        "polar-cyan": "#0EA5E9",
        "ice-mint": "#06B6D4",
        "cool-iris": "#6366F1",
        "cool-berry": "#C10A2B",
        "cool-amber": "#F59E0B",

        // Apple Light Mode typography
        "arctic-slate": "#1D1D1F",
        "arctic-secondary": "#6E6E73",
        "arctic-tertiary": "#636366",

        // Mappings for seamless backward compatibility
        "system-base": "#F4F6FB",
        "system-surface": "rgba(255, 255, 255, 0.75)",
        "system-elevated": "#FFFFFF",
        "deep-ink": "#F4F6FB",
        "deep-surface": "rgba(255, 255, 255, 0.85)",
        "deep-elevated": "#FFFFFF",
        "electric-periwinkle": "#0071E3",
        "signal-lime": "#0EA5E9",
        "electric-lavender": "#6366F1",
        "warm-coral": "#C10A2B",
        "text-primary": "#1D1D1F",
        "text-secondary": "#6E6E73",
        "text-tertiary": "#636366",

        // Apple HIG accents
        "apple-blue": "#0071E3",
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
