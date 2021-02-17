import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import { makeStyles, AppBar, Toolbar, Breadcrumbs, Card, CardActionArea, CardContent, Link, Typography } from "@material-ui/core"
import { LinkCard } from "../react-components/link_card"

const App = () => {
  const breadcrumbsTextColor: CSSProperties = {
    color: "white",
  }
  const bodyStyle: CSSProperties = {
    display: "table",
    marginTop: "4rem",
    marginLeft: "4rem",
    marginRight: "4rem",
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Breadcrumbs aria-label="breadcrumb" style={breadcrumbsTextColor}>
            <Typography>{document.title}</Typography>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <div style={bodyStyle}>
        <LinkCard title="Meta Generative Art" link="pages/meta_generative_art.html" />
        <LinkCard title="Extended Machines and Tapes" link="pages/machines_and_tapes.html" />
        <LinkCard title="Extended Machines and Tapes v2" link="pages/machines_and_tapes_ex2.html" />
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
