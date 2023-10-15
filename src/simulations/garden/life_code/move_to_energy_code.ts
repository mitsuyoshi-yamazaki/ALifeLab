import { strictEntries } from "src/classes/utilities"
import { Direction, LifeApi } from "../api/api"
import { LifeCode, LifeStatus } from "./life_code"

export class MoveToEnergyCode implements LifeCode {
  private movingDirection: Direction | null = null

  public run(status: LifeStatus, api: LifeApi): void {
    api.harvest()

    const moveDirection = ((): Direction | "here" | null => {
      const neighbourTerrains = api.lookAround()
      let maxEnergy: { position: Direction | "here", energy: number } = {
        position: "here",
        energy: getEnergyAmount(status.terrain),
      }

      strictEntries(neighbourTerrains).forEach(([direction, terrain]) => {
        const energy = getEnergyAmount(terrain)
        if (energy <= maxEnergy.energy) {
          return
        }
        maxEnergy = {
          position: direction,
          energy,
        }
      })

      if (maxEnergy.energy <= 0) {
        return null
      }
      return maxEnergy.position
    })() 

    if (moveDirection != null) {
      if (moveDirection === "here") {
        return
      }
      api.move(moveDirection)
      return
    }

    if (this.movingDirection != null) {
      api.move(this.movingDirection)
      return
    }

    // TODO:
  }
}

const getEnergyAmount = (terrain: TerrainState): number => {
  switch (terrain.case) {
  case "plain":
    return terrain.energy
  case "wall":
    return 0
  default: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _: never = terrain
    throw `implement ${(terrain as TerrainState).case}`
  }
  }
}
