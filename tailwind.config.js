/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6674D9",
          50: "#C2C8F0",
          100: "#B8BEED",
          200: "#A3ACE8",
          300: "#8F99E3",
          400: "#7A87DE",
          500: "#6674D9",
          600: "#4D5ED3",
          700: "#3547CD",
          800: "#2D3EB6",
          900: "#27369D",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar-hide"),
  ],
};
