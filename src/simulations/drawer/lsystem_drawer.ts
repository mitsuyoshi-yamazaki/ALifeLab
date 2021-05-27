import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { random } from "../../classes/utilities"
import { Drawer, Action } from "./drawer"
import { Line } from "./line"
import { LSystemCoordinate, LSystemRule } from "./lsystem_rule"

const alpha = 0x80
const depthColors: Color[] = []
for (let i = 0; i < 2; i += 1) {  // FixMe: 3以上にするとcolorOfDepth()のdepthForCycle*depthColors.lengthを超えたあたりでグラデーションがかからない不具合がある
  depthColors.push(new Color(random(0xFF), random(0xFF), random(0xFF), 0xFF))
}

function colorOfCondition(condition: string): Color {
  const code = condition.charCodeAt(0)

  switch (code % 3) {
  case 0:
    return new Color(code, 0xFF, 0xFF, alpha)
  case 1:
    return new Color(0xFF, code, 0xFF, alpha)
  default:
    return new Color(0xFF, 0xFF, code, alpha)
  }
}

function colorOfDepth(depth: number): Color {
  const depthForCycle = 100
  const position = depth / depthForCycle
  const startColorWeight = position - Math.floor(position)
  const endColorWeight = 1 - startColorWeight

  const startIndex = Math.floor(position) % depthColors.length
  let endIndex = Math.ceil(position) % depthColors.length
  if (endIndex === startIndex) {
    endIndex = (endIndex + 1) % depthColors.length
  }

  const startColor = depthColors[startIndex]
  const endColor = depthColors[endIndex]

  return new Color(
    (startColor.r * startColorWeight + endColor.r * endColorWeight),
    (startColor.g * startColorWeight + endColor.g * endColorWeight),
    (startColor.b * startColorWeight + endColor.b * endColorWeight),
    (startColor.alpha * startColorWeight + endColor.alpha * endColorWeight),
  )
}

export class LSystemDrawer extends Drawer {
  protected _condition: string

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: LSystemRule,
    public readonly lineLengthType: number, // TODO: 変化しない引数は引き回さなくて済むような作りにする
    public readonly colorTheme: string, // FixMe: ColorThemeをconstants.tsから剥がして持ってくる
  ) {
    super(position, direction)
    this._condition = condition
  }

  public next(): Action<LSystemDrawer> {
    let length = 1
    if (this.lineLengthType === 1) {
      length = 10
    } else if (this.lineLengthType === 2) {
      length = 10 * this.n / (this.n + Math.pow(this.n, 0.5))
    } else {
      length = 40 / Math.pow(this.n, 0.5)
    }
    const radian = this._direction * (Math.PI / 180)
    const nextPosition = this._position.moved(radian, length)
    const line = new Line(this._position, nextPosition)
    
    switch (this.colorTheme) {
    case "grayscale":
      break

    case "ascii":
      line.color = colorOfCondition(this._condition)
      break
      
    case "depth":
      line.color = colorOfDepth(this.n)
      break

    case "direction":
      if (this.rule.colorOfCondition != null) {
        line.color = this.rule.colorOfCondition(this._condition)
      }
      break
      
    case "transition":
      throw new Error("TransitionColoredModelを利用してください")
    }

    const drawerFromCoordinate = (coordinate: LSystemCoordinate): LSystemDrawer => {
      return new LSystemDrawer(
        nextPosition,
        coordinate.direction,
        coordinate.condition,
        this.n + 1,
        this.rule,
        this.lineLengthType,
        this.colorTheme
      )
    }
    const children: LSystemDrawer[] = this.rule.nextCoordinates(this._condition, this._direction).map(drawerFromCoordinate)
    return new Action(line, children)
  }

  public mutated(): LSystemDrawer {
    const index = Math.floor(random(this.rule.possibleConditions.length))
    const condition = this.rule.possibleConditions[index]

    return new LSystemDrawer(
      this._position,
      this._direction,
      condition,
      this.n,
      this.rule,
      this.lineLengthType,
      this.colorTheme,
    )
  }
}
