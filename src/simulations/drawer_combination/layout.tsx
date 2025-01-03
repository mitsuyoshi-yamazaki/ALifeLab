import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonCustom } from "../../react-components/lab/detail_page"
import { changeRule, main, saveCurrentState } from "../drawer_sandbox/source"
import { Button } from "@material-ui/core"

type LocalPattern = {
  readonly imagePath: string
  angle: number
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

const stemPatterns: LocalPattern[] = [
  { imagePath: "", angle: 0, ruleConstructor: () => "A:0,Z" },
  { imagePath: "../src/simulations/drawer_combination/images/001.png", angle: 0, ruleConstructor: angle => `A:0,B;B:${angle},C;C:0,A,0,Z` },
  { imagePath: "../src/simulations/drawer_combination/images/003.png", angle: 0, ruleConstructor: angle => `A:0,B;B:${angle},C,${-2 * angle},C;C:0,A,0,Z` },
  { imagePath: "../src/simulations/drawer_combination/images/003.png", angle: 2, ruleConstructor: angle => `A:0,B;B:0,C;C:${angle},A,${-2 * angle},A,0,Z` },
  { imagePath: "../src/simulations/drawer_combination/images/003.png", angle: 2, ruleConstructor: angle => `A:0,B;B:${angle},C,${-2 * angle},C;C:0,D;D:0,E;E:A,0,Z` },
]

const leafPatterns: LocalPattern[] = [
  { imagePath: "", angle: 0, ruleConstructor: () => "Z:." },
  { imagePath: "", angle: -6, ruleConstructor: angle => `Z:0,Y;Y:-101,X;X:0,X,${angle},X` },
  { imagePath: "", angle: 66, ruleConstructor: angle => `Z:${angle},Z,${186 - angle},Y;Y:174,Z` }, // 元：A:66,A,120,B;B:174,A // 折り返し以外の線
  { imagePath: "", angle: 6, ruleConstructor: angle => `Z:${60 + angle},Z,120,Y;Y:${180 - angle},Z` }, // 元：A:66,A,120,B;B:174,A // 折り返し角度の変更
]


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

  const [selectedStemIndex, setSelectedStemIndex] = useState<number>(0)
  const [selectedLeafIndex, setSelectedLeafIndex] = useState<number>(0)

  const stemPattern = stemPatterns[selectedStemIndex]
  const leafPattern = leafPatterns[selectedLeafIndex]

  const [stemAngle, setStemAngle] = useState<number>(stemPattern.angle)
  const [leafAngle, setLeafAngle] = useState<number>(leafPattern.angle)

  const stemRule = stemPattern.ruleConstructor(stemAngle)
  const leafRule = leafPattern.ruleConstructor(leafAngle)
  const constructedRule = stemRule + ";" + leafRule

  console.log(`Rule changed to: ${stringRepresentation(constructedRule)}`)
  changeRule(constructedRule)

  const changeStem = (index: number): void => {
    stemPattern.angle = stemAngle
    setSelectedStemIndex(index)
    setStemAngle(stemPatterns[index].angle)

    console.log(`[S] current: ${stemAngle} => index: ${index}, ${stemPatterns[index].angle}; ${stemPattern === stemPatterns[selectedStemIndex]}, ${stemPatterns[selectedStemIndex].angle}`)
  }
  const changeLeaf = (index: number): void => {
    leafPattern.angle = stemAngle
    setSelectedLeafIndex(index)
    setLeafAngle(leafPatterns[index].angle)

    console.log(`[L] current: ${leafAngle} => index: ${index}, ${leafPatterns[index].angle}`)
  }
  
  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <h2>パターンを選択する</h2>
      <h3>{`幹：${stringRepresentation(stemRule)}`}</h3>
      <PatternGallery patterns={stemPatterns} selectingPatternIndex={selectedStemIndex} didSelectRule={index => changeStem(index)} />
      <AngleInput angle={stemAngle} didChangeAngle={setStemAngle} />
      <hr />
      <h3>{`葉：${stringRepresentation(leafRule)}`}</h3>
      <PatternGallery patterns={leafPatterns} selectingPatternIndex={selectedLeafIndex} didSelectRule={index => changeLeaf(index)} />
      <AngleInput angle={leafAngle} didChangeAngle={setLeafAngle} />
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
