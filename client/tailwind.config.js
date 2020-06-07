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
        'bg-pink-200', 'bg-pink-400', 'bg-pink-600',
        'bg-blue-200', 'bg-blue-400', 'bg-blue-600',
        'bg-red-200', 'bg-red-400', 'bg-red-600',
        'bg-orange-200', 'bg-orange-400', 'bg-orange-600',
        'bg-green-200', 'bg-green-400', 'bg-green-600',
        'bg-teal-200', 'bg-teal-400', 'bg-teal-600',
        'bg-gray-200', 'bg-gray-400', 'bg-gray-600',
        'bg-purple-200', 'bg-purple-400', 'bg-purple-600',
        'bg-indigo-200', 'bg-indigo-400', 'bg-indigo-600',
        'text-pink-400', 'text-pink-600', 'text-blue-400',
        'text-blue-600', 'text-red-400', 'text-red-600',
        'text-orange-400', 'text-orange-600', 'text-green-400',
        'text-green-600', 'text-teal-400', 'text-teal-600',
        'text-gray-400', 'text-gray-600', 'text-purple-400',
        'text-purple-600', 'text-indigo-400', 'text-indigo-600',
        'border-pink-200', 'border-pink-400', 'border-blue-200',
        'border-blue-400', 'border-red-200', 'border-red-400',
        'border-orange-200', 'border-orange-400', 'border-green-200',
        'border-green-400', 'border-teal-200', 'border-teal-400',
        'border-gray-200', 'border-gray-400', 'border-purple-200',
        'border-purple-400', 'border-indigo-200', 'border-indigo-400'
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
    aspectRatio: ['responsive'],
    margin: ['responsive', 'first', 'last']
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-responsive-embed'),
    require('tailwindcss-aspect-ratio'),
    require('tailwindcss-animations')
  ]
}
