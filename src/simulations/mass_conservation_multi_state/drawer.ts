import { DistanceTransformResult } from "./distance_transform"
import { World } from "./world"

export interface Drawer {
  readonly cellSize: number

  drawCanvas(): void
  drawWorld(world: World): void
  drawDistanceTransform(results: DistanceTransformResult[][], cellSize: number): void
}