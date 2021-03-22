import React from "react"
import ReactDOMServer from "react-dom/server"

const launchTime = Math.floor((new Date()).getTime() / 1000)

class Downloader {
  protected readonly linkElement: HTMLElement = (() => {
    const link = document.createElement("a")
    link.id = "downloader_link"

    return link
  })()

  protected createFilename(prefix: string, t: number, extension: string, description?: string): string {
    const timestamp = Math.floor(t)
      .toString()
      .padStart(8, "0")
    const suffix = description == undefined ? "" : `_${description}`

    return `${launchTime}_${timestamp}${suffix}.${extension}`
  }
}

export class ScreenshotDownloader extends Downloader {
  private _canvasElement: HTMLCanvasElement

  public constructor() {
    super()
  }

  public screenshotFilename(t: number, description?: string): string {
    return this.createFilename("", t, "png", description)
  }

  public saveScreenshot(t: number, description?: string): string {
    if (this._canvasElement == undefined) {
      this._canvasElement = this.getCanvas()
    }

    const filename = this.screenshotFilename(t, description)
    this.linkElement.setAttribute("download", filename)
    this.linkElement.setAttribute("href", this._canvasElement.toDataURL("image/png")
      .replace("image/png", "image/octet-stream"))
    this.linkElement.click()
    console.log(`Saved: ${filename}`)

    return filename
  }

  private getCanvas(): HTMLCanvasElement {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement
    if (canvas == undefined) {
      throw new Error("Canvas element not found")
    }

    return canvas
  }
}

export interface StringElementConvertible {
  stringElements(): React.ReactNode
}

export class ParameterDownloader<Parameters extends StringElementConvertible> extends Downloader {
  private screenshotDownloader: ScreenshotDownloader

  public constructor() {
    super()
    this.screenshotDownloader = new ScreenshotDownloader()
  }

  public saveParameters(t: number, parameters: Parameters): string {
    const element = parameters.stringElements()
    const html = ReactDOMServer.renderToStaticMarkup((
      <html>
        <head></head>
        <body>
          <img src={`${this.screenshotDownloader.screenshotFilename(t)}`} />
          {element}
        </body>
      </html>
    ))

    const data = `data:text/html;charset=utf-8,${html}`
    const filename = this.createFilename("parameter_", t, "html")
    this.linkElement.setAttribute("href", data)
    this.linkElement.setAttribute("download", filename)
    this.linkElement.click()
    console.log(`Saved: ${filename}`)

    let intervalId: number | undefined
    const delayed = () => { // Downloadin multiple files in exact same timing not working
      this.screenshotDownloader.saveScreenshot(t)
      clearInterval(intervalId)
    }
    intervalId = setInterval(delayed, 300)

    return filename
  }
}
