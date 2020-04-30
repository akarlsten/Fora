// required to access .env in testing
require('dotenv').config()

module.exports = {
  transform: {
    '.js': 'jest-esm-transformer'
  },
  testEnvironment: 'node'
}
