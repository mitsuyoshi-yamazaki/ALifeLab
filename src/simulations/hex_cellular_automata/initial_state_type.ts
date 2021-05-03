const initialStateTypes = ["random", "one", "line", "gradation"] as const
export type InitialStateType = typeof initialStateTypes[number]

export const isInitialStateType = (obj: any): obj is InitialStateType => {
  return initialStateTypes.includes(obj)
}