import { BinaryRule, State } from "../../../src/simulations/hex_cellular_automata/rule"

describe("Instantiate", () => {
  test("Succeed", () => {
    const rule1 = new BinaryRule("a:1;s:0")
    const rule2 = new BinaryRule("a:0,1;s:2,3")

    expect(rule1.alive).toStrictEqual([1])
    expect(rule1.stay).toStrictEqual([0])
    expect(rule2.alive).toStrictEqual([0, 1])
    expect(rule2.stay).toStrictEqual([2, 3])
  })

  test("Empty condition", () => {
    const rule1 = new BinaryRule("a:1;s:")
    const rule2 = new BinaryRule("a:;s:1")
    const rule3 = new BinaryRule("a:;s:")

    expect(rule1.alive).toStrictEqual([1])
    expect(rule1.stay).toStrictEqual([])
    expect(rule2.alive).toStrictEqual([])
    expect(rule2.stay).toStrictEqual([1])
    expect(rule3.alive).toStrictEqual([])
    expect(rule3.stay).toStrictEqual([])
  })

  test("Invalid format", () => {
    expect(() => new BinaryRule("")).toThrow()
    expect(() => new BinaryRule("a")).toThrow()
    expect(() => new BinaryRule("a:")).toThrow()
    expect(() => new BinaryRule("a:1")).toThrow()
    expect(() => new BinaryRule("a:1;")).toThrow()
    expect(() => new BinaryRule("a:1;s")).toThrow()
    expect(() => new BinaryRule("a:a;s:1")).toThrow()
    expect(() => new BinaryRule("a:1;s:a")).toThrow()
  })
  
  test("Invalid neighbour count", () => {
    expect(() => new BinaryRule("a:-1;s:1")).toThrow()
    expect(() => new BinaryRule("a:1;s:-1")).toThrow()
    expect(() => new BinaryRule("a:7;s:1")).toThrow()
    expect(() => new BinaryRule("a:1;s:7")).toThrow()
  })
})

describe("Transition", () => {
  test("nextBit()", () => {
    const rule = new BinaryRule("a:2,3;s:3")

    expect(rule.nextBit(0, 0)).toBe(0)
    expect(rule.nextBit(0, 1)).toBe(0)
    expect(rule.nextBit(0, 2)).toBe(1)
    expect(rule.nextBit(0, 3)).toBe(1)
    expect(rule.nextBit(0, 4)).toBe(0)
    expect(rule.nextBit(0, 5)).toBe(0)
    expect(rule.nextBit(0, 6)).toBe(0)

    expect(rule.nextBit(1, 0)).toBe(0)
    expect(rule.nextBit(1, 1)).toBe(0)
    expect(rule.nextBit(1, 2)).toBe(0)
    expect(rule.nextBit(1, 3)).toBe(1)
    expect(rule.nextBit(1, 4)).toBe(0)
    expect(rule.nextBit(1, 5)).toBe(0)
    expect(rule.nextBit(1, 6)).toBe(0)
  })

  test("neighbourSum()", () => {
    const rule = new BinaryRule("a:2,3;s:3")
    const map: State = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
    ]

    expect(rule.neighbourSum(map, 0, 0)).toBe(2)
    expect(rule.neighbourSum(map, 1, 0)).toBe(3)
    expect(rule.neighbourSum(map, 2, 0)).toBe(1)
    expect(rule.neighbourSum(map, 0, 1)).toBe(2)
    expect(rule.neighbourSum(map, 1, 1)).toBe(2)
    expect(rule.neighbourSum(map, 2, 1)).toBe(2)
    expect(rule.neighbourSum(map, 0, 2)).toBe(2)
    expect(rule.neighbourSum(map, 1, 2)).toBe(2)
    expect(rule.neighbourSum(map, 2, 2)).toBe(2)
  })

  test("next()", () => {
    const rule = new BinaryRule("a:2,3;s:3")
    const map: State = [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 0],
    ]
    const expected: State = [
      [1, 1, 0],
      [1, 0, 0],
      [1, 0, 1],
    ]

    expect(rule.next(map)).toStrictEqual(expected)
  })
})
