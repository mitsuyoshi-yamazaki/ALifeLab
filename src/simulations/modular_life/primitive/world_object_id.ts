let id = 0

export const createId = (): number => {
  const newId = id
  id += 1
  return newId
}