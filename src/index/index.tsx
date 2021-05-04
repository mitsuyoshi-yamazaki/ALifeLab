import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/core"
import { LinkCard } from "../react-components/link_card"
import { defaultTheme } from "../react-components/default_theme"
import { Display } from "../react-components/display"

const Title = () => {
  const style: CSSProperties = {
    display: "table", // horizontal center
    margin: "auto",
    marginTop: "90px",
    marginBottom: "90px",
  }

  return (
    <div>
      <img src={"resources/title.svg"} style={style} /> {/* Dunno how to show Futura as text */}
    </div>
  )
}

const App = () => {
  const bodyStyle: CSSProperties = {
    display: "table",
    marginTop: "4rem",
    marginLeft: "4rem",
    marginRight: "4rem",
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Title />
      <Display />
      <hr />
      <div style={bodyStyle}>
        <LinkCard title="幾何学図形ジェネレータ" link="pages/drawer.html?system.run=0&system.auto_download=0" />
        <LinkCard title="L-Systemの水槽" link="pages/drawer_mortal.html?simulation.mutation_rate=0.0005" />
        <LinkCard title="鏡像対称" link="pages/drawer_symmetry.html" />
        <LinkCard title="六角セルオートマトン" link="pages/hex_cellular_automata.html?s.ei=10&s.r=random&s.is=random" />
        <LinkCard title="Meta Generative Art" link="pages/meta_generative_art.html" />
        <LinkCard title="Meta Generative Art v2" link="pages/meta_generative_art_v2.html?s=600&o=100&a=1&fr=0.5&fs=0.1&ff=0.999&fa=200&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Meta Generative Art v4" link="pages/meta_generative_art_v4.html?s=600&o=100&a=1&fr=0.5&fs=0.1&ff=0.999&fa=200&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Meta Generative Art v5" link="pages/meta_generative_art_v5.html?s=600&o=40&a=1&w=10&fr=0.5&fs=0.1&ff=0.999&fa=200&fw=0.4&d.d=0&d.f=0.1&d.c=1&d.fi=0.5" />
        <LinkCard title="Extended Machines and Tapes" link="pages/machines_and_tapes.html?d=1&m=attracted&a=0&t=0&si=200&s=1000&f=0.94&g=&ig=0&p=200&ls=6&mr=0&l=40&bl=20&mi=210&ri=210&af=0.6&rf=0.5&fd=0.05&fv=0.45" />
        <LinkCard title="Extended Machines and Tapes v2" link="pages/machines_and_tapes_ex2.html" />
      </div>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
