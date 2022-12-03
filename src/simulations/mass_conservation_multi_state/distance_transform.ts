import { strictEntries } from "../../classes/utilities"
import { CellState, CellSubstanceType } from "./world"

type DominantSubstanceType = CellSubstanceType | "none"
export type DistanceTransformResult = {
  readonly dominantSubstance: DominantSubstanceType
  readonly distance: number
}

export const distanceTransform = (cellStates: CellState[][]): DistanceTransformResult[][] => {
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

  return dominantSubstances.map(row => row.map(dominantSubstance => ({ dominantSubstance, distance: 0 })))
}
