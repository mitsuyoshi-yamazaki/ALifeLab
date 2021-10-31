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
type DrawerState = "initialized" | "add rules" | "draw" | "share"

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

function createAddRuleSystemMessage(remainingRuleCount: number): string {
  return `画面をタップして模様を追加(あと${remainingRuleCount}回)`
}
const tips: string[] = [
  "模様を近所に配置して、模様同士がどのように干渉するか観察してみましょう",
  "成長する枝が、別の模様や画面の縁に当たって跳ね返るような模様を探してみましょう",
  "模様が成長する様子を観察してみましょう。どのような模様になるか予測できるでしょうか",
  "模様同士を離して配置して、外乱のないときにどのような模様になるか確認してみましょう",
]

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
    case "initialized":
    case "add rules":
      return 10
    case "draw":
    case "share":
      return 1
    }
  }
  private _interfaceDrawer: InterfaceDrawer
  private _tips: string[] = [...tips]

  public constructor(
    private readonly fieldSize: Vector,
    private readonly maxLineCount: number,
    private readonly ruleArgument: RuleArgument,
    private readonly showIndicators: boolean,
  ) {
    this._interfaceDrawer = new InterfaceDrawer(fieldSize)

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
          this.changeState(this._currentModel, "share")
        }
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
    const currentModel = this._currentModel
    console.log(`didReceiveTouch ${currentModel.state}`)

    const addRule = () => {
      const nextRuleDefinition = currentModel.ruleDefinitions.shift()
      if (nextRuleDefinition == null) {
        this.changeState(currentModel, "draw")
        return
      }
      this.addRule(nextRuleDefinition.rule, position) // TODO: preferredLineCountMultiplierを入れる
      this._interfaceDrawer.setSystemMessage(createAddRuleSystemMessage(currentModel.ruleDefinitions.length), false)
      if (currentModel.model.numberOfRules >= maxNumberOfRules) {
        this.changeState(currentModel, "draw")
      }
    }
    const reset = () => {
      this.reset()
      console.log("reset")
    }

    switch (this._currentModel.state) {
    case "initialized":
      this.changeState(currentModel, "add rules")
      addRule()
      break
    case "add rules":
      addRule()
      break
        
    case "draw":
      break // 無視
        
    case "share":
      reset()
      break
    }
  }

  // ---- Private API ---- //
  private addRule(rule: VanillaLSystemRule, position: Vector): void {
    this._currentModel.model.addRule(rule, position) // TODO: preferredLineCountMultiplierを入れる
  }

  private changeState(currentModel: InteractiveDrawModel, state: DrawerState): void {
    console.log(`${currentModel.state} -> ${state}`)
    currentModel.state = state

    switch (state) {
    case "initialized":
      this._interfaceDrawer.setSystemMessage(createAddRuleSystemMessage(currentModel.ruleDefinitions.length), true)
      this._interfaceDrawer.tip = null
      break
    case "add rules":
      this._interfaceDrawer.tip = null
      break
    case "draw":
      this._interfaceDrawer.setSystemMessage("描画中...", true)
      this._interfaceDrawer.tip = null
      break
    case "share": {
      this._interfaceDrawer.setSystemMessage("タップしてリセット", true)
        
      const tip = ((): string | null => {
        if (this._tips.length <= 0) {
          this._tips.push(...tips)
        }
        const randomIndex = Math.floor(random(this._tips.length))
        const randomTip = this._tips[randomIndex]
        this._tips.splice(randomIndex, 1)
        return randomTip
      })()
      this._interfaceDrawer.tip = tip

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
      break
    }
    }
  }

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
      state: "initialized",
      model: this.createModel(),
      ruleDefinitions: selectedDefinitions,
    }

    this.changeState(this._currentModel, "initialized") // changeState()状態変化のリセット
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
const systemMessageFadeDuration = 14
const systemMessageTextSize = 50

class InterfaceDrawer {
  public get qrCodeUrl(): string | null {
    return this._qrCodeInfo?.url ?? null
  }
  public get systemMessage(): string {
    return this._systemMessage.message
  }
  public tip: string | null = null
  
  private _t = 0
  private _qrCodeInfo: QRCodeInfo | null = null
  private _systemMessage: {
    message: string
    incremental: boolean
    changedAt: number
  } = {
    message: "",
    incremental: false,
    changedAt: 0,
  }

  public constructor(
    public readonly fieldSize: Vector,
  ) {
  }

  public setQrCodeInfo(info: QRCodeInfo | null): void {
    if (info != null) {
      console.log(`Share URL: ${info.url}`)
    }
    this._qrCodeInfo = info
  }

  public setSystemMessage(message: string, incremental: boolean): void {
    if (message !== this._systemMessage.message || incremental !== this._systemMessage.incremental) {
      this._systemMessage = {
        message,
        incremental,
        changedAt: this._t,
      }
    }
  }

  // ---- Drawing ---- //
  public draw(p: p5): void {
    if (this.systemMessage.length > 0) {
      this.drawSystemMessage(p)
    }
    if (this.tip != null) {
      this.drawTip(p, this.tip)
    }
    if (this._qrCodeInfo != null) {
      this.drawQrCode(p, this._qrCodeInfo.url, this._qrCodeInfo.position, 200)
    }

    this._t += 1
  }

  // ---- Private ---- //
  private drawSystemMessage(p: p5): void {
    const displayMessage = ((): string => {
      if (this._systemMessage.incremental === false) {
        return this.systemMessage
      }
      const progress = Math.min(this._t - this._systemMessage.changedAt, systemMessageFadeDuration) / systemMessageFadeDuration
      const endIndex = Math.min(Math.floor(progress * this.systemMessage.length), this.systemMessage.length)
      return this.systemMessage.slice(0, endIndex)
    })()

    const margin = 10
    const x = margin
    const y = margin + systemMessageTextSize * 3

    p.fill(0xFF, 0xE0)
    p.textAlign(p.LEFT)
    p.textStyle(p.NORMAL)
    p.textSize(systemMessageTextSize)
    p.text(displayMessage, x, y)
  }

  private drawTip(p: p5, tip: string): void {
    const textSize = 30
    const margin = 10
    const x = margin
    const y = margin + systemMessageTextSize * 3 + 30
    const width = this.fieldSize.x - margin * 2

    // const temp = (p as { textWrap?: (wrapStyle: string) => void })
    // if (temp.textWrap != null) { // ない
    //   temp.textWrap("char")
    // } else {
    //   console.log("no textWrap()")
    // }

    p.fill(0xFF, 0xE0)
    p.textAlign(p.LEFT)
    p.textStyle(p.NORMAL)
    p.textSize(textSize)
    p.text(tip, x, y, width)
  }

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
