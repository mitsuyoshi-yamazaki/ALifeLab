import { State, StateMap, Rule } from "../rule"
import { ColorPalette } from "../color_palette"
import { Color } from "../../../classes/color"

interface StateInfo {
  name: string
  hydrophilic: number
  color: Color
}

const oil = 0
const water = 1
const membrane = 2
const stateInfo: StateInfo[] = [
  {
    name: "oil",
    hydrophilic: -1,
    color: Color.white(0x0),
  },
  {
    name: "water",
    hydrophilic: 1,
    color: new Color(83, 150, 205),
  },
  {
    name: "membrane",
    hydrophilic: 0,
    color: new Color(0xFC, 0x88, 0x45),
  },
]

const colorPalette: ColorPalette = {
  toString: (): string => {
    return "ColorPalette"
  },
  colorOf: (state: State): Color => {
    return stateInfo[state].color
  }
}

export class ChemicalCharacteristicRule implements Rule {
  public numberOfStates = stateInfo.length
  public colorPalette = colorPalette
  public get weights(): number[] {
    return this._weights
  }

  private _weights: number[] = []

  public constructor(public readonly radius: number) {
    if (radius <= 0) {
      throw new Error(`Invalid argument: radius should be > 0 (${radius})`)
    }
    for (let i = 0; i <= radius; i += 1) {
      this._weights.push(1)
    }
  }

  public toString(): string {
    return `ChemicalCharacteristicRule with ${this.colorPalette.toString()}`
  }

  public nextState(state: State, states: StateMap): State {
    // FixMe: weights計算は面倒なので無視している
    states.increment(state, 1)

    const unit = 6
    const maxUnit = this.radius * (this.radius + 1) / 2

    let hydrophilic = 0
    const oilCount = states.stateCount(oil)
    const waterCount = states.stateCount(water)
    const membraneCount = states.stateCount(membrane)

    hydrophilic += stateInfo[oil].hydrophilic * oilCount
    hydrophilic += stateInfo[water].hydrophilic * waterCount
    hydrophilic += stateInfo[membrane].hydrophilic * membraneCount

    if (Math.abs(hydrophilic) < unit * maxUnit * 0.2) {
      return membrane
    }
    return hydrophilic > 0 ? water : oil
  }
}
