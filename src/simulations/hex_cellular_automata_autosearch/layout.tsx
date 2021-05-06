import p5 from "p5"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"
import { main, getTimestamp } from "./source"

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

  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp,
    getDescription: () => document.location.search
  }
  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <div style={descriptionStyle}>
        <h2>{document.title}</h2>
        <hr style={borderStyle}></hr>
        <p>
          セルオートマトンのルール自動探索<br />
          
        </p>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
