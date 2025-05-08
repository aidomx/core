import { getGhostMapById, listenerMap, setGhostMap } from '@/_caches'
import { eventMaps } from '@/_maps'
import { GHOST_KEY_RULES } from '@/constants'
import type { Design, RuleComponent, Use } from '@/types'
import { logWarning } from '@/utils'

export const useRules = (
  el: RuleComponent,
  { name, maps }: Use
): RuleComponent => {
  if (!name || !maps || !el) {
    logWarning(`Invalid useRules call for "${name}".`)
    return el
  }

  const handlers = []

  // Handle single function case (future support?)
  if (!Array.isArray(maps) && typeof maps === 'function') {
    if (typeof maps() === 'object' && maps() !== null) {
      handlers.push(maps())
    } else {
      logWarning(`Function in "maps" must return a valid object.`)
    }
  }

  if (Array.isArray(maps)) {
    handlers.push(...maps)
  }

  const flattened = handlers
    .map((mapItem) =>
      Object.entries(mapItem)
        .filter(([event]) => eventMaps.includes(event))
        .map(([event, fn]) => [event, wrap(el, fn)])
    )
    .flat()

  if (flattened.length > 0) {
    const wrapped = Object.fromEntries(flattened)
    el.listeners = { ...(el.listeners ?? {}), ...wrapped }

    if (Array.isArray(name)) {
      const n = name.find((n) => el.name === n)
      if (!n) return {}
      listenerMap.set(n, wrapped)
    } else {
      listenerMap.set(name, wrapped)
    }
  } else {
    logWarning(`No valid listeners mapped for "${name}".`)
  }

  return el
}

const proxyTarget = () => {
  let currentTarget: RuleComponent | undefined

  return {
    get: (id: string) => {
      const ghost = getGhostMapById(id)

      if (!ghost) {
        logWarning(`Component with ${id} is not found.`)
        return {}
      }

      currentTarget = {
        ...ghost,
        ...proxyTarget(),
      }

      return currentTarget
    },

    has: (cls: string) => {
      const { className = '' } = getDesign(currentTarget)
      return className.split(/\s+/).includes(cls)
    },

    add: (cls: string) => {
      const design = getDesign(currentTarget)

      if (!design.className?.includes(cls)) {
        design.className = `${design.className || ''} ${cls}`.trim()
        if (currentTarget) debounceGhostUpdate(currentTarget)
      }
    },

    remove: (cls: string) => {
      const design = getDesign(currentTarget)
      design.className = (design.className || '')
        .split(/\s+/)
        .filter((c) => c !== cls)
        .join(' ')
      if (currentTarget) debounceGhostUpdate(currentTarget)
    },

    update: (classes: string[]) => {
      const design = getDesign(currentTarget)
      design.className = classes.join(' ')
      if (currentTarget) debounceGhostUpdate(currentTarget)
    },

    reset: () => {
      const design = getDesign(currentTarget)
      design.className = ''
      if (currentTarget) debounceGhostUpdate(currentTarget)
    },
  }
}

const getDesign = (rule?: RuleComponent) => rule?.design ?? ({} as Design)

export const wrap = (ghost: RuleComponent, handler: Function) => {
  return (e?: Event) => {
    const event = e ?? {}

    return handler(
      Object.assign(event, {
        ...ghost,
        ...proxyTarget(),
      })
    )
  }
}

// Safe for browser (not NodeJS)
const pendingUpdates = new Map<string, RuleComponent>()
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const debounceGhostUpdate = (ghost: RuleComponent, delay = 100) => {
  if (!ghost?.name) return

  // const ghostId = getGhostId(ghost.name)
  pendingUpdates.set(ghost.name, ghost)

  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    for (const [_id, g] of pendingUpdates) {
      setGhostMap(GHOST_KEY_RULES, [g])
    }
    pendingUpdates.clear()
  }, delay)
}
