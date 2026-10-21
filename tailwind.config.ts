import type { Config } from "tailwindcss";
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#211d18", brand: "#1f6a72", stage: "#f5f3ee" },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
} satisfies Config;
