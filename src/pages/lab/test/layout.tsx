import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider } from "@material-ui/styles"
import { defaultTheme } from "../../../react-components/default_theme"

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
