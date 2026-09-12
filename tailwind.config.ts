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
        // studia+ brand colors
        "deep-ink": "#11131A",
        "deep-surface": "#191C25",
        "deep-elevated": "#222633",
        "electric-periwinkle": "#6A92E5",
        "signal-lime": "#C8FF4A",
        "electric-lavender": "#B89CFF",
        "warm-coral": "#FF7A66",
        "text-primary": "#F5F7FA",
        "text-secondary": "#9AA3B5"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        display: ["var(--font-space-grotesk)"],
      }
    },
  },
  plugins: [],
};
export default config;


