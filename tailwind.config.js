// Should mostly match styles/Color.ts
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#2E3338',
      black50: '#939799',
      white: '#ffffff',
      gray: colors.gray,
      blue: colors.blue,
      red: colors.red,
      yellow: colors.amber,
      teal: colors.teal,
      neutral: colors.neutral,
      fuchsia: colors.fuchsia,
      emerald: colors.emerald,
      cyan: colors.cyan,
      zinc: colors.zinc,
      green: {
        50: '#e8fbf3',
        100: '#baf3db',
        200: '#8cebc4',
        300: '#5ee3ad',
        400: '#2fdb95',
        500: '#19d88a',
        600: '#16c27c',
        700: '#14ac6e',
        800: '#119760',
        900: '#0f8152',
        950: '#0c6c45',
      },
      greengray: {
        darkest: '#C5D0CA',
        dark: '#D1DDD7',
        DEFAULT: '#DEE8E2',
        light: '#EDF8F1',
        lightest: '#F7FCF9',
      },
      bluegray: {
        DEFAULT: '#EAEFF0',
      },
      'primary-dark': '#02010A',
      'clean-white': '#FFFFFF',
      'primary-blush': '#FCD7FC',
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['serif'],
      mono: ['Roboto Mono', 'Courier New', 'monospace'],
      fg: ['var(--font-founders-grotesk)'],   
      inter: ['Inter', 'sans-serif'],
    },
    fontSize: {
      sm: ['15px', '20px'],
    },
    extend: {
      spacing: {
        46: '11.5rem',
        100: '26rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        lg2: '0 8px 24px 0px rgba(2, 1, 10, 0.08)',
      },
    },
  },
  plugins: [],
}
