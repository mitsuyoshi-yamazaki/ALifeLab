type Succeeded<T> = {
  readonly resultType: "succeeded"
  readonly value: T
}

type Failed<T> = {
  readonly resultType: "failed"
  readonly reason: T
}

export type Result<T, U> = Succeeded<T> | Failed<U>
export const Result = {
  Succeeded<T>(value: T): Succeeded<T> {
    return {
      resultType: "succeeded",
      value,
    }
  },

  Failed<T>(reason: T): Failed<T> {
    return {
      resultType: "failed",
      reason,
    }
  },
}