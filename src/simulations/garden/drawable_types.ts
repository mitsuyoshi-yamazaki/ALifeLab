import { Life } from "./life"
import { World } from "./world"

type AnyDrawable = World | Life

export type AnyDrawableStates = ReturnType<AnyDrawable["drawableState"]>
