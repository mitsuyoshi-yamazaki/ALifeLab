import React, { CSSProperties, ReactNode } from "react"
import ReactDOM from "react-dom"
import { Link, ThemeProvider } from "@material-ui/core"
import { defaultTheme } from "../react-components/common/default_theme"

const App = () => {
  const createLink = (title: string, link: string): ReactNode => {
    const linkStyle: CSSProperties = {
      display: "table",
      margin: "auto",
      paddingTop: "1rem",
    }
    return (
      <div style={linkStyle}>
        <Link variant="body1" href={link}>{title}</Link>
      </div>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <div>
        {createLink("Gallery", "/pages/gallery.html")}
        {createLink("Lab", "/pages/lab.html")}
      </div>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
