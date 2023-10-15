module.exports = {
  purge: ['./view/build/*.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
      },
      borderColor: (theme) => ({
       ...theme('colors'),
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
