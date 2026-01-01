import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./apps/registry/**/*.{js,ts,jsx,tsx,mdx}",
    "./apps/docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14b8a6",
          foreground: "#ffffff",
          hover: "#0d9488",
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        border: "#e2e8f0",
        input: "#e2e8f0",
        ring: "#14b8a6",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
