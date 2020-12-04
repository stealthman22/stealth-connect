module.exports = {
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
  },
  plugins: [
    'react',
  ],
  rules: {
    // removes indentation error
    // allowIndentationTabs: true,
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: [2, 2, { SwitchCase: 1 }],
  },
};
