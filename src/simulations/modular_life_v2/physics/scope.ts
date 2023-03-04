import { strictEntries } from "../../../classes/utilities"
import type { Hull } from "../module/module_object/hull"
import type { MaterialType, Energy } from "../physics/material"

export type MaterialStore = { [Material in (MaterialType | Energy)]: number }
export const createMaterialStore = (): MaterialStore => {
  return {
    nitrogen: 0,
    carbon: 0,
    fuel: 0,
    substance: 0,
    energy: 0,
  }
}

export type ScopeId = string

export type ScopeUpdate = {
  /// 差分ではなく更新後の値
  readonly amount: MaterialStore

  /// 差分ではなく更新後の値
  heat: number

  /// 差分
  readonly hullToAdd: Hull[]
  /// 差分
  readonly hullToRemove: Hull[]
}

export type Scope = {
  readonly scopeId: ScopeId
  readonly amount: MaterialStore
  readonly capacity: number
  heat: number

  readonly hull: Hull[]

  scopeUpdate: ScopeUpdate
}

export const createScopeData = (scopeType: string, capacity: number): Scope => {
  return {
    scopeId: createScopeId(scopeType),
    amount: createMaterialStore(),
    capacity,
    heat: 0,
    hull: [],
    scopeUpdate: {
      amount: createMaterialStore(),
      heat: 0,
      hullToAdd: [],
      hullToRemove: [],
    },
  }
}

export const createScopeUpdate = (originalScope: Scope): ScopeUpdate => {
  return {
    amount: {...originalScope.amount},
    heat: originalScope.heat,
    hullToAdd: [],
    hullToRemove: [],
  }
}

let scopeId = 0
export const createScopeId = (scopeType: string): ScopeId => {
  const id = scopeId
  scopeId += 1
  return `${scopeType}-${id}`
}

export const updateScope = (scope: Scope, update: ScopeUpdate): void => {
  strictEntries(scope.amount).forEach(([materialType, amount]) => {
    scope.amount[materialType] = amount
  })

  scope.heat = update.heat
  update.hullToRemove.forEach(hull => {
    const index = scope.hull.indexOf(hull)
    if (index < 0) {
      throw `Hull ${hull} is not in scope (${scope.scopeId})`
    }

    scope.hull.splice(index, 1)
  })

  scope.hull.push(...update.hullToAdd)
}