/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],

  // Makes every utility class use !important so Tailwind
  // wins over Bootstrap and any other unlayered CSS,
  // no need to use the "!" prefix on individual classes.
  important: true,

  theme: {
    extend: {},
  },

  plugins: [],
};
