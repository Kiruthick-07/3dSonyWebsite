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
        void: "#050505",
        obsidian: "#0A0A0C",
        sonyBlue: "#0050FF",
        sonyCyan: "#00D6FF",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Segoe UI",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "sony-gradient": "linear-gradient(135deg, #0050FF 0%, #00D6FF 100%)",
        "hero-radial":
          "radial-gradient(ellipse 70% 55% at 50% 45%, #050815 0%, #050505 72%)",
      },
    },
  },
  plugins: [],
};

export default config;
