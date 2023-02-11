import { Result } from "../../classes/result"
import { EnergySource } from "./energy_source"
import * as Module from "./module"

// TODO: 具体型を指定している部分をインターフェースに置き換える

type EnergyTransactionResult = Result<number, string>
type EnergyTransaction = {
  (from: EnergySource, to: Module.Hull): EnergyTransactionResult
}

export const energyTransaction: EnergyTransaction = (...args: [EnergySource, Module.Hull]) => {
  return fromEnergySourceToHull(args[0], args[1])
}

const fromEnergySourceToHull = (energySource: EnergySource, hull: Module.Hull): EnergyTransactionResult => {
  if (energySource.energyAmount <= 0) {
    return Result.Failed(`EnergySource at ${energySource.position} is empty`)
  }

  const transferAmount = energySource.energyAmount
  energySource.harvest(transferAmount)
  hull.addEnergy(transferAmount)

  return Result.Succeeded(transferAmount)
}