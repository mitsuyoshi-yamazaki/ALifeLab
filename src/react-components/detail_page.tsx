import React, { CSSProperties, ReactNode } from "react"
import { Breadcrumbs } from "./breadcrumbs"
import { defaultCanvasParentId } from "./default_canvas_parent_id"
import { ScreenShotButton } from "./screenshot_button"

interface Props {
  getTimestamp(): number
  getDescription?(): string
}

export class DetailPage extends React.Component<Props> {
  public render(): ReactNode {
    const bodyStyle: CSSProperties = {
      display: "table", // horizontal center
      margin: "auto",
      marginTop: "4rem",
      border: "1px solid rgba(212, 214, 245, 1.0)",
      borderRadius: "6px",
      overflow: "hidden", // clip border-radius
      position: "relative", // to make sure overflow works
    }
    const screenshotButtonStyle: CSSProperties = {
      margin: "16px",
    }
    const additionalDescriptions = (): ReactNode | null => {
      if (this.props.children == null) {
        return null
      }
      return (
        <div style={bodyStyle}>
          {this.props.children}
        </div>
      )
    }

    return (
      <div>
        <Breadcrumbs />
        <div style={bodyStyle}>
          <div id={defaultCanvasParentId}></div>
          <div>
            <div style={screenshotButtonStyle}>
              <ScreenShotButton getTimestamp={() => this.props.getTimestamp()} getDescription={() => this.getDescription()} />
            </div>
          </div>
        </div>
        {additionalDescriptions()}
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
