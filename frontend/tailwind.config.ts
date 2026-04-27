import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          500: "#2f6df6",
          600: "#2848bd",
          700: "#233c9f",
          800: "#1e347f"
        },
        ink: "#111827"
      },
      boxShadow: {
        panel: "0 12px 30px rgba(17, 24, 39, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
