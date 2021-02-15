import { Bit, Tape } from "../tape"

function createTape(binaryString: string): Tape {
  return new Tape(binaryToBits(binaryString))
}

function binaryToBits(binaryString: string): Bit[] {
  return binaryString.split("")
    .map(x => x === "1" ? 1 : 0)
}

test("Construct Tape", () => {
  expect(createTape("0").value)
    .toBe(0)
  expect(2)
    .toBe(3)
})
