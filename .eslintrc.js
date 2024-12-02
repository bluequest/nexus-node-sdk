module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['jest', '@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prettier/prettier': ['warn', { endOfLine: 'auto' }],
  },
  ignorePatterns: ['node_modules/'],
  settings: {},
};
