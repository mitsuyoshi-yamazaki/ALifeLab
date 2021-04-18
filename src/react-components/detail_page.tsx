import React, { CSSProperties, ReactNode } from "react"
import { Breadcrumbs } from "./breadcrumbs"
import { defaultCanvasParentId } from "./default_canvas_parent_id"
import { ScreenShotButton } from "./screenshot_button"

interface Props {
  getTimestamp(): number
  bodyWidth?: number
  getDescription?(): string
}

export class DetailPage extends React.Component<Props> {
  static defaultContentMargin = "16px"

  public render(): ReactNode {
    const fontFamily = [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ]
    const bodyStyle: CSSProperties = {
      display: "table", // horizontal center
      margin: "auto",
      marginTop: "2rem",
      fontFamily: fontFamily.join(","),
      fontSize: "14px",
      lineHeight: "1.5",
      color: "#24292e",
    }
    const sectionStyle: CSSProperties = {
      marginTop: "2rem",
      border: "1px solid rgba(212, 214, 245, 1.0)",
      borderRadius: "6px",
      overflow: "hidden", // clip border-radius
      position: "relative", // to make sure overflow works
    }
    if (this.props.bodyWidth != null) {
      sectionStyle.maxWidth = `${this.props.bodyWidth}px`
    }
    const screenshotButtonStyle: CSSProperties = {
      margin: DetailPage.defaultContentMargin,
    }
    const additionalDescriptions = (): ReactNode | null => {
      if (this.props.children == null) {
        return null
      }
      return (
        <div style={sectionStyle}>
          {this.props.children}
        </div>
      )
    }

    return (
      <div>
        <Breadcrumbs />
        <div style={bodyStyle}>
          <div style={sectionStyle}>
            <div id={defaultCanvasParentId}></div>
            <div>
              <div style={screenshotButtonStyle}>
                <ScreenShotButton getTimestamp={() => this.props.getTimestamp()} getDescription={() => this.getDescription()} />
              </div>
            </div>
          </div>
          {additionalDescriptions()}
        </div>
      </div>
    )
  }

  private getDescription(): string | undefined {
    if (this.props.getDescription == undefined) {
      return undefined
    }

    return this.props.getDescription()
  }
}
