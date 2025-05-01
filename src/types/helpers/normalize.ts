export type RoutesMap =
  | Record<string, string[]>
  | { pathname: string; name: string[] }[]

export type NormalizeRules = {
  pathname: string
  name: string[]
}
