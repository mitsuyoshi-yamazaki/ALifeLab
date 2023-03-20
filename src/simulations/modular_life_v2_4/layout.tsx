import p5 from "p5"
import React, { CSSProperties, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { strictEntries } from "../../classes/utilities"
import { DetailPage, ScreenshotButtonDefault } from "../../react-components/lab/detail_page"
import { main } from "./source"

const processing = main()

type KeyInputState = {
  readonly key: string
  value: boolean
}
const makeInputState = (key: string, value: boolean): KeyInputState => ({key, value})
const keyInputStates = {
  running: makeInputState("0", true),
  showEnergy: makeInputState("1", true),
  showHeat: makeInputState("2", false),
  showSubstance: makeInputState("3", false),
}

strictEntries(keyInputStates).forEach(([event, inputState]) => {
  setCurrentState(event, inputState.value)
})

const App = () => {
  const screenshotButton: ScreenshotButtonDefault = {
    kind: "default",
    getTimestamp: processing.getTimestamp,
    getDescription: () => document.location.search
  }

  strictEntries(keyInputStates).forEach(([event, inputState]) => {
    const newValue = toggleKeyPress(inputState.key, inputState.value)
    if (newValue === inputState.value) {
      return
    }

    keyInputStates[event].value = newValue
    setCurrentState(event, newValue)
  })

  const descriptionStyle: CSSProperties = {
    margin: DetailPage.defaultContentMargin
  }
  const borderStyle: CSSProperties = {
    backgroundColor: "rgba(212, 214, 245, 1.0)",
    width: "100%",
    height: "1px",
    border: "none",
  }

  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <div style={descriptionStyle}>
        <h2>{document.title}</h2>
        <hr style={borderStyle}></hr>
        キー操作：
        <ul style={{ paddingLeft: "2rem" }}>
          <li>0: 停止/再開</li>
          <li>1: エネルギー表示/非表示</li>
          <li>2: 熱表示/非表示</li>
          <li>3: 物質表示/非表示</li>
        </ul>
      </div>
    </DetailPage>
  )
}

function setCurrentState(event: keyof typeof keyInputStates, value: boolean): void {
  switch (event) {
  case "running":
    processing.eventHandler({
      case: "run",
      running: value,
    })
    break
  case "showEnergy":
    processing.eventHandler({
      case: "show energy",
      show: value,
    })
    break
  case "showHeat":
    processing.eventHandler({
      case: "show heat",
      show: value,
    })
    break
  case "showSubstance":
    processing.eventHandler({
      case: "show substance",
      show: value,
    })
    break
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = event
    break
  }
  }
}

const toggleKeyPress = (targetKey: string, initialValue: boolean): boolean => {
  const [keyPressed, setKeyPressed] = useState<boolean>(initialValue)
  let currentValue = initialValue

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      currentValue = !currentValue
      setKeyPressed(currentValue)
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", upHandler)
    return () => {
      window.removeEventListener("keyup", upHandler)
    }
  }, [])
  return keyPressed
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(processing.p)
