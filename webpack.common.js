const path = require('path');

module.exports = {
  entry: {
    'background.js': './src/background.js',
    'options.js': './src/options.js',
    'popup.js': './src/popup.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist/js')
  }
};
