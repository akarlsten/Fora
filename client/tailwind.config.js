module.exports = {
  purge: [],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1920px'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      display: ['Fredoka One', 'sans-serif']
    },
    extend: {
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
