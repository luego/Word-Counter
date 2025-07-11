/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      },
      fontFamily: {
        // Add custom fonts if needed
      },
    },
  },
  plugins: [require('daisyui')],
};