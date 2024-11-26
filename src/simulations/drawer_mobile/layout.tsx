import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { DetailPage } from "../../react-components/lab/detail_page"
import { main, canvasWidth } from "../drawer/source"

const App = () => {
  return (
    <DetailPage bodyWidth={canvasWidth} screenshotButtonType={{ kind: "none" }} />
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
