import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // opt-in only; nothing auto-switches
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#4A0A0A",
          gold: "#D4AF37",
          cream: "#FFF7E6",
          accent: "#E49B0F"
        }
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        sanskrit: ["var(--font-tiro)", "serif"],
      }
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
