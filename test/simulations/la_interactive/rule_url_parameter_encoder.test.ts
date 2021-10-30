import { Vector } from "../../../src/classes/physics"
import { VanillaLSystemRule } from "../../../src/simulations/drawer/vanilla_lsystem_rule"
import { CodableRuleInfo, encodeRule } from "../../../src/simulations/la_interactive/rule_url_parameter_encoder"

const decodedRuleInfo1: CodableRuleInfo = {
  position: new Vector(15, 32),
  angle: 67,
  lineCount: 5000,
  rule: new VanillaLSystemRule("A:-88,A,-152,A"),
}
const decodedRuleInfo2: CodableRuleInfo = {
  position: new Vector(1, 2),
  angle: 3,
  lineCount: 10000,
  rule: new VanillaLSystemRule("A:65,C,1,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A"),
}

const encodedRuleInfo1 = "15;;32;;67;;5000;;A:-88,A,-152,A"
const encodedRuleInfo2 = "1;;2;;3;;10000;;A:65,C,1,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A"

// TODO: ResultとObjectのテストを作る必要がある
// describe("Decode", () => {
//   test("", () => {
//     expect(decodeRule(encodedRuleInfo1)).toBe([decodedRuleInfo1])
//   })

//   test("", () => {
//     expect(decodeRule(`${encodedRuleInfo1};;${encodedRuleInfo2}`)).toBe([decodedRuleInfo1, decodedRuleInfo2])
//   })
// })

describe("Encode", () => {
  test("", () => {
    expect(encodeRule([decodedRuleInfo1])).toBe(encodedRuleInfo1)
  })

  test("", () => {
    expect(encodeRule([decodedRuleInfo1, decodedRuleInfo2])).toBe(`${encodedRuleInfo1};;${encodedRuleInfo2}`)
  })
})

