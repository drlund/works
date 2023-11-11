const { eslintAlias } = require('./config-alias');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/jsx-runtime',
    'plugin:react/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'airbnb',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    allowImportExportEverywhere: true,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    babelOptions: {
      parserOpts: {
        plugins: [
          ['estree', { classFeatures: true }],
        ],
      },
    },
  },
  plugins: [
    'prettier',
    'react',
    'testing-library',
    'jest-dom',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'comma-dangle': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': ['warn'],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-return-assign': ['error', 'except-parens'],
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'prefer-promise-reject-errors': 'off',
    'prefer-template': 'warn',
    'react/destructuring-assignment': ['warn', 'always', { destructureInSignature: 'always', ignoreClassFields: true }],
    'react/forbid-prop-types': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-props-no-spreading': ['warn', {
      html: 'enforce',
      custom: 'ignore',
      explicitSpread: 'ignore',
    }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'testing-library/no-render-in-setup': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src']
      },
      alias: eslintAlias,
    },
  }
};
