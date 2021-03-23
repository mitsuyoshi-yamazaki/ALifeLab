const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index/index.tsx',
    meta_generative_art: './src/simulations/meta_generative_art/layout.tsx',
    meta_generative_art_v2: './src/simulations/meta_generative_art_v2/layout.tsx',
    meta_generative_art_v4: './src/simulations/meta_generative_art_v4/layout.tsx',
    machines_and_tapes: './src/simulations/machines_and_tapes/layout.tsx',
    machines_and_tapes_ex2: './src/simulations/machines_and_tapes_ex2/layout.tsx'
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
