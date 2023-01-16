import p5 from "p5"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"
import { main, getTimestamp, canvasWidth } from "./source"

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
    <DetailPage bodyWidth={canvasWidth} screenshotButtonType={screenshotButton}>
      <div style={descriptionStyle}>
        <h2>{document.title}</h2>
        <hr style={borderStyle}></hr>
        <p>
          このシミュレーションでは、各セルは{'"'}質量{'"'}のメタファーである数値をもっており、{'"'}質量{'"'}の移動による増減の収支を合わせることにより総量を常に一定に保つ、質量の保存 (mass conservation) をセルオートマトンで実現しています。<br />
          ここでの{'"'}質量{'"'}は、セルに格納された値が大きいセルから小さいセルへと移動するよう設定しているため、この系はセルオートマトンによる流体シミュレーションとみなすことができます。<br />
        </p>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
