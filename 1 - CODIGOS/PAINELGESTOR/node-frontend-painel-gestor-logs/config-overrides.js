const path = require('path');
const webpack = require('webpack');
const { webpackAlias } = require('./config-alias');

/**
 * @param {import('webpack').Configuration} config
 */
module.exports = function override(config) {
  const { resolve: loaders, plugins } = config;

  loaders.fallback = {
    assert: require.resolve('assert/'),
    buffer: require.resolve('buffer/'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    stream: require.resolve('stream-browserify'),
    url: require.resolve('url/'),
    util: require.resolve('util/'),
    zlib: require.resolve('browserify-zlib'),
    crypto: false,
    // crypto: require.resolve('crypto-browserify')
    fs: false,
    net: false,
    path: false,
    // path: require.resolve('path-browserify'),
    tls: false,
  };
  loaders.roots = [
    path.resolve(__dirname, 'src'),
  ];
  loaders.alias = webpackAlias;
  loaders.modules = [
    'node_modules',
    path.resolve(__dirname, 'src'),
  ];

  plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  return config;
};
