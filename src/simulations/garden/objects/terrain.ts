import { ResourceStore } from "../resource_store"

// Terrainという形が良いのかどうか
// TODO: 中身を変更できるようにする
export class Terrain {
  public readonly resourceStore = new ResourceStore()

  public constructor(
  ) {
  }

  public run(neighbours: Terrain[]): void {
    neighbours.forEach(neighbour => {
      const diff = neighbour.resourceStore.getAmount("energy") - this.resourceStore.getAmount("energy")
      const transferAmount = 
    })
  }
}