export type ModuleType = "compute" | "assemble" | "hull"

export interface Module<T extends ModuleType> {
  readonly id: number
  readonly name: string
  readonly type: T
}
