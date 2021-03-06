import { random } from "../../classes/utilities"
import { Vector } from "../../classes/physics"
import { State, StateMap } from "./rule"
import { InitialStateType } from "./initial_state_type"

export class Field {
  public get states(): State[][] {
    return this._states
  }

  private _states: State[][]

  public constructor(states: State[][]) {
    this._states = states
  }

  public static create(size: Vector, type: InitialStateType, numberOfStates: number): Field {
    const localityAlivePoints: Vector[] = [size.randomized(), size.randomized(), size.randomized(), size.randomized()]
    const localityAliveDistance = Math.min(size.x, size.y) * 0.2
    const centerX = Math.floor(size.x / 2)
    const centerY = Math.floor(size.y / 2)
    const states: State[][] = []
    for (let y = 0; y < size.y; y += 1) {
      const row: State[] = []
      for (let x = 0; x < size.x; x += 1) {
        switch (type) {
        case "random":
          row.push(Math.floor(random(numberOfStates)))
          break
          
        case "zero_random":
          if (random(1) < 0.5) {
            row.push(0)
          } else {
            row.push(Math.floor(random(numberOfStates - 1)) + 1)
          }
          break

        case "one":
          if (x === centerX && y === centerY) {
            row.push(1)
          } else {
            row.push(0)
          }
          break

        case "line":
          if (y === centerY) {
            row.push(1)
          } else {
            row.push(0)
          }
          break
          
        case "half":
          if (y >= centerY) {
            row.push(1)
          } else {
            row.push(0)
          }
          break

        case "gradation": {
          const simpleGradationValue = Math.abs(y - centerY) / centerY
          const gradationValue = Math.max(Math.min(simpleGradationValue * 1.2 - 0.1, 1), 0)
          if (random(1) < gradationValue) {
            row.push(1)
          } else {
            row.push(0)
          }
          break
        }

        case "locality": {
          const currentPoint = new Vector(x, y)
          const nearestAlivePoint = localityAlivePoints.sort((lhs: Vector, rhs: Vector): number => {
            const distanceL = currentPoint.dist(lhs)
            const distanceR = currentPoint.dist(rhs)
            if (distanceL === distanceR) {
              return 0
            }
            return distanceL > distanceR ? 1 : -1
          })[0]

          const distance = currentPoint.dist(nearestAlivePoint)
          if (distance > localityAliveDistance) {
            row.push(0)
            break
          }
          if (random(1) > (distance / localityAliveDistance)) {
            row.push(1)
          } else {
            row.push(0)
          }
          break
        }
            
        case "manual": {
          const margin = 0.2
          if (x < size.x * margin || x > size.x * (1 - margin) || y < size.y * margin || y > size.y * (1 - margin)) {
            row.push(0)
            break
          }
          if (random(1) < 0.75) {
            row.push(0)
          } else {
            row.push(Math.floor(random(numberOfStates - 1)) + 1)
          }
          break
        }

        default:
          console.error(`Not implemented: initial state type ${type}`)
          break
        }
      }
      states.push(row)
    }

    return new Field(states)
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
