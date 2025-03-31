import { LifeApi } from "../api/api"
import { LifeCode, LifeStatus } from "./life_code"

export class RandomMoveCode implements LifeCode {
  public run(status: LifeStatus, api: LifeApi): void {
  }
}