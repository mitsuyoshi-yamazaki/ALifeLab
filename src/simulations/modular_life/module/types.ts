export type ModuleType = "compute" | "assemble" | "hull"

export interface Module<T extends ModuleType> {
  readonly name: string
  readonly type: T
}
