const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/pages/index.tsx',
    meta_generative_art: './src/pages/meta_generative_art/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: "ts-loader" }
    ]
  },
  resolve: {
    modules: [
      "node_modules"
    ],
    extensions: [".ts", ".js", ".tsx"]
  }
};
