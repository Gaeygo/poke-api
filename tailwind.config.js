/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

module.exports = {
  darkMode: "class",

  content: ["./src/public/**/*.{js,css}", "./src/view/**/*.ejs"],

  theme: {
    extend: {
      colors: {
        yellowt: "#FFD04E",
        greent: "#489C82",
        greyt: "#0D0D0D",
      },
    },
  },

  plugins: [require("tailwind-children")],
};
