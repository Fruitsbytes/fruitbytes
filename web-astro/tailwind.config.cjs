/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx,svelte,vue}',
    './node_modules/flowbite/**/*.js',
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
};
