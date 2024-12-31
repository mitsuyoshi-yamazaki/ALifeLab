import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"
import { main, getTimestamp } from "./source"

type LocalPattern = {
  readonly imagePath: string
  readonly rule: string
}

const PatternGallery = (props: {patterns: LocalPattern[], selectingPatternIndex: number, didSelectRule: (index: number) => void}) => {
  return (
    <div style={{ overflowX: "scroll", whiteSpace: "nowrap", padding: "10px" }}>
      {props.patterns.map((pattern, index) => (
        <div
          key={index}
          onClick={() => props.didSelectRule(index)}
          style={{
            display: "inline-block",
            marginRight: "10px",
            outline: index === props.selectingPatternIndex ? "3px solid blue" : "none",
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

const stringRepresentation = (rule: string): string => {
  return rule.replace(/,/g, "").replace(/;/g, ", ").replace(/:/g, "→")
}

const App = () => {
  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp,
    getDescription: () => document.location.search
  }
  const stemPatterns: LocalPattern[] = [
    { imagePath: "../src/simulations/drawer_combination/images/001.png", rule: "A:0,A,0,Z" },
    { imagePath: "../src/simulations/drawer_combination/images/002.png", rule: "A:2,A,0,Z" },
    { imagePath: "../src/simulations/drawer_combination/images/003.png", rule: "A:4,A,0,Z" },
    { imagePath: "../src/simulations/drawer_combination/images/004.png", rule: "A:9,A,-18,A,0,Z" },
    { imagePath: "../src/simulations/drawer_combination/images/005.png", rule: "A:20,A,-21,B;B:0,A,0,Z" },
  ]
  const leafPatterns: LocalPattern[] = [
    { imagePath: "", rule: "Z:0,Y;Y:-101,Y,101,Y,5,Y" },
  ]

  const [selectedStemIndex, setSelectedStemIndex] = useState<number>(0)
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number>(0)

  const stemRule = stemPatterns[selectedStemIndex].rule
  const leafRule = leafPatterns[selectedLeafIndex].rule
  const constructedRule = stemRule + ";" + leafRule

  console.log(`Rule changed to: ${stringRepresentation(constructedRule)}`)

  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <h2>パターンを選択する</h2>
      <h3>{`幹：${stringRepresentation(stemRule)}`}</h3>
      <PatternGallery patterns={stemPatterns} selectingPatternIndex={selectedStemIndex} didSelectRule={index => setSelectedStemIndex(index)} />
      <h3>{`葉：${stringRepresentation(leafRule)}`}</h3>
      <PatternGallery patterns={leafPatterns} selectingPatternIndex={selectedLeafIndex} didSelectRule={index => setSelectedLeafIndex(index)} />
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
