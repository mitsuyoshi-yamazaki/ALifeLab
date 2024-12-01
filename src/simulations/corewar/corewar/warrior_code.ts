import { Instruction } from "./instruction"

export type WarriorCode = {
  readonly name: string
  readonly code: Instruction[]
}