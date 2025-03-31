import { ResourceType } from "./objects/resource"

export class ResourceStore {
  private readonly resources = new Map<ResourceType, number>()

  public constructor() {
  }

  public storedResourceTypes(): ResourceType[] {
    return Array.from(this.resources.keys())
  }

  public getAmount(resourceType: ResourceType): number {
    return this.resources.get(resourceType) ?? 0
  }

  /** @throws */
  public withdraw(resourceType: ResourceType, withdrawAmount: number): void {
    const amount = this.getAmount(resourceType) - withdrawAmount
    if (amount < 0) {
      throw `amount < 0 (${amount} - ${withdrawAmount})`  // TODO: リクエストタイプのトランザクションを実装する
    }
    this.resources.set(resourceType, amount)
  }

  public transfer(resourceType: ResourceType, transferAmount: number): void {
    const amount = this.getAmount(resourceType) + transferAmount
    this.resources.set(resourceType, amount)
  }
}
