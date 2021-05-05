import { Typography } from "@material-ui/core"
import React, { CSSProperties, ReactNode } from "react"
import { defaultTheme } from "./default_theme"

interface Props {
  title: string
  subtitle?: string
  style?: CSSProperties
}

export class CaptionCard extends React.Component<Props> {
  public render(): ReactNode {
    const cardStyle: CSSProperties = {
      width: "30rem",
      paddingTop: "2rem",
      paddingBottom: "2rem",
      borderRadius: "4px",
      boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
      backgroundColor: defaultTheme.palette.background.default,
    }
    const cardBodyStyle: CSSProperties = {
      marginLeft: "3rem",
      paddingRight: "0px",
    }
    const borderStyle: CSSProperties = {
      backgroundColor: "#000000",
      width: "100%",
      height: "1px",
      border: "none",
    }
    const subtitleStyle: CSSProperties = {
      marginBottom: "1rem",
    }
    const bodyStyle: CSSProperties = {
      paddingRight: "3rem",
    }
    const subtitle = (): ReactNode => {
      if (this.props.subtitle != null) {
        return (
          <div style={subtitleStyle}>
            <Typography paragraph={true}>{this.props.subtitle}</Typography>
          </div>
        )
      }
      return <div/>
    }

    return (
      <div style={this.props.style ?? {}}>
        <div style={cardStyle}>
          <div style={cardBodyStyle}>
            <Typography variant="h5">{this.props.title}</Typography>
            <hr style={borderStyle} />
            {subtitle()}
            <div style={bodyStyle}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
