export const RULES_SECRET_KEY =
  typeof process !== 'undefined'
    ? (process.env.RULES_SECRET_KEY ?? 'secret')
    : 'secret'
