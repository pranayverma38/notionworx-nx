/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],

  // Prefix all Tailwind classes with "tw-" (e.g. tw-flex, tw-p-4, tw-mb-4).
  // This prevents silent collisions with the project's own custom utility
  // classes (mb-4, gap-4, py-4, text-primary, bg-primary, etc.) and with
  // Bootstrap helpers that share the same names.
  prefix: "tw-",

  // With the prefix in place, important:true is safe — it ensures every
  // tw-* class beats Bootstrap / custom SCSS when intentionally applied.
  important: true,

  theme: {
    extend: {},
  },

  plugins: [],
};
