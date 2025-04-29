import { Core } from "./core"
import { interpret } from "./interpreter"
import { Warrior } from "./warrior"
import { WarriorCode } from "./warrior_code"


export class Engine {
  public get tick(): number {
    return this._tick
  }

  private _tick = 0

  public constructor(
    public readonly core: Core,
    private readonly warriors: Warrior[],
  ) {
  }

  public runTick(): void {
    this.warriors.forEach(warrior => {
      const pointerWrapper = warrior.getNextPointer()
      if (pointerWrapper == null) {
        return
      }

      const result = interpret(this.core, pointerWrapper.pointer)
      pointerWrapper.tickFinished(result)
    })

    this._tick += 1
  }
}


export class EngineSetup {
  private readonly core: Core
  private readonly warriorCode = new Map<string, WarriorCode>()

  public constructor(
    coreSize = 80,
  ) {
    this.core = new Core(coreSize)
  }

  public addWarriorCode(warriorCode: WarriorCode): void {
    this.warriorCode.set(warriorCode.name, warriorCode)
  }

  public init(): Engine | string {
    const initialCodeMemoryLength = Array.from(this.warriorCode.values()).reduce((result, current) => result + current.code.length, 0)
    const bufferSize = this.core.coreSize - initialCodeMemoryLength
    if (bufferSize < 0) {
      return `Coresize too small (initial warriors requires ${initialCodeMemoryLength} but ${this.core.coreSize} coresize given)`
    }

    const warriors: Warrior[] = []
    const addWarrior = (instructionPointer: number, warriorCode: WarriorCode): void => {
      warriors.push(new Warrior(warriorCode, instructionPointer))
    }

    let instructionPointer = 0
    const bufferForEachWarriors = Math.floor(bufferSize / this.warriorCode.size)
    this.warriorCode.forEach(warriorCode => {
      addWarrior(instructionPointer, warriorCode)
      instructionPointer += warriorCode.code.length + bufferForEachWarriors
    })

    return new Engine(this.core, warriors)
  }
}

