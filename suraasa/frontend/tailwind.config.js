/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#7f62ff',
        'primary-dark': '#6b4dcc',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(127, 98, 255, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
