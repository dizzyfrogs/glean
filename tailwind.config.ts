import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "Georgia", "serif"],
        jakarta: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        green: {
          50: "#f2f7ee",
          100: "#e1efd6",
          200: "#c4dfad",
          300: "#9fc87d",
          400: "#7aaf52",
          500: "#4a7c2f",
          600: "#3d6827",
          700: "#2d5016",
          800: "#1e3510",
          900: "#111f09",
        },
        stone: {
          50: "#fafaf9",
          100: "#f4f3f0",
          200: "#e7e5e0",
          300: "#d4d1ca",
          400: "#7d7870",
          500: "#5c5851",
          600: "#464340",
          700: "#333130",
          800: "#222120",
          900: "#1a1916",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        coral: {
          50: "#fff5f3",
          100: "#ffe8e3",
          200: "#ffc9be",
          300: "#ffa08f",
          400: "#ff7260",
          500: "#e84c3b",
          600: "#c73a2a",
        },
        blue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      borderRadius: {
        card: "14px",
        input: "10px",
        btn: "10px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06)",
        btn: "0 2px 8px rgba(74,124,47,0.3)",
        "input-focus": "0 0 0 3px rgba(74,124,47,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
