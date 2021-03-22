import React, { CSSProperties } from "react"
import { AppBar, Toolbar, Breadcrumbs as MaterialBreadcrumbs, Link, Typography } from "@material-ui/core"

interface Props {
}

export class Breadcrumbs extends React.Component<Props> {
  public render() {
    const mainPageTitle = 'Artificial Life and Generative Art Lab'  // TODO: 動的に取得
    const breadcrumbsTextColor: CSSProperties = {
      color: "white",
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <MaterialBreadcrumbs aria-label="breadcrumb" style={breadcrumbsTextColor}>
              <Link color="inherit" href="/">
                {mainPageTitle}
              </Link>
              <Typography>{document.title}</Typography>
            </MaterialBreadcrumbs>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}
