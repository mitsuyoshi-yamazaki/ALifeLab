import p5 from "p5"
import { Button } from "@material-ui/core"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonCustom } from "../../react-components/detail_page"
import { main, saveCurrentState, canvasWidth } from "./source"

const App = () => {
  const descriptionStyle: CSSProperties = {
    margin: DetailPage.defaultContentMargin
  }
  const borderStyle: CSSProperties = {
    backgroundColor: "rgba(212, 214, 245, 1.0)",
    width: "100%",
    height: "1px",
    border: "none",
  }
  const screenshotButton: ScreenshotButtonCustom = {
    kind: "custom",
    button: (
      <div>
        <Button variant="contained" color="primary" onClick={() => saveCurrentState()}>Save Screenshot & Parameters</Button>
        <a id="link" />
      </div>
    )
  }

  return (
    <DetailPage bodyWidth={canvasWidth} screenshotButtonType={screenshotButton}>
      <div style={descriptionStyle}>
        <h2>{document.title}</h2>
        <hr style={borderStyle}></hr>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
