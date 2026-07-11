/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E67E22', // Deeper luxury amber/orange
        secondary: '#1A1A1A', // Rich charcoal
        background: '#FAF9F6', // Ivory
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '20px',
        '3xl': '28px'
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0,0,0,0.05)',
        'luxury-hover': '0 30px 60px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
