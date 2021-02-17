import { Button } from "@material-ui/core"
import React from "react"
import { ScreenshotDownloader } from "../classes/downloader"

interface Props {
  getTimestamp(): number
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
    this._screenshotDownloader.saveScreenshot(t)
  }
}
