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

type ExampleRuleArgument = {
  readonly ruleType: "examples"
  readonly ruleDefinitions: RuleDefinition[]
}
type FixedRuleArgument = {
  readonly ruleType: "fixed"
  readonly codableRules: CodableRuleInfo[]
}
type RuleArgument = ExampleRuleArgument | FixedRuleArgument

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
    private readonly ruleArgument: RuleArgument,
    private readonly showIndicators: boolean,
  ) {
    this._interfaceDrawer = new InterfaceDrawer("画面をタップ", fieldSize, maxNumberOfRules)

    switch (ruleArgument.ruleType) {
    case "examples":
      this.reset()
      break
    case "fixed":
      this._currentModel = {  // TODO: おかしな状態を排除する
        modelType: "interactive",
        state: "draw",
        model: this.createModel(),
        ruleDefinitions: [],
      }
      ruleArgument.codableRules.forEach(codableRule => this.addRule(codableRule.rule, codableRule.position))
      break
    }
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
        if (this._currentModel.state !== "share") {
          this._currentModel.state = "share"
          console.log("Drawing finished")
        }

        // TODO: シェア機能を実装
        // if (this._interfaceDrawer.qrCodeUrl == null) {
        //   const codableRuleInfo = this._currentModel.model.codableRuleInfo
        //   const qrCodePosition = ((): Vector => {
        //     return new Vector(100, 100)  // TODO:
        //   })()
        //   this._interfaceDrawer.setQrCodeInfo({
        //     url: this.getUrl(codableRuleInfo),
        //     position: qrCodePosition,
        //   })
        // }
      }
      break
    }

    if (this.showIndicators === true) {
      this._interfaceDrawer.draw(p)
    }

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
      this.addRule(nextRuleDefinition.rule, position) // TODO: preferredLineCountMultiplierを入れる
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

  private addRule(rule: VanillaLSystemRule, position: Vector): void {
    this._currentModel.model.addRule(rule, position) // TODO: preferredLineCountMultiplierを入れる
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
    switch (this.ruleArgument.ruleType) {
    case "examples":
      break
    case "fixed":
      console.log("不正な状態")
      return
    }

    const definitions = [...this.ruleArgument.ruleDefinitions]
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

    this._interfaceDrawer.setQrCodeInfo(null)
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

type QRCodeInfo = {
  readonly url: string
  readonly position: Vector
}

class InterfaceDrawer {
  public get qrCodeUrl(): string | null {
    return this._qrCodeInfo?.url ?? null
  }

  private _currentIndicators: number
  private _qrCodeInfo: QRCodeInfo | null = null

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

  public setQrCodeInfo(info: QRCodeInfo | null): void {
    if (info != null) {
      console.log(`Share URL: ${info.url}`)
    }
    this._qrCodeInfo = info
  }

  // ---- Drawing ---- //
  public draw(p: p5): void {
    this.drawTitle(p)
    if (this._qrCodeInfo != null) {
      this.drawQrCode(p, this._qrCodeInfo.url, this._qrCodeInfo.position, 200)
    }
  }

  // ---- Private ---- //
  private drawTitle(p: p5): void {
    const textSize = 60
    const x = this.fieldSize.x / 2
    const y = this.fieldSize.y - textSize - 10

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

    const { qrCodeSize, cellSize } = ((): { qrCodeSize: number, cellSize: number } => {
      const cellSize = size / qr.size
      const minimumCellSize = 3
      if (cellSize < minimumCellSize) {
        return {
          qrCodeSize: minimumCellSize * qr.size,
          cellSize: minimumCellSize,
        }
      }
      return {
        qrCodeSize: size,
        cellSize,
      }
    })()

    p.fill(0x0)
    p.noStroke()
    p.rect(position.x, position.y, qrCodeSize, qrCodeSize)
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
