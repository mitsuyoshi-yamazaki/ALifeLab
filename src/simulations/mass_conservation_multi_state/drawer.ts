import { Vector } from "../../classes/physics"
import { World } from "./world"

export interface Drawer {
  drawWorld(world: World): void
  drawDistanceTransform(result: any, worldSize: Vector, cellSize: number): void
}