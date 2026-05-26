/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Tag badge colors (used dynamically in blog components)
    'bg-red-50','text-red-700','border-red-100',
    'bg-green-50','text-green-700','border-green-100',
    'bg-blue-50','text-blue-700','border-blue-100',
    'bg-orange-50','text-orange-700','border-orange-100',
    'bg-purple-50','text-purple-700','border-purple-200',
    'bg-yellow-50','text-yellow-700','border-yellow-100',
    'bg-teal-50','text-teal-700','border-teal-100',
    'bg-indigo-50','text-indigo-700','border-indigo-100',
    'bg-accent-50','text-accent-700','border-accent-100',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6eaf2',
          100: '#c0c9df',
          200: '#96a5c9',
          300: '#6c81b3',
          400: '#4d66a3',
          500: '#2d4b93',
          600: '#28448b',
          700: '#1e3a7f',
          800: '#162f6e',
          900: '#0b1d4e',
          950: '#060f2e',
        },
        green: {
          50: '#e8faf0',
          100: '#c6f2d9',
          200: '#a0e9c0',
          300: '#76e0a6',
          400: '#52d991',
          500: '#2dd87d',
          600: '#24c76f',
          700: '#17b35e',
          800: '#0a9f4e',
          900: '#007d35',
        },
        accent: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd4ff',
          300: '#8ebaff',
          400: '#5995ff',
          500: '#3370ff',
          600: '#1b4ff5',
          700: '#133be1',
          800: '#1631b6',
          900: '#182e8f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 60s linear infinite',
        'marquee-reverse': 'marquee-reverse 60s linear infinite',
        'marquee-fast': 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
