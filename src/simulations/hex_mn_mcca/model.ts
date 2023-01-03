import { AggregatedCellState, CellState } from "./cell_state"
import { GrowthFunction } from "./growth_function"
import { Kernel } from "./kernel"

export type ModelInitializer = (size: number) => CellState[][]

const indicesCache = new Map<number, [number, number][]>()
const indicesOf = (radius: number): [number, number][] => {
  const cached = indicesCache.get(radius)
  if (cached != null) {
    return cached
  }

  const calculated = ((): [number, number][] => {
    if (radius <= 0) {
      return [[0, 0]]
    }

    return [
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [radius, 0 - radius + i]),
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [radius - i, i]),
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [-i, radius]),
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [-radius, radius - i]),
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [-radius + i, -i]),
      ...(new Array(radius)).fill(null).map((_, i): [number, number] => [i, -radius]),
    ]

    // for (let axis = 0; axis < 3; axis += 1) { // r,q,s,-r,-q,-s
    //   for (let index = 0; index < i; index += 1) {  // 0->i,0->-i
    //     // q=2, s=0,-1 => q=2, r=-2,-1
    //     // s=-2, r=0,1 => q= 0 + radius - r
    //     // r=2, q=0,-1 
    //     // q=-2, s=0,1 => q=-radius, r=0-(-radius)-i
    //     // s= 2, r=0,-1 => q=-radius +i
    //     // r= -2, q=0,1
    //   }
    // }
  })()

  indicesCache.set(radius, calculated)
  return calculated
}

export class Model {
  public get states(): CellState[][] {
    return this._states
  }

  private _states: CellState[][] = []
  
  public constructor(
    public readonly size: number,
    public readonly kernel: Kernel,
    public readonly growthFunction: GrowthFunction,
  ) {
  }

  public initialize(initializer: ModelInitializer): void {
    this._states = initializer(this.size)
  }

  public step(step: number): void {
    for (let i = 0; i < step; i += 1) {
      this.calculateNextStep()
    }
  }

  private calculateNextStep(): void {
    const result: CellState[][] = []

    this.states.forEach((row, y) => {
      const nextRow: CellState[] = []
      result.push(nextRow)

      row.forEach((state, x) => {
        const sum = this.sumOf(x, y)
        const nextState = Math.min(Math.max(state + this.growthFunction.nextStateOf(sum), 0), 1)
        nextRow.push(nextState)
      })
    })

    this._states = result
  }

  private sumOf(x: number, y: number): AggregatedCellState {
    return this.kernel.weights.reduce((weightedSum, weight, i) => {
      return weightedSum + indicesOf(i).reduce((result, localIndex) => {
        const xIndex = (localIndex[0] + x + this.size) % this.size
        const yIndex = (localIndex[1] + y + this.size) % this.size
        return result + this.states[yIndex][xIndex] * weight
      }, 0)
    }, 0)
  }
}