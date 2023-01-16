import { Vector } from "../../classes/physics"
import { Mutable, strictEntries } from "../../classes/utilities"
import { CellState, CellSubstanceType, cellSubstanceTypes } from "./world"

type DominantSubstanceType = CellSubstanceType | "none"
export type DistanceTransformResult = {
  readonly dominantSubstance: DominantSubstanceType
  readonly distance: number
}

export const distanceTransform = (cellStates: CellState[][], worldSize: Vector): DistanceTransformResult[][] => {
  const dominantSubstances: DominantSubstanceType[][] = []
  cellStates.forEach(row => {
    const dominantSubstanceRow: DominantSubstanceType[] = []
    dominantSubstances.push(dominantSubstanceRow)

    row.forEach(state => {
      const result: { dominantSubstance: DominantSubstanceType, amount: number } = {
        dominantSubstance: "none",
        amount: 0,
      }

      strictEntries(state.substances).forEach(([substance, amount]) => {
        if (amount < result.amount) {
          return
        }
        if (amount === result.amount) {
          result.dominantSubstance = "none"
          return
        }
        result.dominantSubstance = substance
        result.amount = amount
      })
      dominantSubstanceRow.push(result.dominantSubstance)
    })
  })

  
  return distanceTransformFor(dominantSubstances, worldSize)
}

const distanceTransformFor = (dominantSubstances: DominantSubstanceType[][], worldSize: Vector): DistanceTransformResult[][] => {
  const max = Math.max(worldSize.x, worldSize.y) * 2
  const results: Mutable<DistanceTransformResult>[][] = []
  const substanceDistances: { [Substance in CellSubstanceType]: (number | null)[][] } = {
    "blue": [],
    "red": [],
  }

  dominantSubstances.forEach(row => {
    const resultRow: DistanceTransformResult[] = []
    results.push(resultRow)

    cellSubstanceTypes.forEach(substance => substanceDistances[substance].push([]))

    row.forEach(dominantSubstance => {
      resultRow.push({
        dominantSubstance,
        distance: max,
      })

      cellSubstanceTypes.forEach(substance => {
        const substanceDistance = substanceDistances[substance]
        const substanceRow = substanceDistance[substanceDistance.length - 1]
        if (substance === dominantSubstance) {
          substanceRow.push(null)
        } else {
          substanceRow.push(max)
        }
      })
    })
  })

  cellSubstanceTypes.forEach(substance => {
    let finished = false as boolean
    for (let i = max; i >= 0; i -= 1) {
      finished = true
      const substanceDistance = substanceDistances[substance]
      substanceDistance.forEach((row, y) => {
        row.forEach((distance, x) => {
          if (distance !== i) {
            return
          }
          finished = false
          fillNeighbours(i - 1, substanceDistance, x, y, worldSize)
        })
      })

      if (finished === true) {
        break
      }
    }
  })

  cellSubstanceTypes.forEach(substance => {
    const substanceDistance = substanceDistances[substance]
    substanceDistance.forEach((row, y) => {
      row.forEach((distance, x) => {
        if (distance == null || distance >= max) {
          return
        }
        results[y][x].distance = distance
      })
    })
  })

  return results
}

const fillNeighbours = (fillDistance: number, matrix: (number | null)[][], x: number, y: number, worldSize: Vector): void => {
  const fill = (j: number, i: number): void => {
    if (matrix[j][i] != null) {
      return
    }
    matrix[j][i] = fillDistance
  }

  const topY = (y - 1 + worldSize.y) % worldSize.y
  fill(topY, x)

  const bottomY = (y + 1) % worldSize.y
  fill(bottomY, x)

  const leftX = (x - 1 + worldSize.x) % worldSize.x
  fill(y, leftX)

  const rightX = (x + 1) % worldSize.x
  fill(y, rightX)
}