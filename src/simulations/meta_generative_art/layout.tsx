import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/detail_page"
import { main, getTimestamp } from "./source"

const App = () => {
  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp,
  }
  return (
    <DetailPage screenshotButtonType={screenshotButton}>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
