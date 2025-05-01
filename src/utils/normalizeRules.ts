import type { NormalizeRules, RoutesMap } from '@/types'

export const normalizeRules = (routes: RoutesMap): NormalizeRules[] => {
  if (Array.isArray(routes)) return routes

  return Object.entries(routes).map(([pathname, name]) => ({
    pathname,
    name,
  }))
}
