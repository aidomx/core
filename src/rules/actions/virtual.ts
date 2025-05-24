import { tasks } from '@/_caches'
import type {
  CreateGhostProps,
  LayerApi,
  RulesApi,
  SpawnMapCallback,
} from '@/types'
import { createStore } from '../store'
import {
  aro,
  clonePreserve,
  generateId,
  is,
  isArr,
  isNil,
  isWarn,
  toArr,
} from '@/utils'
import { ghostElements } from '@/_maps'

type Component = RulesApi.component
type RulesConfig = RulesApi.rulesConfig

export const getRules = (): RulesConfig => tasks.read('define')

export const getComponents = (): Component[] => {
  const rules = getRules()
  if (!rules?.components) return []
  return toArr(rules.components)
}

export const findById = (id: string): Component | undefined =>
  getComponents().find((item) => item.name === id)

export const cloneGhost: LayerApi.clone = (id: string) => {
  const current = findById(id)
  if (!current) return

  const cloned = clonePreserve({ ...current, name: id + '_cloned' })
  const idx = cloned.name as keyof RulesApi.options

  if (tasks.has(idx)) {
    isWarn(`Clone failed because ${id} has already been cloned.`)
    return current
  }

  const rules = getRules()
  if (isArr(rules.components)) {
    rules.components?.push(cloned)
  }
  tasks.create(idx, cloned)
  tasks.update('define', rules)

  return cloned
}

export const createGhost: LayerApi.create = ({ entries }: CreateGhostProps) => {
  if (!isArr(entries)) {
    isWarn(`Entries must be an array but got ${typeof entries}.`, entries)
    return {}
  }

  return entries.map(compile)
}

export const compile: LayerApi.compile = (ghost: Component) => {
  if (!ghost?.name || !ghost.design?.type) {
    return isWarn('Invalid ghost element for compilation.', ghost)
  }

  if (!ghostElements.includes(ghost.design.type)) {
    return isWarn(`Tag <${ghost.design.type}> is not supported.`, ghost)
  }

  const cloned = clonePreserve(ghost)
  const rules = getRules()

  if (isArr(rules.components)) {
    rules.components?.push(cloned)
  }
  tasks.update('define', rules)
  return cloned
}

export const connect: LayerApi.connect = (fn) => {
  const rules = getRules()
  const ghost = getComponents()

  if (ghost.length > 0) {
    const { rupa } = createStore(rules)
    return fn(rupa)
  }
}

export const groupByName = (ghosts: Component[]) => {
  if (!isArr(ghosts)) return ghosts

  return aro(ghosts, 'name')
}

/** @deprecated */
export const maintenance: LayerApi.maintenance = false

export const next = (data: Component[]) => {
  return data.map((ghost) => compile(ghost as Component))
}

export const removeGhost: LayerApi.remove = (id: string) => {
  const rules = getRules()
  const components = getComponents()
  const ghost = findById(id)

  if (!ghost) {
    isWarn(`Ghost component with id ${id} not found.`, ghost)
    return false
  }

  const index = components.findIndex((c) => c.name === ghost.name)
  if (index >= 0) components.splice(index, 1)

  rules.components = components
  tasks.update('define', rules)
  return true
}

export const resetGhost: LayerApi.reset = () => {
  const rules = getRules()
  rules.components = []
  tasks.update('define', rules)
  return true
}

export const pullGhost: LayerApi.pull = (scope: string | string[] = []) => {
  const rules = getRules()
  const components = getComponents()

  if (!rules.root || !rules.components) {
    isWarn('Invalid rules, please setup properly.', rules)
  }

  if (isArr(scope) && scope.length > 0) {
    const filtered = scope.map((name) =>
      components.find((c) => is(c.name, name) || is(c.id, name))
    )
    return groupByName(
      filtered.filter(Boolean) as RulesApi.component[]
    ) as Record<string, Component | Component[]>
  }

  return groupByName(components) as Record<string, Component | Component[]>
}

export const pushGhost: LayerApi.push = (): RulesConfig => getRules()

export const spawnGhosts: LayerApi.spawn = (id, config) => {
  const components = getComponents()
  const { count, design, contents, map, randomId } = config

  if (contents?.length !== count) {
    isWarn('Count does not match contents length.', config)
    return
  }

  const newContents = contents.map((item, index) => {
    const name = randomId ? generateId(id) : generateId(id, index + 1)

    return {
      name,
      design: {
        ...design,
        content: item,
      },
    }
  })

  for (const content of newContents) {
    if (!content) continue
    if (isArr(components)) {
      components.push(content)
    }
  }

  return withMap(components, map) as Component[]
}

export const summonGhost: LayerApi.summon = (id) => {
  const component = findById(id)
  if (!component) {
    return isWarn(`Ghost component with id ${id} not found.`, component)
  }
  return component
}

export const sortGhost: LayerApi.sort = ({ from, to }) => {
  const ghost = getComponents()
  let fromIndex = -1
  let toIndex = -1

  if (!isArr(ghost)) return ghost

  ghost.map((g, i) => {
    if (is(g.name, from) || is(g.id, from)) fromIndex = i

    if (is(g.name, to) || is(g.id, to)) toIndex = i
  })

  if (is(fromIndex, -1) || is(toIndex, -1) || is(from, to)) return ghost

  const [fromItem] = ghost.splice(fromIndex, 1)
  const [toItem] = ghost.splice(toIndex, 1)
  ghost.splice(fromIndex - 1, 0, fromItem)
  ghost.splice(toIndex + 1, 0, toItem)
}

export const withMap = (
  ghost: Component[],
  map?: SpawnMapCallback
): Component[] | void[] => {
  return typeof map === 'function' ? ghost.map((g, i) => map(g, i)) : ghost
}
