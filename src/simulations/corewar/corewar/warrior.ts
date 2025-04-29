import { ExecutionResult } from "./instruction"
import { WarriorCode } from "./warrior_code"


type PointerWrapper = {
  readonly pointer: number
  readonly tickFinished: (result: ExecutionResult) => void
}


class WarriorProcess {
  public constructor(
    public instructionPointer: number,
  ) {
  }
}


export class Warrior {
  public get name(): string {
    return this.code.name
  }
  private processPointer = 0
  private aliveProcesses: WarriorProcess[] = []
  private deadProcesses: WarriorProcess[] = []

  public constructor(
    public readonly code: WarriorCode,
    instructionPointer: number,
  ) {
    this.aliveProcesses.push(new WarriorProcess(instructionPointer))
  }

  public getNextPointer(): PointerWrapper | null {
    const process = this.getNextAliveProcess()
    if (process == null) {
      return null
    }

    return {
      pointer: process.instructionPointer,
      tickFinished: result => {
        switch (result.result) {
        case "succeeded":
          process.instructionPointer = result.newPointer
          this.processPointer = (this.processPointer + 1) % this.aliveProcesses.length
          break
        case "failed":
          this.aliveProcesses.splice(this.processPointer, 1)
          this.deadProcesses.push(process)
          if (this.aliveProcesses.length > 0) {
            this.processPointer = this.processPointer % this.aliveProcesses.length
          }
          break
        default: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _: never = result
          break
        }
        }
      },
    }
  }

  /** @throws */
  private getNextAliveProcess(): WarriorProcess | null {
    return this.aliveProcesses[this.processPointer]
  }
}