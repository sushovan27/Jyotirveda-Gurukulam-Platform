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
        "brand-dark": "#4A0A0A",
        "brand-gold": "#D4AF37",
        "brand-cream": "#FFF7E6",
        "brand-amber": "#E49B0F",
        "brand-gold-hover": "#B8941F",
        "brand-dark-hover": "#3A0808",
        "brand-light-gold": "#FCEABB",
        "brand-text": "#1b1b1b",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Palatino", "serif"],
        sanskrit: ["var(--font-sanskrit)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
