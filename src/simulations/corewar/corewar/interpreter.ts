import { Core } from "./core"
import { cloneMemory, compute, ExecutionResult, isInstruction, isZeroValue } from "./instruction"

export const interpret = (core: Core, pointer: number): ExecutionResult => {
  const instruction = core.core[pointer]
  if (!isInstruction(instruction)) {
    return {
      result: "failed",
      failureReason: "raw data",
    }
  }

  const p = (relativePointer: number): number => (pointer + relativePointer) % core.coreSize

  switch (instruction.opecode.opecode) {
  case "add":
    // .ab実装
    core.core[p(instruction.operandA.operand)] = compute(core.core[p(instruction.operandA.operand)], value => value + instruction.operandB.operand, ".b")
    return {
      result: "succeeded",
      newPointer: p(+1),
    }
      
  case "mov":
    core.core[p(instruction.operandB.operand)] = cloneMemory(core.core[p(instruction.operandA.operand)])
    return {
      result: "succeeded",
      newPointer: p(+1),
    }
      
  case "jmp":
    return {
      result: "succeeded",
      newPointer: p(instruction.operandA.operand),
    }
      
  case "jmz":
    if (isZeroValue(core.core[p(instruction.operandB.operand)])) {
      return {
        result: "succeeded",
        newPointer: p(instruction.operandA.operand),
      }
    }
    return {
      result: "succeeded",
      newPointer: p(+1),
    }

  case "dat":
    return {
      result: "failed",
      failureReason: "dat",
    }
  }
}

/*
// Bomber
start   add.ab  #4, bmb
        mov.i   bmb, @bmb
        jmp     start
bmb     dat     #0, #0

// Scanner
scn add   #10, ptr
ptr jmz.f scn, 5
    mov.i 2, >ptr
    jmp   -1
*/