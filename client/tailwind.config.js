module.exports = {
  purge: {
    content: [
      './components/**/*.js',
      './pages/**/*.js',
      './node_modules/next/dist/pages/**/*.js',
      './node_modules/next/dist/pages/**/*.ts',
      './node_modules/next/dist/pages/**/*.ts'
    ],
    options: {
      whitelist: [
        'bg-gray-100',
        'bg-pink-400'
      ]
    }
  },
  theme: {
    animations: {
      floatUpDown: {
        '0%': {
          transform: 'translateY(0%)'
        },
        '50%': {
          transform: 'translateY(10%)'
        },
        '100%': {
          transform: 'translateY(0%)'
        }
      }
    },
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
    aspectRatio: {
      none: 0,
      square: [1, 1],
      '16/9': [16, 9],
      '4/3': [4, 3],
      '21/9': [21, 9]
    },
    extend: {
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem'
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'odd', 'even'],
    aspectRatio: ['responsive']
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-responsive-embed'),
    require('tailwindcss-aspect-ratio'),
    require('tailwindcss-animations')
  ]
}
