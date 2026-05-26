import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#f5ead2",
        bone: "#fff7df",
        ember: "#ef3c19",
        saffron: "#f3b12a",
        wine: "#65131a",
        cacao: "#2a1511",
        ink: "#11100d"
      },
      fontFamily: {
        display: ["Impact", "Arial Black", "sans-serif"],
        body: ["Arial", "Helvetica", "sans-serif"]
      },
      boxShadow: {
        soft: "0 28px 80px rgba(42, 21, 17, 0.18)"
      }
    }
  },
  plugins: []
};

export default config;
