import { Button } from "@material-ui/core"
import React from "react"
import { ScreenshotDownloader } from "../classes/downloader"

interface Props {
  getTimestamp(): number
  getDescription?(): string
}

export class ScreenShotButton extends React.Component<Props> {
  private _screenshotDownloader = new ScreenshotDownloader()

  public render() {
    return (
      <div>
        <Button variant="contained" color="primary" onClick={() => this.saveScreenshot()}>Save Screenshot</Button>
        <a id="link" />
      </div>
    )
  }

  private saveScreenshot() {
    const t = this.props.getTimestamp()
    const description = this.props.getDescription != undefined ? this.props.getDescription() : undefined
    this._screenshotDownloader.saveScreenshot(t, description)
  }
}
