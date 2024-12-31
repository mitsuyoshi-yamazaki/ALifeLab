import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"
import { main, getTimestamp } from "./source"

type LocalPattern = {
  readonly imagePath: string
  readonly rule: string
}

const PatternGallery = (props: {patterns: LocalPattern[], didSelectRule: (rule: string) => void}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)

  const didSelectRule = (index: number, pattern: LocalPattern) => {
    console.log(`${index}, selected ${pattern.rule}`)

    setSelectedImageIndex(index)
    props.didSelectRule(pattern.rule)
  }

  return (
    <div style={{ overflowX: "scroll", whiteSpace: "nowrap", padding: "10px" }}>
      {props.patterns.map((pattern, index) => (
        <div
          key={index}
          onClick={() => didSelectRule(index, pattern)}
          style={{
            display: "inline-block",
            marginRight: "10px",
            outline: selectedImageIndex === index ? "3px solid blue" : "none",
            cursor: "pointer",
          }}
        >
          <img
            src={pattern.imagePath}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp,
    getDescription: () => document.location.search
  }
  const patterns: LocalPattern[] = [
    { imagePath: "", rule: "A:2A" },
    { imagePath: "", rule: "A:10A" },
    { imagePath: "", rule: "A:20A" },
    { imagePath: "", rule: "A:30A" },
    { imagePath: "", rule: "A:40A" },
  ]

  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <PatternGallery patterns={patterns} didSelectRule={rule => console.log(`selected ${rule}`)} />
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
