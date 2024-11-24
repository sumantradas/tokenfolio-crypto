/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    // Important: This ensures Tailwind's classes don't conflict with Bootstrap
    important: true,
    plugins: [],
  }
