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
    maxHeight: {
      full: '100%',
      screen: '100vh',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem'
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['Inconsolata', 'monospace'],
      display: ['Fredoka One', 'sans-serif']
    },
    extend: {
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'odd', 'even']
  },
  plugins: [
    require('@tailwindcss/custom-forms')
  ]
}
