import React from "react"
import ReactDOM from "react-dom"
import { Helmet } from "react-helmet"

const App = () => {
  return (
    <div>
      <Helmet>
        <head prefix="og: http://ogp.me/ns#">test hoge</head>
          <meta property="og:title" content="ALifes and Generative Arts" />
          <meta property="og:description" content="" />
          <meta property="og:type" content="website" />
          <meta property="og:image"
            content="https://mitsuyoshi-yamazaki.github.io/ALifeGameJam2019/resources/docs/image001.png" />
          <meta property="og:url" content="https://mitsuyoshi-yamazaki.github.io/ALifeGameJam2019/index.html" />

      </Helmet>
      <a href="src/pages/meta_generative_art/index.html">Meta Generative Art</a>
      <br />
      <a href="src/pages/machines_and_tapes/index.html">Extended Machines and Tapes</a>
      <br />
      <a href="src/pages/machines_and_tapes_ex2/index.html">Extended Machines and Tapes v2</a>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
