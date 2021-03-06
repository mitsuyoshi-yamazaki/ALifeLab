import React, { CSSProperties, ReactNode } from "react"
import { AppBar, Toolbar, Breadcrumbs as MaterialBreadcrumbs, Link, Typography } from "@material-ui/core"

interface Props {
}

export class Breadcrumbs extends React.Component<Props> {
  public render(): ReactNode {
    const mainPageTitle = "Gallery"  // TODO: 動的に取得
    const breadcrumbsTextColor: CSSProperties = {
      color: "white",
    }
    const link = "gallery.html"

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <MaterialBreadcrumbs aria-label="breadcrumb" style={breadcrumbsTextColor}>
              <Link color="inherit" href={link}>
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
