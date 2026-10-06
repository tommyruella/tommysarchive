import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "border-sky-400",
    "border-amber-400",
    "border-emerald-400",
    "border-rose-500",
    "border-purple-400",
    "border-white",
    "text-sky-400",
    "text-amber-400",
    "text-emerald-400",
    "text-rose-400",
    "text-purple-400",
    "text-white",
    "bg-sky-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-rose-500",
    "bg-purple-400",
    "bg-white",
    "hover:border-sky-400/40",
    "hover:border-amber-400/40",
    "hover:border-emerald-400/40",
    "hover:border-rose-500/40",
    "hover:border-purple-400/40",
    "hover:border-white/40",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#000000",
        surface: {
          DEFAULT: "#070709",
          elevated: "#0f0f13",
          card: "rgba(14, 14, 18, 0.7)",
        },
        cobalt: "#0022ff",
        crimson: "#e11d48",
        "toxic-cyan": "#00f0ff",
        "thermal-orange": "#ff5500",
        "rec-red": "#ff003b",
        "hud-green": "#00ff66",
        chrome: {
          highlight: "#ffffff",
          mid: "#cbd5e1",
          dark: "#475569",
        },
      },
      aspectRatio: {
        anamorphic: "2.39 / 1",
        cinemascope: "2.35 / 1",
        academy: "4 / 3",
      },
      backgroundImage: {
        "chrome-gradient":
          "linear-gradient(135deg, #ffffff 0%, #cbd5e1 25%, #64748b 50%, #f8fafc 75%, #334155 100%)",
        "thermal-glow":
          "radial-gradient(circle at 50% 50%, rgba(255, 85, 0, 0.2) 0%, rgba(0, 34, 255, 0.15) 50%, transparent 75%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glint-spin": "spin 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
