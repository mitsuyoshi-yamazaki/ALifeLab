import p5 from "p5"
import React, { CSSProperties, ReactNode } from "react"
import ReactDOM from "react-dom"
import { DetailPage } from "../../react-components/lab/detail_page"
import { main } from "./source"

const App = () => {
  const descriptionStyle: CSSProperties = {
    margin: DetailPage.defaultContentMargin
  }

  const descriptionList: ReactNode[] = [
    'ルール: "simulation.lsystem_rule=xxx"',
    '変更差分:"simulation.parameter_changes=xxx"',
    '変更数(パラメータ変更が一周するのにかかるstep数): "simulation.parameter_period=xxx"'
  ].map((description, index) => (<li key={`${index}`}>{description}</li>))
  // what the xxxx is the key attribute https://adhithiravi.medium.com/why-do-i-need-keys-in-react-lists-dbb522188bbb

  const example = '例："?simulation.lsystem_rule=A:-88,A,-152,A&simulation.parameter_changes=0.5,-0.5&simulation.parameter_period=720"'

  const linkOf = (filename: string): ReactNode => {
    const url = `https://github.com/mitsuyoshi-yamazaki/ALifeLab/blob/main/src/simulations/drawer/${filename}`
    return <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#0366d6" }}>{filename}</a>
  }

  return (
    <DetailPage screenshotButtonType={{ kind: "none" }}>
      <div style={descriptionStyle}>
        <ul style={{ paddingLeft: "2rem" }}>
          {descriptionList}
        </ul>
        <p>
          {example}
        </p>
        <p>
          設定可能なURLパラメータ一覧: {linkOf("constants.ts")}
        </p>
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
