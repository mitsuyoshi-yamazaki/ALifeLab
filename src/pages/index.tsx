import React from "react"
import ReactDOM from "react-dom"

const App = () => {
  return (
    <div>
      <a href="/src/pages/meta_generative_art/index.html">Meta Generative Art</a>
      <br />
      <a href="/src/pages/machines_and_tapes/index.html">Extended Machines and Tapes</a>
      <br />
      <a href="/src/pages/machines_and_tapes_ex2/index.html">Extended Machines and Tapes v2</a>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
