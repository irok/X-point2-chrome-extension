const path = require('path');

module.exports = {
  entry: {
    'background.js': './src/background.js',
    'options.js': './src/options.js',
    'popup.js': './src/popup.js'
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist/js')
  }
};
