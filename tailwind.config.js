/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'media', // This enables automatic dark mode based on system preferences
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#d97706', // amber-600
          dark: '#f59e0b', // amber-500
        },
      },
    },
  },
  plugins: [],
} 