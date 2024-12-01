const opecodes = [
  "add",
  "mov",
  "jmp",
  "jmz",
  "dat",
] as const
export type RawOpecode = typeof opecodes[number]


const modifiers = [
  ".a",
  ".b",
  ".ab",
  ".ba",
] as const
export type Modifier = typeof modifiers[number]

export type OperandType = ".a" | ".b"


export type Opecode = {
  readonly opecode: RawOpecode
  readonly modifier: Modifier
}


const addressingModes = [
  "#", // Immediate
  // "$", // Direct
  // "*", // A Indirect
  // "@", // B Indirect
  // "{", // A Pre-decrement Indirect
  // "}", // A Post-increment Indirect
  // "<", // B Pre-decrement Indirect
  // ">", // B Post-increment Indirect
] as const
export type AddressingMode = typeof addressingModes[number]

export type Operand = {
  operand: number
  readonly addressingMode: AddressingMode
}


export type Instruction = {
  readonly opecode: Opecode

  readonly operandA: Operand
  readonly operandB: Operand
}
export type Data = number

export type CoreMemory = Instruction | Data

export const cloneMemory = (memory: CoreMemory): CoreMemory => {
  if (isInstruction(memory)) {
    return {...memory}
  }
  return memory
}

export const isInstruction = (memory: CoreMemory): memory is Instruction => !(typeof memory === "string")

export const isZeroValue = (memory: CoreMemory): boolean => {
  if (isInstruction(memory)) {
    return memory.operandA.operand === 0 && memory.operandB.operand === 0
  }
  return memory === 0
}

export const compute = (memory: CoreMemory, computation: (value: number) => number, operandType: OperandType): CoreMemory => {
  if (!isInstruction(memory)) {
    return computation(memory)
  } 

  switch (operandType) {
  case ".a":
    memory.operandA.operand = computation(memory.operandA.operand)
    return memory
  case ".b":
    memory.operandB.operand = computation(memory.operandB.operand)
    return memory
  }
}


export type ExecutionResult = {
  readonly result: "succeeded"
  readonly newPointer: number
} | {
  readonly result: "failed"
  readonly failureReason: "dat" | "raw data"
}