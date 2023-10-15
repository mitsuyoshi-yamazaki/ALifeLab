import { Environment } from "./environment"
import { Life } from "./objects/life"
import { Terrain } from "./objects/terrain"
import { ResourceStore } from "./resource_store"

export class Cell {
  public readonly resourceStore: ResourceStore = new ResourceStore()
  public get life(): Life | null {
    return null // TODO:
  }

  public constructor(
    public readonly environment: Environment | null,
    public readonly terrain: Terrain,
  ) {
  }
}