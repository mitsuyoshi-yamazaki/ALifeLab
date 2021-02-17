import React from "react"
import ReactDOM from "react-dom"

const App = () => {
  return (
    <div>
      <a href="pages/meta_generative_art.html">Meta Generative Art</a>
      <br />
      <a href="pages/machines_and_tapes.html">Extended Machines and Tapes</a>
      <br />
      <a href="pages/machines_and_tapes_ex2.html">Extended Machines and Tapes v2</a>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
