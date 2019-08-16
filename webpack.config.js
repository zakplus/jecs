const path = require('path');
const _ = require('lodash');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('./package.json');

// Basic configuration
const basicConfig = {
  entry: './src/jecs.js',

  output: {
    path: path.resolve(__dirname, 'browser'),
    library: 'Jecs',
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};

// Development configuration (filename with version code)
const devConfig = _.cloneDeep(basicConfig);
devConfig.mode = 'development';
devConfig.output.filename = `jecs_${version}.js`;

// Development configuration (filename without version code)
const devConfigNoVersion = _.cloneDeep(basicConfig);
devConfigNoVersion.output.filename = 'jecs.js';

// Production configuration (filename with version code)
const prodConfig = _.cloneDeep(basicConfig);
prodConfig.mode = 'production';
prodConfig.output.filename = `jecs_${version}_min.js`;
/*
prodConfig.plugins = [
  new UglifyJsPlugin({
    uglifyOptions: {
      max_line_len: 80
    }
  })
];
*/

// Production configuration (filename without version code)
const prodConfigNoVersion = _.cloneDeep(prodConfig);
prodConfigNoVersion.output.filename = 'jecs_min.js';

module.exports = [
  devConfig,
  devConfigNoVersion,
  prodConfig,
  prodConfigNoVersion,
];
