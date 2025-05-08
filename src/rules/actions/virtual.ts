import {
  getGhostMap,
  getGhostMapById,
  getRulesMap,
  ghostMap,
  rulesMap,
  setGhostMap,
  setRulesMap,
} from '@/_caches'
import { getGhostId } from '@/constants/ghostId'
import type {
  CloneGhostLayer,
  CompileLayer,
  ConnectGhostLayer,
  CreateGhostLayer,
  CreateGhostProps,
  GhostElement,
  GhostElements,
  MaintenanceLayer,
  PullGhostLayer,
  PushGhostLayer,
  RemoveLayer,
  ResetLayer,
  RuleComponent,
  RulesConfig,
  RupaManipulator,
  SortGhostLayer,
  SpawnConfig,
  SpawnGhostsLayer,
  SpawnMapCallback,
  SummonGhostLayer,
} from '@/types'
import { createStore } from '../store'
import { clonePreserve, generateId, logWarning } from '@/utils'
import { CACHE_KEY_RULES, GHOST_KEY_RULES } from '@/constants'
import { ghostElements } from '@/_maps'

// @rules
const rules = (): RulesConfig => getRulesMap()

// @before
export const before = (id: string = '') => {
  const key = getGhostId(id)

  if (!ghostMap.has(key)) {
    ghostMap.set(key, [])
  }

  return getGhostMapById(key.replace(/^ghost-/, ''))
}

// @cloneGhost
export const cloneGhost: CloneGhostLayer = (id: string) => {
  before(id)
  const currentGhost = getGhostMap()

  const current = currentGhost?.find((item) => item.name === id)

  const newData = {
    ...current,
    name: id + '_cloned',
  }

  const cloned = clonePreserve(newData)

  if (ghostMap.has(id + '_cloned')) {
    logWarning(`Clone failed because ${id} have already cloned.`)
    return newData
  }

  currentGhost?.push(cloned ?? current)

  setGhostMap(id + '_cloned', currentGhost ?? [])
  setGhostMap(GHOST_KEY_RULES, currentGhost ?? [])

  return newData
}

// @createGhost
export const createGhost: CreateGhostLayer = (
  options: CreateGhostProps
): GhostElements => {
  try {
    if (!options || !Array.isArray(options.entries)) return []

    const entries = options.entries.map((element) => {
      const isValid = ghostElements.includes(element.design?.type ?? '')

      if (!isValid) {
        logWarning(`Tag <${element.design?.type}> is not supported.`)
      }

      if (options.autoCompile) {
        compile(element)
      }

      return element
    })

    return entries
  } catch (e) {
    logWarning(`Failed to create ghost: ${(e as Error).message}`)

    return []
  }
}

// @compile
export const compile: CompileLayer = (ghost: RuleComponent) => {
  if (!ghost || !ghost.name || !ghost.design?.type) {
    logWarning('Invalid ghost element for compilation.')
    return
  }

  const cloned = clonePreserve(ghost)

  if (rules()?.components) {
    rules()?.components?.push(cloned)
  }

  const components = rules()?.components

  if (Array.isArray(components)) {
    setGhostMap(getGhostId(ghost.name), [ghost])
    setGhostMap(GHOST_KEY_RULES, components ?? [])
    setRulesMap(CACHE_KEY_RULES, rules())
  }
}

// @connect
export const connect: ConnectGhostLayer = (
  fn: (rupa: RupaManipulator) => Promise<void> | void
) => {
  const ghost = getGhostMap()

  if (Array.isArray(ghost) && ghost.length > 0) {
    const { rupa } = createStore(rules())

    return fn(rupa)
  }
}

// @groupByName
export const groupByName = (
  ghosts: RuleComponent | RuleComponent[] | undefined
) => {
  let result: Record<string, RuleComponent> = {}

  if (!ghosts) {
    return result
  }

  ghosts.forEach((ghost: RuleComponent) => {
    if (ghost.name) {
      result[ghost.name] = ghost
    }

    return result
  })

  return result
}

export const maintenance: MaintenanceLayer = false

// @next
export const next = (data: RuleComponent[]) => {
  data.map((ghost) => compile(ghost as GhostElement))

  return data
}

/**
 * Remove all ghost entries associated with the given component ID.
 * This will directly update `rules.components` and sync the result to `rulesMap`.
 *
 * @param id - The component ID whose ghost entries should be removed.
 * @returns An empty array representing the cleared ghost data.
 * @removeGhost
 */
export const removeGhost: RemoveLayer = (id: string) => {
  const ghost = before(id)
  const currentGhost = getGhostMap() || []

  try {
    if (!ghost) {
      logWarning(`Ghost component with id ${id} not found.`)
      return false
    }

    const deleteGhost = ghostMap.delete(getGhostId(id))

    if (deleteGhost) {
      const index = currentGhost.findIndex((c) => c.name === id)
      currentGhost?.splice(index as number, 1)
      rules().components = currentGhost

      setGhostMap(GHOST_KEY_RULES, currentGhost)
      setRulesMap(CACHE_KEY_RULES, rules())

      return true
    }

    return false
  } catch (e) {
    logWarning(
      `Failed delete component with id ${id} because with error : ${(e as Error).message}`
    )
    return false
  }
}

