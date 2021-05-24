import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { State, StateMap } from "./rule"

export class Field {
  public get ruleStates(): State[][] {
    return this._ruleStates
  }
  public get states(): State[][] {
    return this._states
  }

  private _states: State[][]
  private _ruleStates: State[][]

  public constructor(ruleStates: State[][], states: State[][]) {
    this._ruleStates = ruleStates
    this._states = states
  }

  public static create(size: Vector): Field {
    const numberOfStates = 2  // TODO: それぞれのルールの状態数
    const states: State[][] = []
    for (let y = 0; y < size.y; y += 1) {
      const row: State[] = []
      for (let x = 0; x < size.x; x += 1) {
        row.push(Math.floor(random(numberOfStates)))
      }
      states.push(row)
    }

    return new Field(states, Array.from(states))
  }

  public stateCounts(x: number, y: number, radius: number, weight: number[] | null): StateMap {
    const states = new StateMap()
    const oddRowIndex = (index: number): number => {
      if (y % 2 === 0) {
        return index + 0.5
      } else {
        return index - 0.5
      }
    }
    const distance = (k: number, j: number): number => {
      for (let n = radius; n >= 0; n -= 1) {
        if (k === radius - n || k === (2 * n - Math.abs(j)) + (radius - n) || j === -n || j === n) {
          return n
        }
      }
      throw new Error(`Bug!!! (${k}, ${j}), radius: ${radius}`)
    }

    for (let j = -radius; j <= radius; j += 1) {
      const row = this.states[(y + j + this.states.length) % this.states.length]
      const distanceFromCenter = Math.abs(j)
      const dx = radius - (distanceFromCenter / 2)
      for (let i = -dx, k = 0; i <= dx; i += 1, k += 1) {
        if (i === 0 && j === 0) {
          continue
        }
        const index = j % 2 === 0 ? i : oddRowIndex(i)
        const state = row[(x + index + row.length) % row.length]
        if (weight != null) {
          states.increment(state, weight[distance(k, j)])
        } else {
          states.increment(state, 1)
        }
      }
    }
    return states
  }
}