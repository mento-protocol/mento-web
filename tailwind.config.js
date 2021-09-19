const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  purge: ['src/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#2E3338',
      white: '#ffffff',
      gray: colors.gray,
      blue: colors.blue,
      red: colors.red,
      teal: colors.teal,
      green: colors.emerald,
      lime: {
        darkest: '#C1CDAD',
        dark: '#D1E1B7',
        DEFAULT: '#E0E6D6',
        light: '#F1F7E8',
        lightest: '#F5F6F4',
      },
      bluegray: {
        DEFAULT: '#EAEFF0',
      },
    },
    fontFamily: {
      sans: ['Karla', 'sans-serif'],
      serif: ['serif'],
    },
    extend: {
      spacing: {
        100: '26rem',
        112: '28rem',
        128: '32rem',
        144: '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  variants: {
    extend: {
      padding: ['last'],
      filter: ['hover', 'active', 'disabled'],
      brightness: ['hover', 'active', 'disabled'],
    },
  },
  plugins: [],
}
