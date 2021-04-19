export interface RuleDescription {
  name: string,
  rule: string,
}

export const exampleRules: RuleDescription[] = [
  {
    name: "Chain",
    rule: "A:-116,F,-136,F,-34,E,79,A,26,D;F:-58,A;E:.;D:.",
  },
  {
    name: "Flower",
    rule: "A:173,A,45,B,74,A;B:-13,B",
  }
]
