export interface Rule {
  initialState: string
  rule: string
}

export const exampleRules: Rule[] = [
  {
    initialState: "A,-120,A,-120,A",
    rule: "A:A,60,A,-120,A,60,A", // TODO: 長さのmultiplierをルールに入れる（A:1/3A,60,1/3A,-120,1/3A,60,1/3A）
  }
]