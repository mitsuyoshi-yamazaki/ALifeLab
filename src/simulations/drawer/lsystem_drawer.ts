import { Vector } from "../../classes/physics"
import { Color } from "../../classes/color"
import { random } from "../../classes/utilities"
import { Drawer, Action } from "./drawer"
import { Line } from "./line"
import { LSystemRule } from "./lsystem_rule"
import { constants } from "./constants" // TODO: 独立性を高めるために外す

const alpha = 0x80
const depthColors: Color[] = []
for (let i = 0; i < 2; i += 1) {  // FixMe: 3以上にするとcolorOfDepth()のdepthForCycle*depthColors.lengthを超えたあたりでグラデーションがかからない不具合がある
  depthColors.push(new Color(random(0xFF), random(0xFF), random(0xFF), 0xFF))
}
console.log(`colors: ${depthColors}`)

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
  private _condition: string

  public constructor(
    position: Vector,
    direction: number,
    condition: string,
    public readonly n: number,
    public readonly rule: LSystemRule,
    public readonly lineLengthType: number,
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
    
    switch (constants.draw.colorTheme) {
    case "ascii":
      line.color = colorOfCondition(this._condition)
      break
      
    case "depth":
      line.color = colorOfDepth(this.n)
      break

    default:
      break
    }

    let newDirection = this._direction
    const nextCondition = this.rule.nextConditions(this._condition)
    const children: LSystemDrawer[] = []

    for (const condition of nextCondition) {
      if (typeof(condition) === "number") {
        newDirection += condition
        continue
      }

      const child = new LSystemDrawer(nextPosition, newDirection, condition, this.n + 1, this.rule, this.lineLengthType)
      children.push(child)
    }

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
      this.lineLengthType
    )
  }
}
