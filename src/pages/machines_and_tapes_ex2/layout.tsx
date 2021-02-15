import React from "react"
import ReactDOM from "react-dom"
import { ScreenShotButton } from "../../react-components/screenshot_button"
import { getTimestamp } from "./source"

const App = () => {
  return (
    <div>
      <div id="canvas-parent"></div>
      <ScreenShotButton getTimestamp={() => getTimestamp()}/>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
