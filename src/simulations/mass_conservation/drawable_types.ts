import { Cell } from "./cell"
import { World } from "./world"

type AnyDrawable = World | Cell

export type AnyDrawableStates = ReturnType<AnyDrawable["drawableState"]>
