// jest.config.js
module.exports = {
  bail: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/?(*.)+(test).[tj]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/ports/rest/routes/**/*.ts',
    'src/middleware/**/*.ts',
    'src/services/**/*.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};