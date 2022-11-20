import { World } from "./world"

type DummyDrawableState = {
  readonly case: "dummy"
}

type AnyDrawable = World

export type AnyDrawableStates = ReturnType<AnyDrawable["drawableState"]> | DummyDrawableState
