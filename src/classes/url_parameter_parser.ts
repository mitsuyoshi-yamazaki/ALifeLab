export type Parameter = string | number | boolean

export class URLParameterParser {
  public readonly rawParameters = new Map<string, string>()
  public readonly parameters = new Map<string, Parameter>()
  private readonly usedKeys: string[] = []

  public constructor(query?: string) {
    const rawQuery = query ?? document.location.search
    const pairs = rawQuery
      .slice(rawQuery.indexOf("?") + 1)
      .split("&")

    for (const keyValue of pairs) {
      if (keyValue === "") {
        continue
      }
      const pair = keyValue.split("=")
      this.rawParameters.set(pair[0], pair[1])
    }
  }

  public hasKey(key: string, shortKey?: string): boolean {
    if ((shortKey != undefined) && (this.rawParameters.get(shortKey) != undefined)) {
      return true
    }

    return this.rawParameters.get(key) != undefined
  }

  public int(key: string, defaultValue: number, shortKey?: string): number {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.rawParameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.rawParameters.get(key)
    }
    if (rawValue == undefined) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    const parsedValue = parseInt(rawValue, 10)
    if (isNaN(parsedValue)) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    this.parameters.set(key, parsedValue)

    return parsedValue
  }

  public float(key: string, defaultValue: number, shortKey?: string): number {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.rawParameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.rawParameters.get(key)
    }
    if (rawValue == undefined) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    const parsedValue = parseFloat(rawValue)
    if (isNaN(parsedValue)) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    this.parameters.set(key, parsedValue)

    return parsedValue
  }

  public boolean(key: string, defaultValue: boolean, shortKey?: string): boolean {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.rawParameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.rawParameters.get(key)
    }
    if (rawValue == undefined) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    const parsedValue = parseInt(rawValue, 10)
    if (isNaN(parsedValue)) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    const value = parsedValue > 0
    this.parameters.set(key, value)

    return value
  }

  public string(key: string, defaultValue: string, shortKey?: string): string {
    let rawValue: string | undefined
    if (shortKey != undefined) {
      this.usedKeys.push(shortKey)
      rawValue = this.rawParameters.get(shortKey)
    }
    this.usedKeys.push(key)
    if (rawValue == undefined) {
      rawValue = this.rawParameters.get(key)
    }
    if (rawValue == undefined) {
      this.parameters.set(key, defaultValue)

      return defaultValue
    }
    this.parameters.set(key, rawValue)

    return rawValue
  }

  public unusedKeys(): string[] {
    const allKeys = Array.from(this.rawParameters.keys())

    return allKeys.filter(k => this.usedKeys.indexOf(k) === -1)
  }

  public toURLString(): string {
    let str = "?"
    this.rawParameters.forEach((value, key) => {
      str = `${str}&${key}=${value}`
    })

    return str
  }
}
