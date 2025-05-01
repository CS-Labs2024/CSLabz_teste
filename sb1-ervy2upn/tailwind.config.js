/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#FDFFEE',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#00FFC6',
          foreground: '#002b28',
        },
        secondary: {
          DEFAULT: '#002b28',
          foreground: '#00FFC6',
        },
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#002b28',
        },
        accent: {
          DEFAULT: '#00FFC6',
          foreground: '#002b28',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        container: '2rem',
        header: '4rem',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
