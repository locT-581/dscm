import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    keyframes: {
      "slide-up": {
        "0%": { transform: "translateY(80%)" },
        "20%": { transform: "translateY(80%)" },
        "100%": { transform: "translateY(0)" },
      },
    },
    animation: {
      "slide-up": "slide-up 0.425s ease-out",
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
