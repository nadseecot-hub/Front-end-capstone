/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16263D",
        parchment: "#FAF6EF",
        amber: {
          DEFAULT: "#E3A548",
          dark: "#C88A2E",
        },
        teal: "#3F6E67",
        star: "#F0B429",
        "text-muted": "#6B6459",
        surface: "#FFFFFF",
        border: "#E7E1D6",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        "2xl": "64px",
      },
      borderRadius: {
        card: "12px",
        input: "8px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};
