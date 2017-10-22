module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import', 'vue', 'prettier'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    indent: ['error', 2],
    'prettier/prettier': 'error',
  },
};
