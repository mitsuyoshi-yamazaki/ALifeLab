import type { Hull, ModuleType } from "./module/module"
import type { MaterialRecipeName, TransferrableMaterialType } from "./physics/material"
import type { NeighbourDirection } from "./physics/direction"

export type Life = Hull

// リクエストが関係するのはScopeの中だけなのでローカルに処理できるか？
export type ComputeRequestMove = {
  readonly case: "move"
  readonly direction: NeighbourDirection
}
export type ComputeRequestUptake = {
  readonly case: "uptake"
  readonly materialType: TransferrableMaterialType
  readonly amount: number
}
export type ComputeRequestExcretion = {
  readonly case: "excretion"
  readonly materialType: TransferrableMaterialType
  readonly amount: number
}
export type ComputeRequestSynthesize = {
  readonly case: "synthesize"
  readonly recipe: MaterialRecipeName
}
export type ComputeRequestAssemble = {
  readonly case: "assemble"
  readonly moduleType: ModuleType
}

export type IntraScopeMaterialTransferRequest = ComputeRequestSynthesize
  | ComputeRequestAssemble
export type IntraScopeMaterialTransferRequestType = IntraScopeMaterialTransferRequest["case"]

export type InterScopeMaterialTransferRequest = ComputeRequestUptake
  | ComputeRequestExcretion
export type InterScopeMaterialTransferRequestType = InterScopeMaterialTransferRequest["case"]

export type MaterialTransferRequest = IntraScopeMaterialTransferRequest
  | InterScopeMaterialTransferRequest
export type MaterialTransferRequestType = MaterialTransferRequest["case"]

export type ComputeRequest = ComputeRequestMove
  | MaterialTransferRequest
export type ComputeRequestType = ComputeRequest["case"]
