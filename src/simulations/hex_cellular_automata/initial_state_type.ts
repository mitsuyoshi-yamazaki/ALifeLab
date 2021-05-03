const initialStateTypes = ["random", "one", "line"] as const
export type InitialStateType = typeof initialStateTypes[number]

export const isInitialStateType = (obj: any): obj is InitialStateType => {
  return initialStateTypes.includes(obj)
}