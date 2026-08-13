/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b5bff',
        secondary: '#7c3aed',
        accent: '#10b981',
        surface: '#f8fafc',
        bg: '#f4f7ff',
        dark: '#08112a'
      },
      boxShadow: {
        glass: '0 20px 80px rgba(20, 31, 70, 0.16)'
      },
      backgroundImage: {
        'hero-glow': 'radial-gradient(circle at top, rgba(59,91,255,0.18), transparent 45%)'
      }
    }
  },
  plugins: []
};
