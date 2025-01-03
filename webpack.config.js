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
    drawer_fullscreen: "./src/simulations/drawer_fullscreen/layout.tsx",
    drawer_sandbox: "./src/simulations/drawer_sandbox/layout.tsx",
    drawer_combination: "./src/simulations/drawer_combination/layout.tsx",
    lines_and_angles: "./src/simulations/lines_and_angles/layout.tsx",
    la_fullscreen: "./src/simulations/la_fullscreen/layout.tsx",
    la_interactive_fullscreen: "./src/simulations/la_interactive_fullscreen/layout.tsx",
    la_interactive: "./src/simulations/la_interactive/layout.tsx",
    drawer_change_parameter: "./src/simulations/drawer_change_parameter/layout.tsx",
    cellular_automata: "./src/simulations/cellular_automata/layout.tsx",
    hex_cellular_automata: "./src/simulations/hex_cellular_automata/layout.tsx",
    hex_cellular_automata_autosearch: "./src/simulations/hex_cellular_automata_autosearch/layout.tsx",
    kaleidoscope_v2: "./src/simulations/kaleidoscope_v2/layout.tsx",
    garden: "./src/simulations/garden/layout.tsx",
    mass_conservation: "./src/simulations/mass_conservation/layout.tsx",
    mass_conservation_multi_state: "./src/simulations/mass_conservation_multi_state/layout.tsx",
    hex_mn_mcca: "./src/simulations/hex_mn_mcca/layout.tsx",
    modular_life: "./src/simulations/modular_life/layout.tsx",
    modular_life_v2: "./src/simulations/modular_life_v2/layout.tsx",
    modular_life_v2_4: "./src/simulations/modular_life_v2_4/layout.tsx",
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
