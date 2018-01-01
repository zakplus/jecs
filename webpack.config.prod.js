const path = require('path');
const version = require('./package.json').version;

const filename = `jecs_${version}_min.js`

var config = {
  entry: './src/ecs.js',
  
  output: {
    path: path.resolve(__dirname, "browser"),
    filename,
    library: "Ecs",
    libraryTarget: "umd",
  },

  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};

module.exports = config;