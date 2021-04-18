import p5 from "p5"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { DetailPage } from "../../react-components/detail_page"
import { main, getTimestamp, canvasWidth } from "./source"

const App = () => {
  const descriptionStyle: CSSProperties = {
    margin: DetailPage.defaultContentMargin
  }

  return (
    <DetailPage getTimestamp={() => getTimestamp()} bodyWidth={canvasWidth}>
      <div style={descriptionStyle}>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
