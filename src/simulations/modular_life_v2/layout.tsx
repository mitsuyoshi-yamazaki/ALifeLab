import p5 from "p5"
import React, { useEffect, useState } from "react"
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
  showEnergy: makeInputState("1", false),
  showHeat: makeInputState("2", false),
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
    console.log(`${event} => ${newValue}`)
    setCurrentState(event, newValue)
  })

  return (
    <DetailPage screenshotButtonType={screenshotButton}>
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
