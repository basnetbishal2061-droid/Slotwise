/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b5bfd',
          600: '#2d46e0',
          700: '#2436b8',
        },
        ink: '#0f172a',
      },
    },
  },
  plugins: [],
};
