module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'], // Ensure Jest looks in the correct folders
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  // Add timeout configuration
  testTimeout: 10000,
};
