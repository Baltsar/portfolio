import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        statement: ["var(--font-statement)", "var(--font-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Times New Roman", "Georgia", "serif"],
      },
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        card: "var(--bg-card)",
        "card-foreground": "var(--text-primary)",
        muted: "var(--text-secondary)",
        border: "var(--border-glass)",
        accent: {
          red: "var(--accent-red)",
          blue: "var(--accent-blue)",
          purple: "var(--accent-purple)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
