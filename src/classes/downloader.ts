const launchTime = Math.floor((new Date()).getTime() / 1000)

class Downloader {
  private static readonly linkId = "downloader_link"

  protected static getLink(): HTMLElement {
    return document.getElementById(Downloader.linkId) ?? Downloader.createLink()
  }

  protected static createFilename(prefix: string, t: number, extension: string): string {
    const timestamp = Math.floor(t)
      .toString()
      .padStart(8, "0")

    return `${launchTime}__${timestamp}.${extension}`
  }

  private static createLink(): HTMLElement {
    const link = document.createElement("a")
    link.id = Downloader.linkId
    const bodies = document.getElementsByTagName("body")
    const body = bodies[0]
    if (body == undefined) {
      throw Error("<body> element not found")
    }

    return link
  }
}

export class Screenshot extends Downloader {
  public static saveScreenshot(t: number) {
    const link = Screenshot.getLink()
    const canvas = Screenshot.getCanvas()
    if (link == undefined || canvas == undefined) {
      console.log(`link or canvas not found: ${String(link)}, ${String(canvas)}`)

      return
    }

    const filename = Screenshot.createFilename("", t, "png")
    link.setAttribute("download", filename)
    link.setAttribute("href", canvas.toDataURL("image/png")
      .replace("image/png", "image/octet-stream"))
    link.click()
    console.log(`Saved: ${filename}`)
  }

  private static getCanvas(): HTMLCanvasElement | null {
    return document.getElementById("canvas") as HTMLCanvasElement
  }
}
