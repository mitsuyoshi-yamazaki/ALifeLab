import { ScreenshotDownloader, JSONDownloader } from "../../classes/downloader"
import { RuleDescription } from "./model"

export class Downloader {
  private _screenshotDownloader = new ScreenshotDownloader()
  private _JSONDownloader = new JSONDownloader()
  private _saved = 0
  private _saveInteral = 4000  // ms

  public get isSaving(): boolean {
    return (Date.now() - this._saved) < this._saveInteral
  }

  public save(filename: string, rules: RuleDescription[], globalTimestamp: number, modelTimeStamp: number) {
    if (this.isSaving === true) {
      console.log(`Attempt saving ${filename} while previous save is in progress (t: ${globalTimestamp})`)

      return
    }
    this._saved = Date.now()
    this._screenshotDownloader.saveScreenshot(globalTimestamp, filename)

    let intervalId: number | undefined = undefined
    const json = {
      t: modelTimeStamp,
      rules,
      url_parameters: document.location.search,
    }
    const delayed = () => { // Downloading multiple files in exact same timing not working
      this._JSONDownloader.saveJson(json, filename, globalTimestamp)
      clearInterval(intervalId)
    }
    intervalId = setInterval(delayed, 300)
  }
}
