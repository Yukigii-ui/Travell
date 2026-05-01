/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        surface: {
          DEFAULT: '#0B1120',
          card: '#131D2E',
          elevated: '#1A2540',
        },
        sky: {
          accent: '#38BDF8',
        },
      },
    },
  },
  plugins: [],
};
