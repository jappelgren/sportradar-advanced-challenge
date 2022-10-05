module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  settings: {
    'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
    'import/resolver': { typescript: {} }
  },
  rules: {
    'max-len': [1, 180, 2],
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-unused-vars': [2, {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_',
    }],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/adjacent-overload-signatures': 2,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': true,
        'ts-nocheck': true,
      },
    ],
    curly: ['error', 'all'],
    'object-curly-spacing': ['error', 'always'],
    'semi': 0,
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }]
  }
}