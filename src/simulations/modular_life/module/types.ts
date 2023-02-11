export type ModuleType = "compute" | "assemble" | "hull"
export const getShortModuleName = (moduleType: ModuleType): string => {
  switch (moduleType) {
  case "assemble":
    return "A"
  case "compute":
    return "C"
  case "hull":
    return "H"
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = moduleType
    throw new Error()
  }
  }
}

export interface Module<T extends ModuleType> {
  readonly id: number
  readonly name: string
  readonly type: T
}
