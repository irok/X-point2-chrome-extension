const path = require('path');

module.exports = {
  entry: {
    'background.js': './src/background.js',
    'content.js': './src/content.js',
    'options.js': './src/options.js',
    'popup.js': './src/popup.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist/js')
  }
};
