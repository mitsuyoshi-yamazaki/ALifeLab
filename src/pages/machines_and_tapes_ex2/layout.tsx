import p5 from "p5"
import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { AppBar, Toolbar, Breadcrumbs, Link, Typography } from "@material-ui/core"
import { ScreenShotButton } from "../../react-components/screenshot_button"
import { main, getTimestamp } from "./source"

const App = () => {
  const mainPageTitle = 'Artificial Life and Generative Art Lab'  // TODO: 動的に取得
  const breadcrumbsTextColor: CSSProperties = {
    color: "white",
  }
  const bodyStyle: CSSProperties = {
    display: "table", // horizontal center
    margin: "auto",
    marginTop: "4rem",
    border: "1px solid rgba(212, 214, 245, 1.0)",
    borderRadius: "6px",
    overflow: "hidden", // clip border-radius
    position: "relative", // to make sure overflow works
  }
  const toolbarStyle: CSSProperties = {
  }
  const screenshotButtonStyle: CSSProperties = {
    margin: "16px",
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Breadcrumbs aria-label="breadcrumb" style={breadcrumbsTextColor}>
            <Link color="inherit" href="/">
              {mainPageTitle}
            </Link>
            <Typography>{document.title}</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <div style={bodyStyle}>
        <div id="canvas-parent"></div>
        <div style={toolbarStyle}>
          <div style={screenshotButtonStyle}>
            <ScreenShotButton getTimestamp={() => getTimestamp()} />
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
const sketch = new p5(main)
