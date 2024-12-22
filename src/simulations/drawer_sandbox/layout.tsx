import p5 from "p5"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { DetailPage } from "../../react-components/lab/detail_page"
import { changeRule, main } from "./source"

const App = () => {
  const [rule, setRule] = useState("A:-88,A,-152,A")

  const ruleDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedRule = event.target.value
    setRule(updatedRule)
    changeRule(updatedRule)
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
      </div>
    </DetailPage>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
