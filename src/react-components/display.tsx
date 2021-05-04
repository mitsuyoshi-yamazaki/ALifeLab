import React, { CSSProperties, ReactNode } from "react"
import { defaultTheme } from "./default_theme"
import { CaptionCard } from "./caption_card"
import { Typography } from "@material-ui/core"

interface Props {
  imagePath: string
  title: string
  subtitle: string
  description: string
  backgroundColor: string
}

export class Display extends React.Component<Props> {
  public render(): ReactNode {
    const style: CSSProperties = {
      width: "100%",
      paddingTop: "90px",
      paddingBottom: "90px",
      backgroundColor: this.props.backgroundColor,
    }
    const contentStyle: CSSProperties = {
      display: "table", // horizontal center
      margin: "auto",
    }
    const imageStyle: CSSProperties = {
      width: "720px",
      maxWidth: "100%",
      borderRadius: "4px",
    }
    const captionStyle: CSSProperties = {
      display: "table", // horizontal center
      margin: "auto",
      marginTop: "5rem",
      height: "6rem",
    }

    return (
      <div style={style}>
        <div style={contentStyle}>
          <img src={this.props.imagePath} style={imageStyle} />
          <CaptionCard title={this.props.title} subtitle={this.props.subtitle} style={captionStyle}>
            <Typography paragraph={true}>
              {this.props.description}
            </Typography>
          </CaptionCard>
        </div>
      </div>
    )
  }
}
