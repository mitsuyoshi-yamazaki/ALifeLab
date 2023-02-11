type ParameterType = "string" | "int" | "float" | "boolean"
type Parameter<T extends ParameterType> = T extends "string" ? string :
  T extends "int" ? number :
  T extends "float" ? number :
  T extends "boolean" ? boolean :
  never
  
type ParserOptions<T extends ParameterType> = T extends "string" ? { min?: number, max?: number } :
  T extends "int" ? { min?: number, max?: number } :
  T extends "float" ? { min?: number, max?: number } :
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends "boolean" ? {} :
  never

const parser: { [T in ParameterType]: ((value: string, options?: ParserOptions<T>) => Parameter<T>) } = {
  string: (value: string, options?: { min?: number, max?: number }) => {
    if (options?.min != null && value.length < options.min) {
      throw `${value} is too short (minimum: ${options.min})`
    }
    if (options?.max != null && value.length > options.max) {
      throw `${value} is too long (maximum: ${options.max})`
    }
    return value
  },
  int: (value: string, options?: { min?: number, max?: number }) => {
    const intValue = parseInt(value, 10)
    if (isNaN(intValue) === true) {
      throw `${value} is not an integer number`
    }
    if (options?.min != null && intValue < options.min) {
      throw `${intValue} is too small (minimum: ${options.min})`
    }
    if (options?.max != null && intValue > options.max) {
      throw `${intValue} is too big (maximum: ${options.max})`
    }
    return intValue
  },
  float: (value: string, options?: { min?: number, max?: number }) => {
    const floatValue = parseFloat(value)
    if (isNaN(floatValue) === true) {
      throw `${value} is not an floating point number`
    }
    if (options?.min != null && floatValue < options.min) {
      throw `${floatValue} is too small (minimum: ${options.min})`
    }
    if (options?.max != null && floatValue > options.max) {
      throw `${floatValue} is too big (maximum: ${options.max})`
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
  public parseString(key: string, options?: ParserOptions<"string"> & { alternativeKey?: string }): string | null {
    return this.parse("string", key, options)
  }

  /** @throws */
  public parseTypedString<T extends string>(key: string, typeName: string, typeGuard: (value: string) => value is T, options?: { alternativeKey?: string }): T | null {
    const parsedString = this.parse("string", key, options)
    if (parsedString == null) {
      return null
    }

    if (!(typeGuard(parsedString))) {
      throw `${parsedString} is not ${typeName}`
    }
    return parsedString
  }

  /** @throws */
  public parseInt(key: string, options?: ParserOptions<"int"> & { alternativeKey?: string }): number | null {
    return this.parse("int", key, options)
  }

  /** @throws */
  public parseFloat(key: string, options?: ParserOptions<"float"> & { alternativeKey?: string }): number | null {
    return this.parse("float", key, options)
  }

  /** @throws */
  public parseBoolean(key: string, options?: ParserOptions<"boolean"> & { alternativeKey?: string }): boolean | null {
    return this.parse("boolean", key, options)
  }

  /** @throws */
  public parseList<T extends ParameterType>(parameterType: T, key: string, options?: ParserOptions<T> & { alternativeKey?: string }): Parameter<T>[] | null {
    const value = this.getValueFor(key, options?.alternativeKey)
    if (value == null) {
      return null
    }

    const components = value.split(",")
    return components.flatMap((component): Parameter<T>[] => {
      return [this.parseValue(parameterType, component, options)]
    })
  }

  /** @throws */
  private parse<T extends ParameterType>(parameterType: T, key: string, options?: ParserOptions<T> & { alternativeKey?: string }): Parameter<T> | null {
    const value = this.getValueFor(key, options?.alternativeKey)
    if (value == null) {
      return null
    }

    try {
      return this.parseValue(parameterType, value, options)
    } catch (error) {
      const keyname = ((): string => {
        if (this.rawParameters.has(key) === true) {
          return key
        }
        return options?.alternativeKey ?? key
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
  private parseValue<T extends ParameterType>(parameterType: T, value: string, options?: ParserOptions<T>): Parameter<T> {
    const valueParser = parser[parameterType]
    return valueParser(value, options)
  }
}