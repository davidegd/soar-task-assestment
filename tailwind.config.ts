import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        "2xl": "1400px",
      },
    },
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
