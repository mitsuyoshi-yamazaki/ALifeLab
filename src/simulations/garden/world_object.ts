/**
# WorldObject
## 概要
World上に存在する物体/状態
 */

import { Vector } from "../../classes/physics"
import { Drawable, DrawableState } from "./drawable"

export interface WorldObject<State extends DrawableState> extends Drawable<State> {
  position: Vector
}
