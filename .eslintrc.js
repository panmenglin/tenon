module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'react', 'prettier', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/recommended',
  ],

  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        eslintIntegration: true,
        stylelintIntegration: true,
        printWidth: 120,
        useTabs: false,
        tabWidth: 2,
        singleQuote: true,
        semi: false,
        trailingComma: 'all',
        endOfLine: 'auto',
        arrowParens: 'avoid',
      },
    ],
    'import/extensions': [
      'error',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
        demo: 'always',
      },
    ],
    // disable eslint resolve import, let typescript handle it
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-explicit-any': 0,
    'import/order': ['error', { 'newlines-between': 'always' }],
    // 'import/first': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-param-reassign': 0,
    'react/require-default-props': 0,
    'import/prefer-default-export': 0,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': [
      2,
      {
        html: 'ignore',
      },
    ],
    'no-console': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
  },
  settings: {
    version: 'detect',
    // 'import/resolver': { typescript: {} },
  },
}