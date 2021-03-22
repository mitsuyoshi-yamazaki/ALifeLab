import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { Breadcrumbs } from "../../react-components/breadcrumbs"
import { ScreenShotButton } from "../../react-components/screenshot_button"
import { main, getTimestamp } from "./source"

const App = () => {
  return (
    <div>
      <Breadcrumbs />
      <div id="canvas-parent"></div>
      <ScreenShotButton getTimestamp={() => getTimestamp()} getDescription={() => document.location.search}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
const sketch = new p5(main)
