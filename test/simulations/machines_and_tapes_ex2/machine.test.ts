import { Machine } from "../../../src/simulations/machines_and_tapes_ex2/machine"
import { Vector } from "../../../src/classes/physics"
import { Bit, Tape } from "../../../src/simulations/machines_and_tapes_ex2/tape"

function binaryToBits(binaryString: string): Bit[] {
  return binaryString.split("")
    .map(x => x === "1" ? 1 : 0)
}

function createTape(binaryString: string): Tape {
  return new Tape(binaryToBits(binaryString))
}

function createMachine(binary: string): Machine {
  return new Machine(Vector.zero(), createTape(binary))
}

describe("Pointer", () => {
  test("Index", () => {
    const machine = createMachine("01001100")
    expect(machine.nextBit())
      .toBe(0)
    expect(machine.nextBit(0))
      .toBe(0)
    expect(machine.nextBit(1))
      .toBe(1)
    expect(machine.nextBit(2))
      .toBe(0)
    expect(machine.nextBit(3))
      .toBe(0)
    expect(machine.nextBit(4))
      .toBe(1)
    expect(machine.nextBit(5))
      .toBe(1)
    expect(machine.nextBit(6))
      .toBe(0)
    expect(machine.nextBit(7))
      .toBe(0)
    expect(machine.nextBit(8))
      .toBe(0)
    expect(machine.nextBit(9))
      .toBe(1)
  })
})

describe("Connection", () => {
  test("Check", () => {
    const machine = createMachine("01")
    expect(machine.canConnect(createTape("0")))
      .toBe(false)
    expect(machine.canConnect(createTape("1")))
      .toBe(true)
    expect(machine.canConnect(createTape("00")))
      .toBe(false)
    expect(machine.canConnect(createTape("11")))
      .toBe(true)
  })
})

describe("Connecting tapes", () => {
  test("No production", () => {
    expect(createMachine("01").connect(createTape("1")))
      .toBeUndefined()
  })

  test("Connect single tape", () => {
    const newMachine = createMachine("01").connect(createTape("10"))
    expect(newMachine != undefined)
      .toBe(true)
    expect((newMachine as Machine).tape.binary)
      .toBe("10")
  })

  test("Connect multiple tapes", () => {
    const machine = createMachine("01")
    expect(machine.pointer)
      .toBe(0)
    expect(machine.connect(createTape("1")))
      .toBeUndefined()
    expect(machine.pointer)
      .toBe(1)
    const newMachine = machine.connect(createTape("0"))
    expect(newMachine != undefined)
      .toBe(true)
    expect((newMachine as Machine).tape.binary)
      .toBe("10")
    expect(machine.pointer)
      .toBe(0)
    expect(machine.workingTape.length)
      .toBe(0)
  })

  test("Mutation", () => {
    const machine = createMachine("01")
    expect(machine.connect(createTape("1")))
      .toBeUndefined()
    const newMachine = machine.connect(createTape("01"))
    expect(newMachine != undefined)
      .toBe(true)
    expect((newMachine as Machine).tape.binary)
      .toBe("101")
    expect(machine.pointer)
      .toBe(0)
    expect(machine.workingTape.length)
      .toBe(0)
  })

  test("test", () => {
    const machine = createMachine("10101")
    expect((machine.connect(createTape("000000")) as Machine).tape.binary)
      .toBe("000000")
  })
})

describe("Decompose", () => {
  test("Normal", () => {
    const decomposed = createMachine("1011100").decompose()
    expect(decomposed.length)
      .toBe(2)
    expect(decomposed[0].tape.binary)
      .toBe("101")
    expect(decomposed[1].tape.binary)
      .toBe("1100")
  })

  test("Decompose primitive tape", () => {
    const decomposed = createMachine("0").decompose()
    expect(decomposed.length)
      .toBe(1)
    expect(decomposed[0].tape.binary)
      .toBe("0")
  })
})
