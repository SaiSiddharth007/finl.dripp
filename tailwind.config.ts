import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "var(--bg-ivory)",
        sage: "var(--accent-russian-green)",
        "sage-dark": "var(--accent-russian-dark)",
        forest: "var(--ink-forest)",
        moss: "#2C3627",
        clay: "#B88B72",
        hairline: "var(--border-subtle)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        tube: { "0%,100%": { opacity: "0.55" }, "50%": { opacity: "1" } },
        scan: { "0%": { transform: "translateY(0%)" }, "100%": { transform: "translateY(100%)" } },
      },
      animation: {
        ticker: "ticker 32s linear infinite",
        tube: "tube 4s ease-in-out infinite",
        scan: "scan 2.4s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
