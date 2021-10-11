import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { main } from "./source"

const App = () => {
  return (
    <div id={defaultCanvasParentId}></div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
