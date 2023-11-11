const path = require('path');

const pathAlias = {
  '@/': path.resolve(__dirname, 'src/'),
  components: path.resolve(__dirname, 'src/components/'),
  config: path.resolve(__dirname, 'src/config/'),
  hooks: path.resolve(__dirname, 'src/hooks/'),
  layouts: path.resolve(__dirname, 'src/layouts/'),
  pages: path.resolve(__dirname, 'src/pages/'),
  services: path.resolve(__dirname, 'src/services/'),
  utils: path.resolve(__dirname, 'src/utils/'),
};

const pathAliasArr = Object.entries(pathAlias);

exports.webpackAlias = {
  ...pathAlias,
  '@': pathAlias['@/']
};

exports.eslintAlias = pathAliasArr.concat([
  ['@/*', pathAlias['@/']],
  ['@test-utils', path.resolve(__dirname, 'test/test-utils')]
]);

exports.jestAlias = pathAliasArr.reduce((acc, [key, value]) => {
  acc[`^${key}(.*)$`] = `${value}/$1`;
  return acc;
}, /** @type {Record<string, string>} */({}));
