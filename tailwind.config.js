/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { primary: { DEFAULT: "#6366F1", dark: "#4F46E5", soft: "#EEF0FF" }, background: "#FFFFFF", surface: { DEFAULT: "#FFFFFF", muted: "#F8F8FC" }, ink: "#171923", "text-muted": "#667085", border: "#E8E8F0", teal: { DEFAULT: "#35B99F", soft: "#E9F8F4" }, warm: { DEFAULT: "#F4B860", soft: "#FFF6E6" }, star: "#F5B942" },
    fontFamily: { display: ["Manrope", "sans-serif"], body: ["Inter", "sans-serif"] },
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "40px", "2xl": "64px" },
    borderRadius: { card: "18px", input: "11px", pill: "999px" },
  } }, plugins: [],
};
