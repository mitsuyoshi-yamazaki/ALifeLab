type RuleDefinition = {
  readonly name: string
  readonly rule: string
  readonly preferredLineCountMultiplier: number
}

export const exampleRuleDefinitions: RuleDefinition[] = [
  {
    name: "お気に入り",
    rule: "A:-88,A,-152,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "木",
    rule: "A:119,I,121,H,-72,B;B:.;E:43,H;F:23,B,-26,B,127,E;I:153,F,-52,H;H:-20,A,-75,I,-149,E",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "星",
    rule: "A:-142,D;C:.;D:-31,S,-117,I;I:-99,J,-95,C;H:20,L,-30,A,90,H,-50,M,-27,H;J:.;M:.;L:.;S:135,H",
    preferredLineCountMultiplier: 1,
  },
  // {  // 描画時間が長いので一時的に除外
  //   name: "落書き",
  //   rule: "A:116,E,-120,A,101,F,7,G,-99,D,-8,C;C:35,C;E:-32,F;D:.;G:-121,F,107,A;F:-122,C",
  //   preferredLineCountMultiplier: 1,
  // },
  {
    name: "羽毛1",
    rule: "A:-101,A,101,A,5,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "Caduceus1",
    rule: "A:65,C,1,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "Caduceus2",
    rule: "A:65,C,289,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "Caduceus3",
    rule: "A:65,C,250,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "Caduceus4",
    rule: "A:65,C,220,D,137,B;B:174,C;C:66,C,2,A,118,B;D:14,A",
    preferredLineCountMultiplier: 1,
  },
  // {
  //   name: "鱗",
  //   rule: "A:-28,A,117,A",
  //   preferredLineCountMultiplier: 1,
  // },
  {
    name: "ヒトデ1",
    rule: "A:55,E,-97,D;B:-55,A,104,I;E:60,I,-133,E,-144,E,55,E,15,F,-40,E,-138,A;D:.;F:-39,B,-124,I,-143,H,96,B;I:.;H:.",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "ヒトデ2",
    rule: "A:93,E;B:-113,H,-173,H,-76,E,152,C,62,C;C:-106,B;D:.;E:-34,F,-18,C,-41,B;F:-112,E,37,E,104,B;G:.;H:-155,F,130,D",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "ヒトデ3",
    rule: "A:-64,C,120,A;C:125,B;B:-122,C,155,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "珊瑚",
    rule: "A:131,B;B:51,A,141,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "オウムガイ1",
    rule: "A:58,A,2,A,-65,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "オウムガイ2",
    rule: "A:24,A,-21,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "銀杏",
    rule: "A:-12,A,25,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "化石",
    rule: "A:16,E,-41,B,-34,C;E:-172,H,167,E,141,B;B:.;C:-57,F;H:175,H,139,H,-121,D,140,H,-78,D,-65,A;F:.;D:.",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "生痕化石",
    rule: "A:30,C,87,C;C:-179,C,-52,B;B:-136,B,-5,A",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "ウミユリ",
    rule: "A:25,F,122,H,81,M;B:-155,G;D:-20,B,58,K,167,G;G:.;F:-39,N,145,F,161,J;H:.;K:.;J:.;M:104,D;N:-74,P;P:116,F,-8,P",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "ハンドスピナー",
    rule: "A:17,C,121,B,-142,A,120,A,-162,D,103,B,164,C,-106,C;C:.;B:140,B,2,B,49,B;D:-169,A,-108,D,30,D,3,D,-174,B",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "角",
    rule: "A:4,A,154,B,-60,A;B:33,B",
    preferredLineCountMultiplier: 1,
  },
  {
    name: "ウミウシ",
    rule: "A:175,B,-114,A,41,B,132,D,-54,F;B:12,D,-63,C,62,F,-32,D,-144,C,101,C;C:51,A;D:133,A;E:143,A,-44,E;F:-112,B,5,A,82,B",
    preferredLineCountMultiplier: 1,
  },
]

export const exampleRules: string[] = exampleRuleDefinitions.map(definition => definition.rule)
