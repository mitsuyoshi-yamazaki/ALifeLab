/**
 * 回転対称（異方性のないこと）
 */
export type Kernel = {
  /// 中心に近い方から（index: 0は自身）の重み
  readonly weights: number[]
}

export const minimumNeighbourKernel: Kernel = {
  weights: [
    1,
    1,
  ],
}