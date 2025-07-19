/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Titillium Web"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#E5F2FF',
          100: '#CCE5FF',
          200: '#99CBFF',
          300: '#66B2FF',
          400: '#3398FF',
          500: '#007FFF',
          600: '#0066CC',
          700: '#004C99',
          800: '#003366',
          900: '#001933',
        },
        neon: {
          blue: '#00F6FF',
          purple: '#9C27B0',
        },
        dark: {
          100: '#1A1A1A',
          200: '#242424',
          300: '#2D2D2D',
          400: '#363636',
          500: '#404040',
        },
      },
      animation: {
        'wave': 'wave 8s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out forwards',
        'slideIn': 'slideIn 0.5s ease-in-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(100%)' },
          '50%': { filter: 'brightness(150%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};