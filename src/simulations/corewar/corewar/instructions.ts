import { Instruction } from "./instruction"

export const Dat: Instruction = {
  opecode: {
    opecode: "dat",
    modifier: ".a",
  },
  operandA: {
    addressingMode: "#",
    operand: 0,
  },
  operandB: {
    addressingMode: "#",
    operand: 0,
  },
}