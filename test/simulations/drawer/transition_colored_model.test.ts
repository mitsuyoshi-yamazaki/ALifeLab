import { analyzeTransition, concatTransitions } from "../../../src/simulations/drawer/transition_colored_model"

describe("concatTransitions()", () => {
  test("", () => {
    expect(concatTransitions(["A"])).toBe("A")
    expect(concatTransitions(["A", "A"])).toBe("(A,A)")
    expect(concatTransitions(["A", "B"])).toBe("(A,B)")
    expect(concatTransitions(["A", "B", "C"])).toBe("(A,B,C)")
    expect(concatTransitions(["A", "B", "A", "B"])).toBe("(A,B,A,B)")
  })
})

describe("analyzeTransition()", () => {
  test("", () => {
    expect(analyzeTransition(["A"])).toBe("A")
    expect(analyzeTransition(["A", "A"])).toBe("A^2")
    expect(analyzeTransition(["A", "B"])).toBe("(A,B)")
    expect(analyzeTransition(["A", "A", "A"])).toBe("A^3")
    expect(analyzeTransition(["A", "B", "A", "B"])).toBe("(A,B)^2")
    expect(analyzeTransition(["A", "B", "A", "B", "A", "B"])).toBe("(A,B)^3")
    expect(analyzeTransition(["A", "B", "C", "A", "B", "C"])).toBe("(A,B,C)^2")

    expect(analyzeTransition(["A", "A", "B"])).toBe("(A^2,B)")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "B"])).toBe("(A^2,B)^2")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "B", "A", "B"])).toBe("((A^2,B)^2,A,B)")
    expect(analyzeTransition(["A", "A", "B", "A", "A", "A", "B"])).toBe("(A^2,B,A^3,B)")
    expect(analyzeTransition(["A", "A", "B", "C", "A", "A", "B", "C"])).toBe("(A^2,B,C)^2")
  })
})
