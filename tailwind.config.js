const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {},
  },
  plugins: [
    plugin(function({ addVariant }) {
      addVariant('only-fine', '@media (not (any-pointer: coarse)) and (not (any-pointer: none))');
    }),
  ],
}

