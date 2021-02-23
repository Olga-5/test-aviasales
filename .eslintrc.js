module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier'],
  env: {
    browser: true,
  },
  rules: {
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,
    'import/no-named-default': 0,
    'import/no-extraneous-dependencies': 0,
    'import/extensions': 0,
    'prettier/prettier': 'error',
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
  },
};