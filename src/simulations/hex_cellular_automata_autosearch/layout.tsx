import { Typography } from "@material-ui/core"
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
        <Typography variant="h5">ルール自動探索</Typography>
        <hr style={borderStyle}></hr>
        <Typography variant="h6">ルールの総数</Typography>
        <p>
          2状態, 近傍半径1, 近傍セル数6<br />
          ルール総数 = 2^7 x 2^7 = 16,384 
        </p>

        <Typography variant="h6">興味深いルールの条件</Typography>
        <ul>
          <li>停止または周期状態にならないか、そうなるまでの時間が長い</li>
          <li>後述の興味深いパターンを育む余地をもつ</li>
        </ul>

        <Typography variant="h6">興味深いパターンの条件</Typography>
        <ul>
          <li>停止または周期状態にならないか、そうなるまでの時間が長い</li>
          <li>恒常性</li>
          <li>一見、ルールの制約を外れたふるまいをする</li>
          <li>構造化する</li>
        </ul>
        
        <Typography variant="h6">ルールの性質</Typography>
        # TODO: 
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
