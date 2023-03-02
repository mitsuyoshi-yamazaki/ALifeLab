import { strictEntries } from "../../../classes/utilities"
import type { Hull } from "../module/module"
import type { MaterialType, Energy } from "../physics/material"

type MaterialStore = { [Material in (MaterialType | Energy)]: number }

export type ScopeId = number

export type ScopeUpdate = {
  readonly scopeId: ScopeId
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
}

export const createScopeData = (capacity: number): Scope => {
  return {
    scopeId: createScopeId(),
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
  }
}

export const createScopeUpdate = (targetScope: Scope): ScopeUpdate => {
  return {
    scopeId: targetScope.scopeId,
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
const createScopeId = (): ScopeId => {
  const id = scopeId
  scopeId += 1
  return id
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