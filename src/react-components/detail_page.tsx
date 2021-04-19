import React, { CSSProperties, ReactNode } from "react"
import { Breadcrumbs } from "./breadcrumbs"
import { defaultCanvasParentId } from "./default_canvas_parent_id"
import { ScreenShotButton } from "./screenshot_button"

export interface ScreenshotButtonNone { kind: "none" }
export interface ScreenshotButtonDefault { kind: "default", getTimestamp(): number, getDescription?(): string }
export interface ScreenshotButtonCustom { kind: "custom", button: ReactNode }
type ScreenshotButtonType = ScreenshotButtonNone | ScreenshotButtonDefault | ScreenshotButtonCustom

interface Props {
  bodyWidth?: number
  screenshotButtonType: ScreenshotButtonType
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
    const screenshotButton = (): ReactNode => {
      const screenshotButtonType = this.props.screenshotButtonType
      switch (screenshotButtonType.kind) {
      case "none":
        return <div></div>
        
      case "default": {
        const getDescription = (): string | undefined => {
          if (screenshotButtonType.getDescription == undefined) {
            return undefined
          }
          return screenshotButtonType.getDescription()
        }
        return (
          <div style={screenshotButtonStyle}>
            <ScreenShotButton getTimestamp={() => screenshotButtonType.getTimestamp()} getDescription={() => getDescription()} />
          </div>
        )
      }

      case "custom":
        return (
          <div style={screenshotButtonStyle}>
            {screenshotButtonType.button}
          </div>
        )
      }
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
              {screenshotButton()}
            </div>
          </div>
          {additionalDescriptions()}
        </div>
      </div>
    )
  }
}
