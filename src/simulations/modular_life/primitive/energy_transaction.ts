import { Result } from "../../../classes/result"
import { StringConvertible } from "./utility"

export type EnergyWithdrawable = {
  energyAmount: number
  withdrawEnergy(amount: number): Result<void, string>
} & StringConvertible

export type EnergyTransferable = {
  transferEnergy(amount: number): Result<void, string>
} & StringConvertible

type EnergyTransactionResult = Result<number, string>
type EnergyTransaction = {
  (from: EnergyWithdrawable, to: EnergyTransferable): EnergyTransactionResult
}

export const energyTransaction: EnergyTransaction = (from: EnergyWithdrawable, to: EnergyTransferable): EnergyTransactionResult => {
  const transferAmount = from.energyAmount
  from.withdrawEnergy(transferAmount)
  to.transferEnergy(transferAmount)

  return Result.Succeeded(transferAmount)
}