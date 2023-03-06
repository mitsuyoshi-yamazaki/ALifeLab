import type { ModuleDefinition } from "./module/module"
import type { NeighbourDirection } from "./physics/direction"
import type { Hull } from "./module/module_object/hull"
import type { TransferrableMaterialType } from "./physics/material"
import type { Assembler } from "./module/module_object/assembler"
import type { MaterialSynthesizer } from "./module/module_object/material_synthesizer"
import type { Channel } from "./module/module_object/channel"
import { InternalModuleType } from "./module/module_object/module_object"

export type Life = Hull

// リクエストが関係するのはScopeの中だけなのでローカルに処理できるか？
export type ComputeRequestMove = {
  readonly case: "move"
  readonly direction: NeighbourDirection
}
export type ComputeRequestUptake = {
  readonly case: "uptake"
  readonly materialType: TransferrableMaterialType
  readonly module: Channel
}
export type ComputeRequestExcretion = {
  readonly case: "excretion"
  readonly materialType: TransferrableMaterialType
  readonly module: Channel
}
export type ComputeRequestSynthesize = {
  readonly case: "synthesize"
  readonly module: MaterialSynthesizer
}
export type ComputeRequestAssemble = {
  readonly case: "assemble"
  readonly module: Assembler
  readonly moduleDefinition: ModuleDefinition<InternalModuleType>
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

export type GenericComputeRequest<RequestType extends ComputeRequestType> = RequestType extends "move" ? ComputeRequestMove :
  RequestType extends "uptake" ? ComputeRequestUptake :
  RequestType extends "excretion" ? ComputeRequestExcretion :
  RequestType extends "synthesize" ? ComputeRequestSynthesize :
  RequestType extends "assemble" ? ComputeRequestAssemble :
  never
