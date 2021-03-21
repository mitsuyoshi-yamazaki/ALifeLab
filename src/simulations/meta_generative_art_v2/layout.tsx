import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { main } from "./source"

const App = () => {
  return (
    <div>
      <div id="canvas-parent"></div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
const sketch = new p5(main)
