import React, { CSSProperties, ReactNode } from "react"
import { CaptionCard } from "./caption_card"
import { Typography } from "@material-ui/core"

interface Props {
  imagePath: string
  title: string
  subtitle: string
  description: string
  backgroundColor: string
  link?: string
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
      boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
    }
    const captionStyle: CSSProperties = {
      display: "table", // horizontal center
      margin: "auto",
      marginTop: "5rem",
      height: "6rem",
    }
    const link = (): ReactNode => {
      if (this.props.link == null) {
        return <div/>
      }
      const linkStyle: CSSProperties = {
        display: "block",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",
      }
      return (
        <a href={this.props.link} style={linkStyle} />
      )
    }

    return (
      <div style={style}>
        <div style={contentStyle}>
          <div style={{position: "relative"}}>
            <img src={this.props.imagePath} style={imageStyle} />
            {link()}
          </div>
          <div style={{ position: "relative" }}>
            <CaptionCard title={this.props.title} subtitle={this.props.subtitle} style={captionStyle}>
              <Typography paragraph={true}>
                {this.props.description}
              </Typography>
            </CaptionCard>
            {link()}
          </div>
        </div>
      </div>
    )
  }
}
