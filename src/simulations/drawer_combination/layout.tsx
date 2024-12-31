import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonCustom } from "../../react-components/lab/detail_page"
import { changeRule, main, saveCurrentState } from "../drawer_sandbox/source"
import { Button } from "@material-ui/core"

type LocalPattern = {
  readonly imagePath: string
  readonly defaultAngle: number
  readonly ruleConstructor: (angleInput: number) => string
}

const AngleInput = (props: { angle: number, didChangeAngle: (angle: number) => void }) => {
  const didChangeAngle = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newAngle = parseInt(event.target.value, 10)
    if (isNaN(newAngle)) {
      console.log(`Program error: angle is NaN (${event.target.value})`)
      return
    }
    props.didChangeAngle(newAngle)
  }

  return (<input
    type="range"
    min="-180"
    max="180"
    value={props.angle}
    onChange={event => didChangeAngle(event)}
  />)
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
  const screenshotButton: ScreenshotButtonCustom = {
    kind: "custom",
    button: (
      <div>
        <Button variant="contained" color="primary" onClick={() => saveCurrentState()}>Save Screenshot & Parameters</Button>
        <a id="link" />
      </div>
    )
  }
  
  const stemPatterns: LocalPattern[] = [
    { imagePath: "", defaultAngle: 0, ruleConstructor: () => "A:0,Z" },
    { imagePath: "../src/simulations/drawer_combination/images/001.png", defaultAngle: 0, ruleConstructor: angle => `A:0,B;B:${angle},C;C:0,A,0,Z` },
  ]
  const leafPatterns: LocalPattern[] = [
    { imagePath: "", defaultAngle: 0, ruleConstructor: () => "Z:." },
    { imagePath: "", defaultAngle: 5, ruleConstructor: angle => `Z:0,Y;Y:-101,X;X:0,X,${angle},X` },
  ]

  const [selectedStemIndex, setSelectedStemIndex] = useState<number>(0)
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number>(0)

  const stemPattern = stemPatterns[selectedStemIndex]
  const leafPattern = leafPatterns[selectedLeafIndex]

  const [stemAngle, setStemAngle] = useState<number>(stemPattern.defaultAngle)
  const [leafAngle, setLeafAngle] = useState<number>(leafPattern.defaultAngle)

  const stemRule = stemPattern.ruleConstructor(stemAngle)
  const leafRule = leafPattern.ruleConstructor(leafAngle)
  const constructedRule = stemRule + ";" + leafRule

  console.log(`Rule changed to: ${stringRepresentation(constructedRule)}`)
  changeRule(constructedRule)
  
  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <h2>パターンを選択する</h2>
      <h3>{`幹：${stringRepresentation(stemRule)}`}</h3>
      <PatternGallery patterns={stemPatterns} selectingPatternIndex={selectedStemIndex} didSelectRule={index => setSelectedStemIndex(index)} />
      <AngleInput angle={stemAngle} didChangeAngle={setStemAngle} />
      <hr />
      <h3>{`葉：${stringRepresentation(leafRule)}`}</h3>
      <PatternGallery patterns={leafPatterns} selectingPatternIndex={selectedLeafIndex} didSelectRule={index => setSelectedLeafIndex(index)} />
      <AngleInput angle={leafAngle} didChangeAngle={setLeafAngle} />
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
