import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/styles"
import { LinkCard } from "../../react-components/lab/link_card"
import { defaultTheme } from "../../react-components/common/default_theme"
import { Footer } from "../../react-components/common/footer"

const App = () => {
  const bodyStyle: CSSProperties = {
    display: "table",
    marginTop: "4rem",
    marginLeft: "4rem",
    marginRight: "4rem",
    paddingBottom: "5rem",
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <div style={bodyStyle}>
        <LinkCard title="線と角度" link="lines_and_angles.html" />
        <LinkCard title="線と角度 - 実験用 (幾何学図形ジェネレータ)" link="drawer.html?system.run=0&system.auto_download=0" />
        <LinkCard title="線と角度 - 連続的なパラメータ変更" link="drawer_change_parameter.html?simulation.lsystem_rule=A:-88,A,-152,A&simulation.parameter_changes=5,-5&simulation.parameter_period=720&system.auto_download=0" />
        <LinkCard title="L-Systemの水槽" link="drawer_mortal.html?simulation.mutation_rate=0.0005" />
        <LinkCard title="鏡像対称" link="drawer_symmetry.html" />
        <LinkCard title="六角セルオートマトン" link="hex_cellular_automata.html?s.ei=10&s.r=random&s.is=random" />
        <LinkCard title="六角セルオートマトン自動探索" link="hex_cellular_automata_autosearch.html?s.ei=10&s.r=random&s.is=random" />
        <LinkCard title="汎用セルオートマトン" link="cellular_automata.html" />
        <LinkCard title="Meta Generative Art" link="meta_generative_art.html" />
        <LinkCard title="Meta Generative Art v2" link="meta_generative_art_v2.html?s=600&o=100&a=1&fr=0.5&fs=0.1&ff=0.999&fa=200&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Meta Generative Art v4" link="meta_generative_art_v4.html?s=600&o=100&a=1&fr=0.5&fs=0.1&ff=0.999&fa=200&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Meta Generative Art v5" link="meta_generative_art_v5.html?s=600&o=40&a=1&w=10&fr=0.5&fs=0.1&ff=0.999&fa=200&fw=0.4&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Extended Machines and Tapes" link="machines_and_tapes.html?d=1&m=attracted&a=0&t=0&si=200&s=1000&f=0.94&g=&ig=0&p=200&ls=6&mr=0&l=40&bl=20&mi=210&ri=210&af=0.6&rf=0.5&fd=0.05&fv=0.45" />
        <LinkCard title="Extended Machines and Tapes v2" link="machines_and_tapes_ex2.html" />
        <LinkCard title="万華鏡" link="kaleidoscope_v2.html" />
        <LinkCard title="Darwin's Garden" link="garden.html" />
        <LinkCard title="質量保存CA" link="mass_conservation.html" />
        <LinkCard title="多状態質量保存CA" link="mass_conservation_multi_state.html?debug=1&cell_size=12&world_size=80" />
        <LinkCard title="多近傍質量保存CA" link="hex_mn_mcca.html" />
        <LinkCard title="人工生命の箱庭 v1" link="modular_life.html" />
        <LinkCard title="人工生命の箱庭 v2" link="modular_life_v2.html?cell_size=16&world_size=60&frame_skip=1&heat_damage=0.2&energy_heat_conversion=0.1&substance_amount=12&energy_transfer_resistance=5&energy_production=100" />
        <LinkCard title="人工生命の箱庭 v2.4" link="modular_life_v2_4.html?cell_size=16&world_size=60&frame_skip=1&heat_damage=0.2&energy_heat_conversion=0.1&substance_amount=12&energy_transfer_resistance=5&energy_production=100" />
      </div>
      <Footer homePath="../" />
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
