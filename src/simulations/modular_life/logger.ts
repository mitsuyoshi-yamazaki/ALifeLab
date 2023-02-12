const logLevels = [
  "debug",
  "info",
  "warning",
  "error",
] as const 

export type LogLevel = typeof logLevels[number]

export const isLogLevel = (value: string): value is LogLevel => {
  return (logLevels as readonly string[]).includes(value)
}

const logPriority: { [K in LogLevel]: number } = {
  debug: 100,
  info: 200,
  warning: 300,
  error: 400,
}

export class Logger {
  public get logLevel(): LogLevel {
    return this._logLevel
  }
  public set logLevel(level: LogLevel) {
    this._logLevel = level
    this.logPriority = logPriority[level]
  }
  public enabled = false

  private _logLevel: LogLevel = "warning"
  private logPriority = logPriority.warning

  public log(level: LogLevel, message: string): void {
    if (this.enabled !== true) {
      return
    }
    if (logPriority[level] < this.logPriority) {
      return
    }

    switch (level) {
    case "debug":
      console.debug(message)
      break
    case "info":
      console.info(message)
      break
    case "warning":
      console.warn(message)
      break
    case "error":
      console.error(message)
      break
    }
  }

  public debug(message: string): void {
    this.log("debug", message)
  }

  public info(message: string): void {
    this.log("info", message)
  }

  public warning(message: string): void {
    this.log("warning", message)
  }

  public error(message: string): void {
    this.log("error", message)
  }
}