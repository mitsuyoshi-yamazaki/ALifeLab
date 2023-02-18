import { Life } from "./life"
import { Logger } from "./logger"

type LifeStatus = {
  readonly id: number
  readonly parentId: number | null
  readonly ancestorId: number
  readonly born: number
  dead: number | null
}
type DeadStatus = LifeStatus & {
  dead: number
}

export class LifeStatistics {
  private readonly deads = new Map<number, LifeStatus>()
  private readonly alive = new Map<number, LifeStatus>()

  // 死んでいるLifeのみの集計
  private longestLivedLife: DeadStatus | null = null

  public constructor(
    public readonly logger: Logger,
  ) {
  }

  public died(life: Life, t: number): void {
    const status = this.alive.get(life.id)
    if (status == null) {
      this.logger.programError(`Life ${life.id} is not recorded`)
      return
    }

    this.alive.delete(life.id)
    const deadStatus: DeadStatus = {
      ...status,
      dead: t,
    }

    if (this.longestLivedLife == null) {
      this.longestLivedLife = deadStatus
    } else {
      if (deadStatus.dead - deadStatus.born > this.longestLivedLife.dead - this.longestLivedLife.born) {
        this.longestLivedLife = deadStatus
      }
    }

    this.deads.set(life.id, deadStatus)
  }

  public added(life: Life, t: number): void {
    this.alive.set(life.id, {
      id: life.id,
      parentId: null,
      ancestorId: life.id,
      born: t,
      dead: null,
    })
  }

  public born(life: Life, parent: Life, t: number): void {
    const parentStatus = this.alive.get(parent.id)
    if (parentStatus == null) {
      this.logger.programError(`Life ${parent.id} is not recorded`)
      return
    }

    this.alive.set(life.id, {
      id: life.id,
      parentId: parent.id,
      ancestorId: parentStatus.ancestorId,
      born: t,
      dead: null,
    })
  }

  // ---- ---- //
  public getLongestLivedLifeAt(t: number): { id: number, ancestorId: number, lifetime: number } | null {
    let [lifeStatus, longestLifetime] = ((): [LifeStatus | null, number] => {
      if (this.longestLivedLife == null) {
        return [null, 0]
      }
      return [this.longestLivedLife, this.longestLivedLife.dead - this.longestLivedLife.born]
    })()

    Array.from(this.alive.entries()).forEach(([, status]) => {
      const lifetime = t - status.born
      if (lifetime < longestLifetime) {
        return
      }

      longestLifetime = lifetime
      lifeStatus = status
    })

    if (lifeStatus == null) {
      return null
    }

    return {
      id: lifeStatus.id,
      ancestorId: lifeStatus.ancestorId,
      lifetime: longestLifetime,
    }
  }
}