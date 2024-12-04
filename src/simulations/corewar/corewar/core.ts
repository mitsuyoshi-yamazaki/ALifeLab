import { CoreMemory } from "./instruction"
import { Dat } from "./instructions"

export class Core {
  public readonly core: CoreMemory[]

  public constructor(
    public readonly coreSize = 80,
  ) {
    this.core = new Array(coreSize).fill(Dat)
  }

  public write(memory: CoreMemory[], atIndex: number): void {
    memory.forEach((memoryValue, index) => {
      this.core[(atIndex + index) % this.coreSize] = memoryValue
    })
  }
}