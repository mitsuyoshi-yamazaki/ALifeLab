import React, { CSSProperties, ReactNode } from "react"
import { defaultTheme } from "./default_theme"
import { CaptionCard } from "./caption_card"
import { Typography } from "@material-ui/core"

interface Props {
}

export class Display extends React.Component<Props> {
  public render(): ReactNode {
    const style: CSSProperties = {
      width: "100%",
      paddingTop: "90px",
      paddingBottom: "90px",
      backgroundColor: defaultTheme.customized.background.list2,  // TODO: 行ごと切り替え
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
          <img src="./resources/lsystem_artboard.jpg" style={imageStyle} />
          <CaptionCard title="線と角度" subtitle="2021, L-System, Processing" style={captionStyle}>
          {/* TODO: title の値 */}
            <Typography paragraph={true}>
              自動生成された幾何学図形
            </Typography>
          </CaptionCard>
        </div>
      </div>
    )
  }
}
