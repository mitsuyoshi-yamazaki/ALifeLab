import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage } from "../../react-components/lab/detail_page"
import { changeRule, main } from "./source"

const App = () => {
  const [rule, setRule] = useState("A:-88,A,-152,A")
  const [ruleValidationError, setRuleValidationError] = useState<string | null>(null)

  const ruleDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRule = event.target.value
    setRule(updatedRule)
    const result = changeRule(updatedRule)
    if (result === "ok") {
      setRuleValidationError(null)
    } else {
      setRuleValidationError(result)
    }
  }

  return (
    <DetailPage screenshotButtonType={{ kind: "none" }}>
      <div>
        <label>Rule:</label>
        <input
          type="text"
          value={rule}
          onChange={ruleDidChange}
          style={{width: "100%"}}
        />
        {ruleValidationError !== null ? <label style={{color: "red"}}>{ruleValidationError}</label> : null}
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
