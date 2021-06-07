import {
  Transition,
  TransitionInstance,
  TransitionStruct,
  TransitionPattern,
  analyzeTransition,
  concatTransitions,
  extractPatterns,
  aggregatePatterns,
  identifyPattern,
} from "../../../src/simulations/drawer/transition_colored_model"

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

describe("Patterns", () => {
  const child1 = new TransitionStruct("C")
  const child2 = new TransitionStruct([child1, "D"], 3)
  const child3 = new TransitionStruct([child1, "D"], 5)
  const child4 = new TransitionStruct([child2, "E"], 2)
  const transition1 = new TransitionStruct(["A", "B", child3, child4], 2)
  const transition2 = new TransitionStruct(["C"], 2)

  test("extractPatterns()", () => {
    const patterns = extractPatterns(transition1).sort()

    expect(patterns.length).toBe(4)

    expect(patterns[0].pattern).toBe("A,B,(C,D)^5,((C,D)^3,E)^2")
    expect(patterns[0].minCount).toBe(2)
    expect(patterns[0].maxCount).toBe(2)
    expect(patterns[0].count).toBe(1)

    expect(patterns[1].pattern).toBe("C,D")
    expect(patterns[1].minCount).toBe(5)
    expect(patterns[1].maxCount).toBe(5)
    expect(patterns[1].count).toBe(1)

    expect(patterns[2].pattern).toBe("(C,D)^3,E")
    expect(patterns[2].minCount).toBe(2)
    expect(patterns[2].maxCount).toBe(2)
    expect(patterns[2].count).toBe(1)

    expect(patterns[3].pattern).toBe("C,D")
    expect(patterns[3].minCount).toBe(3)
    expect(patterns[3].maxCount).toBe(3)
    expect(patterns[3].count).toBe(1)
  })

  test("aggregatePatterns()", () => {
    const patterns = aggregatePatterns([transition1, transition2]).sort()

    expect(patterns.length).toBe(4)

    expect(patterns[0].pattern).toBe("A,B,(C,D)^5,((C,D)^3,E)^2")
    expect(patterns[0].minCount).toBe(2)
    expect(patterns[0].maxCount).toBe(2)
    expect(patterns[0].count).toBe(1)

    expect(patterns[1].pattern).toBe("C,D")
    expect(patterns[1].minCount).toBe(3)
    expect(patterns[1].maxCount).toBe(5)
    expect(patterns[1].count).toBe(2)

    expect(patterns[2].pattern).toBe("(C,D)^3,E")
    expect(patterns[2].minCount).toBe(2)
    expect(patterns[2].maxCount).toBe(2)
    expect(patterns[2].count).toBe(1)

    expect(patterns[3].pattern).toBe("C")
    expect(patterns[3].minCount).toBe(2)
    expect(patterns[3].maxCount).toBe(2)
    expect(patterns[3].count).toBe(1)
  })
})

describe("identifyPattern()", () => {
  test("", () => {
    const createPattern = (transitions: TransitionInstance[], count?: number): TransitionPattern => {
      const transition = new TransitionStruct(transitions, count ?? 1)
      return {
        pattern: transition.pattern(),
        expandedPattern: transition.expandedPattern(),
        minCount: 1,
        maxCount: 1,
        count: 1,
      }
    }

    const pattern1 = createPattern(["A", "B"])
    const pattern2 = createPattern(["B", "A"])
    const pattern3 = createPattern(["A", "C"])
    const pattern4 = createPattern(["A", "B"], 3)
    const pattern5 = createPattern(["B", "A"], 3)
    const pattern6 = createPattern(["A", "B", "A", "B", "A", "B"])
    const pattern7 = createPattern(["A", "B"], 2)
    const pattern8 = createPattern(["B", "A"], 2)

    expect(identifyPattern(pattern1, pattern2)).toBe(true)
    expect(identifyPattern(pattern1, pattern3)).toBe(false)
    expect(identifyPattern(pattern4, pattern5)).toBe(true)
    expect(identifyPattern(pattern4, pattern6)).toBe(false) // pattern6のように折りたたまれていないパターンは不正なため
    expect(identifyPattern(pattern4, pattern7)).toBe(true)
    expect(identifyPattern(pattern4, pattern8)).toBe(true)
  })
})

