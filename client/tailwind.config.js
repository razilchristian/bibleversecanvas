/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        gujarati: ['"Hind Vadodara"', '"Mukta Vaani"', '"Noto Sans Gujarati"', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#fdfaf4',
          100: '#faf3e0',
          200: '#f5e6c0',
          300: '#edd59a',
        },
        scripture: {
          50: '#f0f4ff',
          100: '#e0eaff',
          500: '#4f6ef7',
          600: '#3b5de8',
          700: '#2d4fd6',
          900: '#1a2f8a',
        },
        ink: {
          50: '#f8f7f4',
          100: '#f0ede4',
          800: '#2c2416',
          900: '#1a1510',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    },
  },
  plugins: [],
}
