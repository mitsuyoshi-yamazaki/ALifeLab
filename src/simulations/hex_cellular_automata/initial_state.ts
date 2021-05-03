const initialStateTypes = ["random", "one", "line"] as const
export type InitialState = typeof initialStateTypes[number]

export const isInitialState = (obj: any): obj is InitialState => {
  return initialStateTypes.includes(obj)
}