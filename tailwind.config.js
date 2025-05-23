/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    zIndex: {
      '25': 25,
      '50': 50,
      '75': 75,
      '100': 100,
      '1000': 1000,
      '9999': 9999
    },
    extend: {
      colors: {
        buttonBackground: "$ngwcp_primary1",
      },
    },

  },
  plugins: [require('tailwindcss-primeui')],
};
