import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./modules/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#080E18",
        sidebar: "#090F19",
        panel: { DEFAULT: "#111B2B", strong: "#101A2B" },
        field: "#0B1422",
        line: "rgba(153,174,203,0.13)",
        ink: {
          primary: "#E8EEF7",
          secondary: "#A0AEC0",
          muted: "#8493A8",
        },
        brand: { DEFAULT: "#39C79A", bright: "#5DDBAC" },
        risk: {
          elevated: "#F6A623",
          moderate: "#70A8FF",
          lower: "#39C79A",
          unknown: "#8493A8",
        },
        warn: "#F3C16C",
        danger: "#F07878",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Manrope", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "8px",
        card: "12px",
        dialog: "14px",
        badge: "6px",
      },
      fontSize: {
        eyebrow: ["10px", { lineHeight: "14px", letterSpacing: "0.08em" }],
        meta: ["11px", { lineHeight: "15px" }],
        body: ["13px", { lineHeight: "19px" }],
        panel: ["15px", { lineHeight: "21px" }],
        page: ["26px", { lineHeight: "32px" }],
      },
    },
  },
  plugins: [],
};

export default config;
