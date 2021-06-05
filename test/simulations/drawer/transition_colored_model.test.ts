import { TransitionStruct, analyzeTransition, concatTransitions } from "../../../src/simulations/drawer/transition_colored_model"

describe("TransitionStruct", () => {
  test("Instantiate", () => {
    const struct = new TransitionStruct("A")

    expect(() => new TransitionStruct("A")).not.toThrow()
    expect(() => new TransitionStruct([struct], 1)).not.toThrow()
    expect(() => new TransitionStruct(["A"], 1)).not.toThrow()
    expect(() => new TransitionStruct([struct, "A"], 1)).not.toThrow()
    // expect(() => new TransitionStruct(["A"], undefined)).toThrow() // コンパイルエラーするため問題ない
  })

  test("toString()", () => {
    // TODO:
  })
})

describe("concatTransitions()", () => {
  test("", () => {
    expect(concatTransitions(["A"]).toString()).toBe("A")
    expect(concatTransitions(["A", "A"]).toString()).toBe("A,A")
    expect(concatTransitions(["A", "B"]).toString()).toBe("A,B")
    expect(concatTransitions(["A", "B", "C"]).toString()).toBe("A,B,C")
    expect(concatTransitions(["A", "B", "A", "B"]).toString()).toBe("A,B,A,B")
  })
})

describe("analyzeTransition()", () => {
  test("", () => {
    expect(analyzeTransition(["A"]).toString()).toBe("A")
    expect(analyzeTransition(["A", "A"]).toString()).toBe("A^2")
    expect(analyzeTransition(["A", "B"]).toString()).toBe("A,B")
    expect(analyzeTransition(["A", "A", "A"]).toString()).toBe("A^3")
    expect(analyzeTransition(["A", "B", "A", "B"]).toString()).toBe("(A,B)^2")
    expect(analyzeTransition(["A", "B", "A", "B", "A", "B"]).toString()).toBe("(A,B)^3")
    expect(analyzeTransition(["A", "B", "C", "A", "B", "C"]).toString()).toBe("(A,B,C)^2")

    expect(analyzeTransition(["A", "A", "B"]).toString()).toBe("A^2,B")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "B"]).toString()).toBe("(A^2,B)^2")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "B", "A", "B"]).toString()).toBe("(A^2,B)^2,A,B")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "A", "B"]).toString()).toBe("A^2,B,A^3,B")
    expect(analyzeTransition(["A", "A", "B", "C", "A", "A", "B", "C"]).toString()).toBe("(A^2,B,C)^2")
  })
})
