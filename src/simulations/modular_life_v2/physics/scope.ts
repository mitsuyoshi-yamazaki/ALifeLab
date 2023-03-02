import { strictEntries } from "../../../classes/utilities"
import type { Hull } from "../module/module"
import type { MaterialType, Energy } from "../physics/material"

type MaterialStore = { [Material in (MaterialType | Energy)]: number }

export type ScopeId = string

export type ScopeUpdate = {
  readonly amount: MaterialStore
  heat: number
  readonly hullToAdd: Hull[]
  readonly hullToRemove: Hull[]
}

export type Scope = {
  readonly scopeId: ScopeId
  readonly amount: MaterialStore
  capacity: number
  heat: number

  readonly hull: Hull[]

  scopeUpdate: ScopeUpdate | null
}

export const createScopeData = (scopeType: string, capacity: number): Scope => {
  return {
    scopeId: createScopeId(scopeType),
    amount: {
      nitrogen: 0,
      carbon: 0,
      fuel: 0,
      substance: 0,
      energy: 0,
    },
    capacity,
    heat: 0,
    hull: [],
    scopeUpdate: null,
  }
}

export const createScopeUpdate = (): ScopeUpdate => {
  return {
    amount: {
      nitrogen: 0,
      carbon: 0,
      fuel: 0,
      substance: 0,
      energy: 0,
    },
    heat: 0,
    hullToAdd: [],
    hullToRemove: [],
  }
}

let scopeId = 0
const createScopeId = (scopeType: string): ScopeId => {
  const id = scopeId
  scopeId += 1
  return `${scopeType}-${id}`
}

export const updateScope = (scope: Scope, update: ScopeUpdate): void => {
  strictEntries(scope.amount).forEach(([materialType, amount]) => {
    scope.amount[materialType] = amount + update.amount[materialType]
  })

  scope.heat += update.heat
  update.hullToRemove.forEach(hull => {
    const index = scope.hull.indexOf(hull)
    if (index < 0) {
      throw `Hull ${hull} is not in scope (${scope.scopeId})`
    }

    scope.hull.splice(index, 1)
  })

  scope.hull.push(...update.hullToAdd)
}