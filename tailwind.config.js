/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0287a8",
        "primary-light": "#5fb0c1",
        secondary: "#00c3c7",
        "secondary-light": "#6ee0e1",
        dark: "#ffcf22",
        button: "#70dbc4",
        buttondark: "#53b8a2",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
