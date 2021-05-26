import p5 from "p5"
import React from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"  // TODO: 詳細ページのレイアウトを変更
import { main } from "./source"

const App = () => {
  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp: (() => 0),
    getDescription: () => document.location.search
  }
  return (
    <DetailPage screenshotButtonType={screenshotButton}>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
