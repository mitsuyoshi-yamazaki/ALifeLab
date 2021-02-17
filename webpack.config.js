const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/pages/index.tsx',
    meta_generative_art_layout: './src/pages/meta_generative_art/layout.tsx',
    meta_generative_art_source: './src/pages/meta_generative_art/source.tsx',
    machines_and_tapes_layout: './src/pages/machines_and_tapes/layout.tsx',
    machines_and_tapes_source: './src/pages/machines_and_tapes/source.tsx',
    machines_and_tapes_ex2: './src/pages/machines_and_tapes_ex2/layout.tsx'
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
