import { ghostMap, rulesMap } from '@/_caches'
import { ghostElements } from '@/_maps'
import { CACHE_KEY_RULES, GHOST_KEY_RULES } from '@/constants/cacheKey'
import { getGhostId } from '@/constants/ghostId'
import type {
  CreateGhostLayer,
  RemoveLayer,
  VirtualApi,
  RulesConfig,
  CompileLayer,
  GhostElement,
  CreateGhostProps,
  GhostElements,
  CloneGhostLayer,
  SummonGhostLayer,
  SpawnGhostsLayer,
  MaintenanceLayer,
  SpawnConfig,
  SpawnMapCallback,
  ResetLayer,
  RuleComponent,
  SortGhostLayer,
  ConnectGhostLayer,
  RupaManipulator,
  PushGhostLayer,
  PullGhostLayer,
  IsGhostReadyLayer,
} from '@/types'
import { clonePreserve, deepClone, generateId, logWarning } from '@/utils'
import { createStore } from '../store'

export const ActionsVirtual = (rules: RulesConfig): VirtualApi => {
  // @encrypted
  // const encrypted = encodeData(rules)

  let isGhostReady: IsGhostReadyLayer = rulesMap.has(CACHE_KEY_RULES)

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

  // @before
  const before = (id: string = '') => {
    if (!rules) {
      throw new Error('No rules found in cache.')
    }

    const key = getGhostId(id)

    if (!ghostMap.has(key)) {
      ghostMap.set(key, [])
    }

    return getGhostMap(key)
  }

  const connect: ConnectGhostLayer = (
    fn: (rupa: RupaManipulator) => Promise<void> | void
  ) => {
    const ghost = getContainerGhost()

    if (Array.isArray(ghost) && ghost.length > 0) {
      const { rupa } = createStore(rules)

      return fn(rupa)
    }
  }

  // @next
  const next = (data: GhostElement[] | any[]) => {
    data.map((ghost) => compile(ghost as GhostElement))

    return data
  }

  // @getGhostMap
  const getGhostMap = (key: string = '') => {
    return ghostMap.get(key) as RuleComponent[]
  }

  // @getContainerGhost
  const getContainerGhost = () => {
    return ghostMap.get(GHOST_KEY_RULES) as RuleComponent[]
  }

  // @createGhost
  const createGhost: CreateGhostLayer = (
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
  const compile: CompileLayer = (ghost: GhostElement) => {
    if (!ghost || !ghost.name || !ghost.design?.type) {
      logWarning('Invalid ghost element for compilation.')
      return
    }

    const cloned = clonePreserve(ghost)

    if (rules?.components) {
      rules.components.push(cloned)
    }

    ghostMap.set(getGhostId(ghost.name), [ghost])
    ghostMap.set(GHOST_KEY_RULES, rules.components ?? [])
    rulesMap.set(CACHE_KEY_RULES, rules)
  }

  // @cloneGhost
  const cloneGhost: CloneGhostLayer = (id: string) => {
    before(id)
    const currentGhost = getContainerGhost()

    const current = currentGhost.find((item) => item.name === id)

    const newData = {
      ...current,
      name: id + '_cloned',
    }

    const cloned = deepClone(newData)

    if (ghostMap.has(id + '_cloned')) {
      logWarning(`Clone failed because ${id} have already cloned.`)
      return newData
    }

    currentGhost.push(cloned ?? current)

    ghostMap.set(id + '_cloned', currentGhost)
    ghostMap.set(GHOST_KEY_RULES, currentGhost)

    return newData
  }

  // @sealGhost
  //const sealGhost: SealGhostLayer = (id: string = '') => {}

  // @summonGhost
  const summonGhost: SummonGhostLayer = (id: string) => {
    const ghost = before(id)

    if (!Array.isArray(ghost)) {
      logWarning(`Ghost component with id ${id} not found`)
      return []
    }

    return ghost
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
  const spawnGhosts: SpawnGhostsLayer = (id: string, config: SpawnConfig) => {
    const ghost = before(id)
    const { count, design, contents, map, randomId } = config

    if (Array.isArray(contents) && contents.length === count && !randomId) {
      for (let i = 0; i < count; i++) {
        ghost.push({
          name: generateId(id, i + 1),
          design: {
            ...design,
            content: contents[i],
          },
        })
      }

      return next(withMap(ghost, map))
    }

    if (contents?.length !== count) {
      logWarning('Count does not match contents length.')
      return
    }

    for (let i = 0; i < count; i++) {
      ghost.push({
        name: generateId(id),
        design: {
          ...design,
        },
      })
    }

    return next(withMap(ghost, map))
  }

  // @withMap
  const withMap = (
    ghost: GhostElement[],
    map: SpawnMapCallback | undefined | null
  ) => {
    if (typeof map === 'function' && Array.isArray(ghost)) {
      return ghost.map((g, i) => map(g, i))
    }

    return ghost
  }

  const maintenance: MaintenanceLayer = false

  /**
   * Remove all ghost entries associated with the given component ID.
   * This will directly update `rules.components` and sync the result to `rulesMap`.
   *
   * @param id - The component ID whose ghost entries should be removed.
   * @returns An empty array representing the cleared ghost data.
   * @removeGhost
   */
  const removeGhost: RemoveLayer = (id: string) => {
    const ghost = before(id)
    const currentGhost = getContainerGhost()

    try {
      if (!Array.isArray(ghost)) {
        logWarning(`Ghost component with id ${id} not found.`)
        return false
      }

      const deleteGhost = ghostMap.delete(getGhostId(id))

      if (deleteGhost) {
        const index = currentGhost.findIndex((c) => c.name === id)
        currentGhost?.splice(index as number, 1)
        rules.components = currentGhost

        ghostMap.set(GHOST_KEY_RULES, currentGhost)
        rulesMap.set(CACHE_KEY_RULES, rules)

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
  const resetGhost: ResetLayer = () => {
    rulesMap.clear()
    ghostMap.clear()

    rules.components = []

    rulesMap.set(CACHE_KEY_RULES, rules)

    return true
  }

  // @pushGhost
  const pushGhost: PushGhostLayer = (): RulesConfig => {
    try {
      if (!isGhostReady) {
        logWarning('Please, setup your rules.')
        return {} as RulesConfig
      }

      const rules_ = rulesMap.get(CACHE_KEY_RULES)

      if (!rules_?.root || !rules_?.components) {
        logWarning('Invalid rules, rules is not ready used.')
        return {} as RulesConfig
      }

      if (!Array.isArray(rules_.components)) {
        logWarning(
          'Rules successfully, but ghost components is not ready used.'
        )
        return {} as RulesConfig
      }

      return rules_
    } catch (e) {
      logWarning(`Push rules is failed with error : ${(e as Error).message}`)

      return {} as RulesConfig
    }
  }

  // @pullGhost
  const pullGhost: PullGhostLayer = (): Record<string, GhostElement> => {
    // const isGhostReady = ghostMap.has(GHOST_KEY_RULES)

    if (!isGhostReady) {
      logWarning('Ghost components is not ready used.')
      return {}
    }

    if (rules?.components) {
      return groupByName(rules.components)
    }

    return {}
  }

  const groupByName = (ghosts: GhostElement[]) => {
    let result: Record<string, GhostElement> = {}

    ghosts.forEach((ghost) => {
      if (ghost.name) {
        result[ghost.name] = ghost
      }

      return result
    })

    return result
  }

  // @sortGhost
  const sortGhost: SortGhostLayer = (config: {
    from?: string
    to?: string
  }) => {
    const ghost = getContainerGhost()

    const fromIndex = ghost.findIndex((g) => g.name === config.from)
    const toIndex = ghost.findIndex((g) => g.name === config.to)

    if ((fromIndex === -1 && toIndex === -1) || config.from === config.to) {
      return ghost // nothing to do
    }

    const [fromItem] = ghost.splice(fromIndex, 1)

    const actualToIndex = toIndex > fromIndex ? toIndex - 1 : toIndex
    ghost.splice(actualToIndex + 1, 0, fromItem)

    //const sorted: typeof ghost = []

    //ghost.forEach((g) => {
    //if (g.name === config.posBefore && config.posBefore) {
    //sorted.push(g)
    //const toMove = ghost.filter((x) => x.name === id)
    //sorted.push(...toMove)
    //} else if (g.name === config.posAfter && config.posAfter) {
    //const toMove = ghost.filter((x) => x.name === id)
    //sorted.push(g, ...toMove)
    //} else if (g.name !== id) {
    //sorted.push(g)
    //}
    //})

    return next(ghost)
  }

  return {
    createGhost,
    connect,
    cloneGhost,
    isGhostReady,
    //sealGhost,
    summonGhost,
    spawnGhosts,
    maintenance,
    removeGhost,
    resetGhost,
    pullGhost,
    pushGhost,
    sortGhost,
  }
}
