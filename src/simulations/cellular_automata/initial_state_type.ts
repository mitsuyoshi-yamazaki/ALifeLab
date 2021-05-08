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

  "manual",
] as const
export type InitialStateType = typeof initialStateTypes[number]

export const isInitialStateType = (obj: string): obj is InitialStateType => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return initialStateTypes.includes(obj as any)
}