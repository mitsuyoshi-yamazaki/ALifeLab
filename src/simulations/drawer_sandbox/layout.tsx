import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage, ScreenshotButtonCustom } from "../../react-components/lab/detail_page"
import { LSystemRule } from "../drawer/lsystem_rule"
import { changeRule, getCurrentRule, main, saveCurrentState } from "./source"
import { Button } from "@material-ui/core"

const App = () => {
  const [rule, setRule] = useState<LSystemRule>(getCurrentRule())
  const [ruleValidationError, setRuleValidationError] = useState<string | null>(null)

  const ruleDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRule = event.target.value
    const result = changeRule(updatedRule)

    if (typeof result === "string") {
      setRuleValidationError(result)
    } else {
      setRule(result)
      setRuleValidationError(null)
    }
  }

  const angleDidChange = (branch: string, target: string, event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(`change ${target} in ${branch} to ${event.target.value}`)
    const newAngle = parseInt(event.target.value, 10)
    if (isNaN(newAngle)) {
      console.log(`Program error: angle is NaN (${event.target.value})`)
      return
    }

    const ruleMap = new Map(rule.mapRepresentation)
    const conditions = ruleMap.get(branch)
    if (conditions == null) {
      console.log(`Program error: wrong branch (${branch})`)
      return
    }

    const targetIndex = conditions.indexOf(target)
    if (targetIndex === -1) {
      console.log("Program error: (3)")
      return
    }
    if (targetIndex < 0) {
      console.log(`Program error: exceed index: index of ${target} (${targetIndex}) in ${conditions} (${conditions.length})`)
      return
    }

    conditions[targetIndex - 1] = newAngle

    const result = changeRule(ruleMap)

    if (typeof result === "string") {
      setRuleValidationError(result)
    } else {
      setRule(result)
      setRuleValidationError(null)
    }
  }

  const ruleElements = rule.mapRepresentation

  const screenshotButton: ScreenshotButtonCustom = {
    kind: "custom",
    button: (
      <div>
        <Button variant="contained" color="primary" onClick={() => saveCurrentState()}>Save Screenshot & Parameters</Button>
        <a id="link" />
      </div>
    )
  }

  return (
    <DetailPage screenshotButtonType={screenshotButton}>
      <div>
        <label>Rule:</label>
        <input
          type="text"
          value={rule.encoded}
          onChange={ruleDidChange}
          style={{width: "100%"}}
        />
        {ruleValidationError !== null ? <label style={{color: "red"}}>{ruleValidationError}</label> : null}
      </div>
      <div>
        {Array.from(ruleElements.entries()).map(([branch, conditions]) => (
          <div key={branch}>
            <label>{`${branch}: `}</label>
            {((): JSX.Element[] => {
              // eslint-disable-next-line @typescript-eslint/ban-types
              const angleEditors: JSX.Element[] = []
              let i = 0
              while (i < conditions.length) {
                if (conditions[i] == null) {
                  console.log("Program error: wrong index (1)")
                  return angleEditors
                }
                if (typeof conditions[i] !== "number") {
                  console.log(`Program error: expected a number but got ${typeof conditions[i]} (${conditions[i]}) in ${branch} => ${conditions}[${i}]`)
                  return angleEditors
                }

                const angle = conditions[i]
                i += 1

                if (conditions[i] == null) {
                  console.log("Program error: wrong index (2)")
                  return angleEditors
                }
                if (typeof conditions[i] !== "string") {
                  console.log(`Program error: expected a string but got ${typeof conditions[i]} (${conditions[i]}) in ${branch} => ${conditions}[${i}]`)
                  return angleEditors
                }
                const nextBranch = conditions[i] as string
                i += 1

                angleEditors.push((
                  <div key={i}>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={angle}
                      onChange={event => angleDidChange(branch, nextBranch, event)}
                    />
                    <span>{`${nextBranch}: ${angle}`}</span>
                  </div>
                ))
              }
              return angleEditors
            })()}
          </div>
        ))}
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
