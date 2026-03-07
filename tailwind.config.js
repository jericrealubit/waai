/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2D7FF9",
          dark: "#0A1A2F",
          gold: "#F5C542",
        },
      },
    },
  },
  plugins: [],
};
