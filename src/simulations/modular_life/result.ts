import { Result } from "../../classes/result"

export const logFailure = <T>(result: Result<T, unknown>): void => {
  switch (result.resultType) {
  case "succeeded":
    return
  case "failed":
    console.log(`${result.reason}`)
    return
  }
}