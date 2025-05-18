const warnState = new WeakSet<object>()

export const isWarn = (message: string, target?: object) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      if (target) {
        if (!warnState.has(target)) {
          warnState.add(target)
          console.warn(message)
        }
      } else {
        console.warn(message)
      }
    }
  } catch (e) {
    console.warn(`${message} with ${(e as Error).message}`)
  }
}

export const logWarning = (msg: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[WARN]: ${msg}`)
  }
}
