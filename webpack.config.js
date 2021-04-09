const path = require("path");

module.exports = {
  entry: {
    pages: path.resolve(__dirname, "./pages/script.js"),
    main: path.resolve(__dirname, "./script.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
};
