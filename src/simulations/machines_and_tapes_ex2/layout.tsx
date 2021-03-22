import p5 from "p5"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { Breadcrumbs } from "../../react-components/breadcrumbs"
import { ScreenShotButton } from "../../react-components/screenshot_button"
import { main, getTimestamp } from "./source"

const App = () => {
  const bodyStyle: CSSProperties = {
    display: "table", // horizontal center
    margin: "auto",
    marginTop: "4rem",
    border: "1px solid rgba(212, 214, 245, 1.0)",
    borderRadius: "6px",
    overflow: "hidden", // clip border-radius
    position: "relative", // to make sure overflow works
  }
  const toolbarStyle: CSSProperties = {
  }
  const screenshotButtonStyle: CSSProperties = {
    margin: "16px",
  }

  return (
    <div>
      <Breadcrumbs/>
      <div style={bodyStyle}>
        <div id="canvas-parent"></div>
        <div style={toolbarStyle}>
          <div style={screenshotButtonStyle}>
            <ScreenShotButton getTimestamp={() => getTimestamp()} />
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
const sketch = new p5(main)
