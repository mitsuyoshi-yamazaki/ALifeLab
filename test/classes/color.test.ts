import { Color } from "../../src/classes/color"

describe("Construct Color", () => {
  test("Description", () => {
    expect(new Color(0x0, 0x0, 0x0, 0xFF).toString())
      .toBe("#000000")
    expect(new Color(0x10, 0x10, 0x10, 0xFF).toString())
      .toBe("#101010")
    expect(new Color(0xFF, 0xFF, 0xFF, 0xFF).toString())
      .toBe("#ffffff")
  })
})
