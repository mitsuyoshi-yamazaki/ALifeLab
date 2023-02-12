type ParameterType = "string" | "int" | "float" | "boolean"
type Parameter<T extends ParameterType> = T extends "string" ? string :
  T extends "int" ? number :
  T extends "float" ? number :
  T extends "boolean" ? boolean :
  never

const parser: { [T in ParameterType]: ((value: string) => Parameter<T>) } = {
  string: (value: string) => value,
  int: (value: string) => {
    const intValue = parseInt(value, 10)
    if (isNaN(intValue) === true) {
      throw `${value} is not an integer number`
    }
    return intValue
  },
  float: (value: string) => {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue) === true) {
      throw `${value} is not an floating point number`
    }
    return floatValue
  },
  boolean: (value: string) => {
    switch (value) {
    case "0":
      return false
    case "1":
      return true
    default:
      throw `set 0 or 1 (${value} given)`
    }
  },
}

export class URLParameterParser {
  private rawParameters = new Map<string, string>()

  public constructor(rawQuery: string) {
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

  /** @throws */
  public parseString(key: string, alternativeKey?: string): string | null {
    return this.parse("string", key, alternativeKey)
  }

  /** @throws */
  public parseTypedString<T extends string>(key: string, typeName: string, typeGuard: (value: string) => value is T, alternativeKey?: string): T | null {
    const parsedString = this.parse("string", key, alternativeKey)
    if (parsedString == null) {
      return null
    }

    if (!(typeGuard(parsedString))) {
      throw `${parsedString} is not ${typeName}`
    }
    return parsedString
  }

  /** @throws */
  public parseInt(key: string, alternativeKey?: string): number | null {
    return this.parse("int", key, alternativeKey)
  }

  /** @throws */
  public parseFloat(key: string, alternativeKey?: string): number | null {
    return this.parse("float", key, alternativeKey)
  }

  /** @throws */
  public parseBoolean(key: string, alternativeKey?: string): boolean | null {
    return this.parse("boolean", key, alternativeKey)
  }

  /** @throws */
  public parseList<T extends ParameterType>(parameterType: T, key: string, alternativeKey?: string): Parameter<T>[] | null {
    const value = this.getValueFor(key, alternativeKey)
    if (value == null) {
      return null
    }

    const components = value.split(",")
    return components.flatMap((component): Parameter<T>[] => {
      return [this.parseValue(parameterType, component)]
    })
  }

  /** @throws */
  private parse<T extends ParameterType>(parameterType: T, key: string, alternativeKey?: string): Parameter<T> | null {
    const value = this.getValueFor(key, alternativeKey)
    if (value == null) {
      return null
    }

    try {
      return this.parseValue(parameterType, value)
    } catch (error) {
      const keyname = ((): string => {
        if (this.rawParameters.has(key) === true) {
          return key
        }
        return alternativeKey ?? key
      })()
      alert(`${keyname}: ${error}`)
      throw error
    }
  }

  private getValueFor(key: string, alternativeKey?: string): string | null {
    const value = this.rawParameters.get(key)
    if (value != null) {
      return value
    }

    if (alternativeKey == null) {
      return null
    }
    return this.rawParameters.get(alternativeKey) ?? null
  }

  /** @throws */
  private parseValue<T extends ParameterType>(parameterType: T, value: string): Parameter<T> {
    const valueParser = parser[parameterType]
    return valueParser(value)
  }
}