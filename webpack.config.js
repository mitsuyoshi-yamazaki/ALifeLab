const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/pages/index.tsx",
    gallery: "./src/pages/gallery/layout.tsx",
    lab: "./src/pages/lab/layout.tsx",
    meta_generative_art: "./src/simulations/meta_generative_art/layout.tsx",
    meta_generative_art_v2: "./src/simulations/meta_generative_art_v2/layout.tsx",
    meta_generative_art_v4: "./src/simulations/meta_generative_art_v4/layout.tsx",
    meta_generative_art_v5: "./src/simulations/meta_generative_art_v5/layout.tsx",
    machines_and_tapes: "./src/simulations/machines_and_tapes/layout.tsx",
    machines_and_tapes_ex2: "./src/simulations/machines_and_tapes_ex2/layout.tsx",
    drawer: "./src/simulations/drawer/layout.tsx",
    drawer_mortal: "./src/simulations/drawer_mortal/layout.tsx",
    drawer_symmetry: "./src/simulations/drawer_symmetry/layout.tsx",
    hex_cellular_automata: "./src/simulations/hex_cellular_automata/layout.tsx",
    hex_cellular_automata_autosearch: "./src/simulations/hex_cellular_automata_autosearch/layout.tsx",
    kaleidoscope_v2: "./src/simulations/kaleidoscope_v2/layout.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
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
}
