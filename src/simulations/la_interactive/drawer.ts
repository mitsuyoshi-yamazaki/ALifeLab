import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { InteractiveModel } from "./interactive_model"
import { qrcodegen } from "../../../libraries/qrcodegen"

type DrawerState = "add rules" | "draw" | "fade"

const maxNumberOfRules = 3

export class Drawer {
  public get t(): number {
    return this._t
  }

  private _t = 0
  private _currentModel: {
    state: DrawerState,
    readonly model: InteractiveModel
    readonly rules: VanillaLSystemRule[]
  }
  private get _executionInterval(): number {
    switch (this._currentModel.state) {
    case "add rules":
      return 10
    case "draw":
    case "fade":
      return 1
    }
  }
  private _interfaceDrawer: InterfaceDrawer

  public constructor(
    private readonly fieldSize: Vector,
    private readonly maxLineCount: number,
    private readonly colorTheme: string,
    private readonly rules: VanillaLSystemRule[],
  ) {
    this._interfaceDrawer = new InterfaceDrawer("画面をタップ", fieldSize, maxNumberOfRules)
    this.reset()
  }

  public next(p: p5): void {
    if (this.t % this._executionInterval === 0) {
      this._currentModel.model.execute()
    }
    p.background(0x0, 0xFF)
    this._currentModel.model.draw(p, false)
    this._interfaceDrawer.draw(p)

    this._t += 1
  }

  public didReceiveTouch(position: Vector): void {
    console.log(`didReceiveTouch ${this._currentModel.state}`)
    switch (this._currentModel.state) {
    case "add rules":
      this._currentModel.model.addRule(this.randomRule(), position)
      if (this._currentModel.model.numberOfRules >= maxNumberOfRules) {
        this._currentModel.state = "draw"
        console.log("draw state")
      }
      break
        
    case "draw":
    case "fade":
      this.reset()
      console.log("reset")
      break
    }
  }

  // ---- Private API ---- //
  private reset(): void {
    this._currentModel = {
      state: "add rules",
      model: this.createModel(),
      rules: [...this.rules]
    }
  }

  private createModel(): InteractiveModel {
    const lineLengthType = 0

    return new InteractiveModel(
      this.fieldSize,
      this.maxLineCount,
      lineLengthType,
      this.colorTheme,
    )
  }

  private randomRule(): VanillaLSystemRule {
    const randomIndex = Math.floor(random(this.rules.length))
    const rule = this._currentModel.rules[randomIndex]
    this._currentModel.rules.splice(randomIndex, 1)
    return rule
  }
}

class InterfaceDrawer {
  private _currentIndicators: number
  private _url: string | null

  public constructor(
    public readonly title: string,
    public readonly fieldSize: Vector,
    public readonly numberOfIndicators: number,
  ) {
    this._currentIndicators = numberOfIndicators
  }

  public decreaseIndicator(): void {
    if (this._currentIndicators <= 0) {
      return
    }
    this._currentIndicators -= 1
  }

  public resetIndicator(): void {
    this._currentIndicators = this.numberOfIndicators
  }

  public draw(p: p5): void {
    this.drawTitle(p)
    // if (this._url != null) {
    //   this.drawQrCode(p, this._url)
    // }
    this.drawQrCode(p, "Hello, world!", new Vector(100, 400), 200)
  }

  // ---- Private ---- //
  private drawTitle(p: p5): void {
    const textSize = 100
    const x = 0
    const y = 0 + textSize

    p.fill(0xFF, 0xE0)
    p.textStyle(p.NORMAL)
    p.textSize(textSize)
    p.text(this.title, x, y)
  }

  // private drawIndicators(p: p5): void {

  // }

  private drawQrCode(p: p5, text: string, position: Vector, size: number): void {
    // https://github.com/nayuki/QR-Code-generator/blob/master/typescript-javascript/qrcodegen.ts
    const QRC = qrcodegen.QrCode
    const qr = QRC.encodeText(text, QRC.Ecc.MEDIUM)

    const cellSize = size / qr.size

    p.fill(0x0)
    p.noStroke()
    p.rect(position.x, position.y, size, size)
    p.fill(0xFF)

    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        // console.log(`qr ${x},${y}: ${qr.getModule(x, y)}`)
        const cell = qr.getModule(x, y)
        if (cell !== true) {
          continue
        }
        p.rect(position.x + x * cellSize, position.y + y * cellSize, cellSize, cellSize)
      }
    }
  }
}
