/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bkg: {
          dark: "#222831",
          light: "#393E46",
          white: "#EEEEEE",
        },

        primary: "#38b000",
        "primary-hover": "#2f9400",
        "txt-white": "#F8F8FF",
        "txt-black": "#2b2d42",
        "azure-white": "#F0FFFF",
        "ice-white": "#F0F8FF",
      },
    },
  },
  plugins: [],
};
