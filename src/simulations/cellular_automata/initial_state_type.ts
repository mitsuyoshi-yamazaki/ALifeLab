const initialStateTypes = [
  // 一様にランダム
  "random",

  // 中心の1セルのみ1
  "one",

  // 中心の1行のみ1
  "line",

  // 半分が1
  "half",

  // 1,0の割合が段階的に変化
  "gradation",

  // 状態の偏りに局所性がある
  "locality",
] as const
export type InitialStateType = typeof initialStateTypes[number]

export const isInitialStateType = (obj: any): obj is InitialStateType => {
  return initialStateTypes.includes(obj)
}