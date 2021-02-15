import { Bit, Tape } from "../../../src/pages/machines_and_tapes_ex2/tape"

function createTape(binaryString: string): Tape {
  return new Tape(binaryToBits(binaryString))
}

function binaryToBits(binaryString: string): Bit[] {
  return binaryString.split("")
    .map(x => x === "1" ? 1 : 0)
}

describe("Construct Tape", () => {
  test("Value", () => {
    expect(createTape("0").binary)
      .toBe("0")
    expect(createTape("0000").binary)
      .toBe("0000")
    expect(createTape("01010101").binary)
      .toBe("01010101")
    expect(createTape("11111111").binary)
      .toBe("11111111")
  })

  test("Length", () => {
    expect(createTape("0").bits.length)
      .toBe(1)
    expect(createTape("01010101").bits.length)
      .toBe(8)
    expect(createTape("11111111").bits.length)
      .toBe(8)
  })

  test("Color", () => {
    expect(createTape("000").color.toString())
      .toBe("#808080")
    expect(createTape("101011").color.toString())
      .toBe("#d4d4ff")
  })
})

describe("Split Tape", () => {
  test("Length", () => {
    expect(createTape("0").split().length)
      .toBe(1)
    expect(createTape("01010101").split().length)
      .toBe(2)
  })

  test("Value", () => {
    const tapes = createTape("01011010").split()
    expect(tapes.length)
      .toBe(2)
    expect(tapes[0].binary)
      .toBe("0101")
    expect(tapes[1].binary)
      .toBe("1010")
  })
})

describe("Concat Tape", () => {
  test("Concat", () => {
    expect(createTape("0").concat([0]).binary)
      .toBe("00")
    expect(createTape("0").concat([1]).binary)
      .toBe("01")
    expect(createTape("10").concat([1, 0, 1]).binary)
      .toBe("10101")
  })
})
