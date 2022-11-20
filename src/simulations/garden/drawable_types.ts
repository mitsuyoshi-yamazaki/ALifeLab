import { Life } from "./life"
import { Terrain } from "./terrain"
import { World } from "./world"

type AnyDrawable = World | Terrain | Life

export type AnyDrawableStates = ReturnType<AnyDrawable["drawableState"]>
