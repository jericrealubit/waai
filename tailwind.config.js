/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        horizon: {
          sky: "#0ea5e9", // Vibrant WA Sky
          ocean: "#f0f9ff", // Pale Coastal Water
          sand: "#fef3c7", // Soft Beach Sand
          shell: "#fafaf9", // Off-white surface
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "horizon-gradient":
          "radial-gradient(circle at 0% 0%, var(--tw-gradient-from) 0%, transparent 50%), radial-gradient(circle at 100% 100%, var(--tw-gradient-to) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
};
