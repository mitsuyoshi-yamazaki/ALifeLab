import p5 from "p5"
import React, { CSSProperties, useEffect } from "react"
import ReactDOM from "react-dom"
import { defaultCanvasParentId } from "../../react-components/common/default_canvas_parent_id"
import { main, setRunning, toggleRunning } from "../drawer/source"

setRunning(false)

const App = () => {
  useEffect(() => {
    const handleCommand = () => {
      toggleRunning()
    }

    window.addEventListener("appCommand", handleCommand)

    // クリーンアップ
    return () => {
      window.removeEventListener("appCommand", handleCommand)
    }
  }, [])

  const canvasStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  }
  
  return (
    <div id={defaultCanvasParentId} style={canvasStyle}></div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sketch = new p5(main)
