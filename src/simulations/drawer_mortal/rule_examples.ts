export interface RuleDescription {
  name: string,
  rule: string,
}

export const exampleRules: RuleDescription[] = [
  {
    name: "Chain",  // 減少
    rule: "A:-116,F,-136,F,-34,E,79,A,26,D;F:-58,A;E:.;D:.",
  },
  {
    name: "Flower",  // 減少
    rule: "A:173,A,45,B,74,A;B:-13,B",
  },
  {
    name: "蜂", // 平衡
    rule: "A:107,F,28,B,127,D;F:145,A;B:41,F;D:-143,B,-34,B,-17,C,120,C;C:-67,A,-74,E;E:.",
  },
  {
    name: "風車",
    rule: "A:36,W;W:-126,B,96,P;B:71,O;P:.;O:11,H,136,K;H:165,U;K:-79,O;U:-26,W,141,L,66,A;L:68,U,-2,M,134,B,-40,V,-177,Q;M:38,A;V:.;Q:.",
  }
  // {
  //   name: "Disks",  // 微増
  //   rule: "A:-13,D,-108,C;D:-16,A;C:46,A",
  // },
  // {
  //   name: "Feather",  // 微増
  //   rule: "A:-153,B;B:-161,H,103,B,-166,A;H:.",
  // },
  // {
  //   name: "紐", // 増殖・平衡
  //   rule: "A:68,D;D:152,D,113,Q;Q:-74,S;S:92,J;J:-100,D",
  // }
]