// @resetGhost
export const resetGhost: ResetLayer = () => {
  rulesMap.clear()
  ghostMap.clear()

  if (rules()?.components) rules().components = []

  setRulesMap(CACHE_KEY_RULES, rules())

  return true
}

// @pullGhost
export const pullGhost: PullGhostLayer = (
  scope: string[] = []
): Record<string, RuleComponent | RuleComponent[]> => {
  try {
    if (!rules()) {
      logWarning('Please, setup your rules.')
      return {}
    }

    if (!rules()?.root || !rules()?.components) {
      logWarning('Invalid rules, rules is not ready used.')
      return {}
    }

    if (!Array.isArray(rules()?.components)) {
      logWarning('Rules successfully, but ghost components is not ready used.')
      return {}
    }

    const { components } = rules()

    if (scope.length > 0) {
      const filtered = scope.map((name) =>
        components?.find((c: RuleComponent) => c.name === name)
      )

      return groupByName(filtered)
    }

    return groupByName(components)
  } catch (e) {
    logWarning(`Push rules is failed with error : ${(e as Error).message}`)

    return {}
  }
}

// @pushGhost
export const pushGhost: PushGhostLayer = (): RulesConfig => {
  try {
    if (!rules()) {
      logWarning('Please, setup your rules.')
      return {} as RulesConfig
    }

    if (!rules()?.root || !rules()?.components) {
      logWarning('Invalid rules, rules is not ready used.')
      return {} as RulesConfig
    }

    if (!Array.isArray(rules()?.components)) {
      logWarning('Rules successfully, but ghost components is not ready used.')
      return {} as RulesConfig
    }

    return rules()
  } catch (e) {
    logWarning(`Push rules is failed with error : ${(e as Error).message}`)

    return {} as RulesConfig
  }
}

/**
 * Spawns multiple ghost components dynamically under a specific ID.
 *
 * This function is useful when you want to generate multiple components
 * programmatically with optional content, styling, and post-processing
 * via a mapping callback.
 *
 * @param {string} id - The unique identifier group to assign the ghost components.
 * @param {object} config - Configuration object to control how ghosts are spawned.
 * @param {number} config.count - Total number of ghost components to spawn.
 * @param {object} config.design - Default design structure applied to each ghost.
 * @param {string[]} [config.contents] - Optional array of content to assign individually.
 *   Must match `count` in length if provided.
 * @param {(ghost: GhostComponent, index: number) => GhostComponent} [config.map] - Optional
 *   callback to mutate or enhance each ghost before it is finalized.
 *
 * @returns GhostComponent[] The array of ghost components that were spawned.
 * @spawnGhosts
 */
export const spawnGhosts: SpawnGhostsLayer = (
  id: string,
  config: SpawnConfig
) => {
  const ghost = getGhostMap()
  const { count, design, contents, map, randomId } = config

  if (Array.isArray(contents) && contents.length === count && !randomId) {
    for (let i = 0; i < count; i++) {
      ghost?.push({
        name: generateId(id, i + 1),
        design: {
          ...design,
          content: contents[i],
        },
      })
    }

    return next(withMap(ghost ?? [], map))
  }

  if (contents?.length !== count) {
    logWarning('Count does not match contents length.')
    return
  }

  for (let i = 0; i < count; i++) {
    ghost?.push({
      name: generateId(id),
      design: {
        ...design,
      },
    })
  }

  return next(withMap(ghost ?? [], map))
}

// @summonGhost
export const summonGhost: SummonGhostLayer = (id: string) => {
  const ghost = before(id)

  if (!Array.isArray(ghost)) {
    logWarning(`Ghost component with id ${id} not found`)
    return {}
  }

  const component = ghost.find((c) => c.name === id)

  if (!component) {
    logWarning(`Ghost component with id ${id} not found`)
    return {}
  }

  return component
}

// @sortGhost
export const sortGhost: SortGhostLayer = (config: {
  from?: string
  to?: string
}) => {
  const ghost = getGhostMap() || []

  const fromIndex = ghost?.findIndex((g) => g.name === config.from)
  const toIndex = ghost?.findIndex((g) => g.name === config.to)

  if ((fromIndex === -1 && toIndex === -1) || config.from === config.to) {
    return ghost // nothing to do
  }

  const [fromItem] = ghost?.splice(fromIndex, 1)

  const actualToIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
  ghost?.splice(actualToIndex + 1, 0, fromItem)

  return next(ghost)
}

// @withMap
export const withMap = (
  ghost: RuleComponent[] | any[],
  map: SpawnMapCallback | undefined | null
) => {
  if (typeof map === 'function' && Array.isArray(ghost)) {
    return ghost.map((g, i) => map(g, i))
  }

  return ghost
}

//let isSealed: boolean = false

//const guarded = <T>(fn: (...args: any[]) => T, fallback: T) => {
//return (...args: any[]): T => {
//if (isSealed) {
//logWarning(
//"If ghost sealed is active, you can't modify ghost components."
//)
//return fallback
//}

//return fn(...args)
//}
//}

// @sealGhost
//const sealGhost: SealGhostLayer = (id: string = '') => {}
