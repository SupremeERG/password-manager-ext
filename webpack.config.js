const path = require("path")
    // make sure these are the right contents to output
module.exports = {
  entry: './scripts/background.js',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
