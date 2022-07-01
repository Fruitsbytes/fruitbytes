const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin')
  ],
}
