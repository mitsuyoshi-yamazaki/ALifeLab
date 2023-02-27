import { Logger } from "./logger"

type Life = unknown // FixMe:

export class LifeStatistics {
  public constructor(
    public readonly logger: Logger,
  ) {
  }

  public died(life: Life, t: number): void {
    // TODO:
  }

  public added(life: Life, t: number): void {
    // TODO:
  }

  public born(life: Life, parent: Life, t: number): void {
    // TODO:
  }
}