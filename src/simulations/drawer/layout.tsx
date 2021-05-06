import p5 from "p5"
import { Button } from "@material-ui/core"
import React, { CSSProperties, ReactNode } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonCustom } from "../../react-components/lab/detail_page"
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
  const linkOf = (filename: string): ReactNode => {
    const url = `https://github.com/mitsuyoshi-yamazaki/ALifeLab/blob/main/src/simulations/drawer/${filename}`
    return <a href={url} target="_blank" rel="noopener noreferrer" style={{color: "#0366d6"}}>{filename}</a>
  }

  return (
    <DetailPage bodyWidth={canvasWidth} screenshotButtonType={screenshotButton}>
      <div style={descriptionStyle}>
        <h2>{document.title}</h2>
        <hr style={borderStyle}></hr>
        <p>
          L-Systemで幾何学図形を描画します。<br />
          描画する線分に衝突判定を入れたことで、交差する線なしに紙面を埋める図形を描画します。<br />
          URLパラメータに{'"'}system.run=1{'"'}を設定することでランダムな図形を自動探索します。<br />
          また{'"'}system.auto_download=1{'"'}を設定することで探索した画像を自動的に保存します。<br />
        </p>
        <ul style={{ paddingLeft: "2rem" }}>
          <li>リロードの度に表示される図形のルール一覧: {linkOf("rule_examples.ts")}</li>
          <li>設定可能なURLパラメータ一覧: {linkOf("constants.ts")}</li>
        </ul>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
