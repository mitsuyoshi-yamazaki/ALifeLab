import { createId } from "../primitive/world_object_id"

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

export abstract class Module<T extends ModuleType> {
  public readonly id: number
  
  public abstract readonly name: string
  public abstract readonly type: T

  public constructor(
    public hits: number,
    public readonly hitsMax: number,
  ) {
    this.id = createId()
  }
  
  public toString(): string {
    return `${this.constructor.name}[${this.id}]`
  }
}
