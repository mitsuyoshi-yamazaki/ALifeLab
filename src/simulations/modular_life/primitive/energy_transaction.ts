import { Result } from "../../../classes/result"
import { StringConvertible } from "./utility"

// TODO: 熱の概念を追加する：消費されたエネルギーは熱になる
// export type EnergyConsumable = {
//   readonly heat: number
//   addHeat(amount: number): void
// }

export type EnergyWithdrawable = {
  readonly energyAmount: number
  withdrawEnergy(amount: number): Result<void, string>
} & StringConvertible// & EnergyConsumable

export type EnergyTransferable = {
  transferEnergy(amount: number): Result<void, string>
} & StringConvertible// & EnergyConsumable

type EnergyTransactionResult = Result<number, string>

export const energyTransaction = (from: EnergyWithdrawable, to: EnergyTransferable): EnergyTransactionResult => {
  const transferAmount = from.energyAmount
  from.withdrawEnergy(transferAmount) // FixMe: failした場合の処理
  to.transferEnergy(transferAmount)

  return Result.Succeeded(transferAmount)
}

// export const consumeEnergy = (obj: EnergyWithdrawable, amount: number): Result<void, string> => {
  
// }

// const convertEnergyToHeat = (energyAmount: number): number => {
//   return Math.ceil(energyAmount / 10)
// }