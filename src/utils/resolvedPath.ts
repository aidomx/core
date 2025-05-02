import type { Rules } from '@/types'
import { normalizeRules } from './normalizeRules'

/**
 * Check if a component with given `name` is allowed to render
 * based on current `window.location.pathname`, comparing it with
 * `rules.routes` or fallback to `rules.root`.
 *
 * @param name - The name identifier of the component.
 * @param rules - The rules configuration to evaluate against.
 * @returns True if the component is allowed to render, false otherwise.
 */
export const resolvedPath = (name: string, rules: Rules): boolean => {
  if (rules?.debug) return true

  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname

    // Check against rules.routes
    if (rules?.routes) {
      if (Array.isArray(rules.routes)) return false

      const routes = normalizeRules(rules.routes)
      const matchedRoute = routes.some(
        (route) => route.name.includes(name) && route.pathname === pathname
      )
      if (matchedRoute) return true
    }

    // Check against rules.root
    if (rules?.root) {
      if (typeof rules.root === 'string') {
        return rules.root === pathname
      }
      if (Array.isArray(rules.root)) {
        return rules.root.includes(pathname)
      }
    }
  }

  return false
}
