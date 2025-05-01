export const logWarning = (msg: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[WARN]: ${msg}`)
  }
}
