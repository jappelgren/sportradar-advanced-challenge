module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  roots: [
    'src'
  ],
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};