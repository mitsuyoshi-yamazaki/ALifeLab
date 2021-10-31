import p5 from "p5"
import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { VanillaLSystemRule } from "../drawer/vanilla_lsystem_rule"
import { InteractiveModel } from "./interactive_model"
import { qrcodegen } from "../../../libraries/qrcodegen"
import { CodableRuleInfo, encodeRules } from "./rule_url_parameter_encoder"
import { MultiPatternModel } from "../lines_and_angles/multi_pattern_model"

type RuleDefinition = {
  readonly name: string,
  readonly rule: VanillaLSystemRule,
  readonly preferredLineCountMultiplier: number
}
type DrawerState = "add rules" | "draw" | "share"

type AutomaticDrawModel = {
  readonly modelType: "automatic"
  readonly model: MultiPatternModel
}
type InteractiveDrawModel = {
  readonly modelType: "interactive"
  state: DrawerState,
  readonly model: InteractiveModel
  readonly ruleDefinitions: RuleDefinition[]
}
type DrawModel = AutomaticDrawModel | InteractiveDrawModel

const maxNumberOfRules = 3
const colorTheme = "grayscale"

export class Drawer {
  public get t(): number {
    return this._t
  }

  private _t = 0
  private _currentModel: DrawModel
  private get _executionInterval(): number {
    switch (this._currentModel.modelType) {
    case "automatic":
      return 10
    case "interactive":
      break
    }
    switch (this._currentModel.state) {
    case "add rules":
      return 10
    case "draw":
      return 1
    case "share":
      return 1
    }
  }
  private _interfaceDrawer: InterfaceDrawer

  public constructor(
    private readonly fieldSize: Vector,
    private readonly maxLineCount: number,
    private readonly ruleDefinitions: RuleDefinition[],
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

    switch (this._currentModel.modelType) {
    case "automatic":
      break 
    case "interactive":
      if (this._currentModel.model.calculationStopped === true && this._currentModel.ruleDefinitions.length <= 0) {
        if (this._interfaceDrawer.qrCodeUrl == null) {
          this._interfaceDrawer.qrCodeUrl = this.getUrl(this._currentModel.model.codableRuleInfo)
        }
      }
      break
    }
    this._interfaceDrawer.draw(p)

    this._t += 1
  }

  public didReceiveTouch(position: Vector): void {
    if (position.x < 0 || position.x > this.fieldSize.x || position.y < 0 || position.y > this.fieldSize.y) {
      return
    }
    switch (this._currentModel.modelType) {
    case "automatic":
      // TODO: interactiveに切り替え
      return
    case "interactive":
      break
    }
    console.log(`didReceiveTouch ${this._currentModel.state}`)

    const reset = () => {
      this.reset()
      console.log("reset")
    }

    switch (this._currentModel.state) {
    case "add rules": {
      const nextRuleDefinition = this._currentModel.ruleDefinitions.shift()
      if (nextRuleDefinition == null) {
        this._currentModel.state = "draw"
        console.log("draw state (no rule)")
        break
      }
      this._currentModel.model.addRule(nextRuleDefinition.rule, position) // TODO: preferredLineCountMultiplierを入れる
      if (this._currentModel.model.numberOfRules >= maxNumberOfRules) {
        this._currentModel.state = "draw"
        console.log("draw state")
      }
      break
    }
        
    case "draw":
      break // 無視
        
    case "share":
      reset()
      break
    }
  }

  // ---- Private API ---- //
  // localhost:8080/pages/la_interactive.html?0=%5Bobject%20Map%20Iterator%5D
  private getUrl(codableRuleInfo: CodableRuleInfo[]): string {
    const encodedRules = encodeRules(codableRuleInfo)
    const host = location.href.split("/pages/")[0]
    if (host == null) {
      console.log(`ホスト判定不能 (${location.href})`)
      return "https://mitsuyoshi-yamazaki.github.io/ALifeLab/pages/gallery.html"
    }
    const parameters = new Map<string, string>([
      ["rules", encodedRules],
    ])
    const encodedParameters = Array.from(parameters.entries())
      .map(([key, value]) => {
        return `${key}=${value}`
      })
      .join("&")
    
    return `${host}/pages/la_interactive.html?${encodedParameters}`
  }

  private reset(): void {
    const definitions = [...this.ruleDefinitions]
    const selectedDefinitions: RuleDefinition[] = []
    for (let i = 0; i < maxNumberOfRules; i += 1) {
      if (definitions.length <= 0) {
        break
      }
      const randomIndex = Math.floor(random(definitions.length))
      const definition = definitions[randomIndex]
      definitions.splice(randomIndex, 1)
      selectedDefinitions.push(definition)
    }
    
    this._currentModel = {
      modelType: "interactive",
      state: "add rules",
      model: this.createModel(),
      ruleDefinitions: selectedDefinitions,
    }

    this._interfaceDrawer.qrCodeUrl = null
  }

  private createModel(): InteractiveModel {
    const lineLengthType = 0

    return new InteractiveModel(
      this.fieldSize,
      this.maxLineCount,
      lineLengthType,
      colorTheme,
    )
  }
}

class InterfaceDrawer {
  public get qrCodeUrl(): string | null {
    return this._qrCodeUrl
  }
  public set qrCodeUrl(url: string | null) {
    if (url != null) {
      console.log(`Share URL: ${url}`)
    }
    this._qrCodeUrl = url
  }

  private _currentIndicators: number
  private _qrCodeUrl: string | null = null

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

  // ---- Drawing ---- //
  public draw(p: p5): void {
    this.drawTitle(p)
    if (this.qrCodeUrl != null) {
      this.drawQrCode(p, this.qrCodeUrl, new Vector(100, 400), 200)
    }
  }

  // ---- Private ---- //
  private drawTitle(p: p5): void {
    const textSize = 60
    const x = this.fieldSize.x / 2
    const y = this.fieldSize.y - textSize - 20

    p.fill(0xFF, 0xC0)
    p.textAlign(p.CENTER)
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
