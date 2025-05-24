import { RulesApi, VirtualApi } from '@/types'
import { aro, is, isArr, isWarn, toArr } from '@/utils'
import { defineRules } from './define'
import { createVirtual } from './virtual'
import { reactive } from './reactive'
import { flow } from './flow'
import { settings } from './settings'
import { keys, tasks } from '@/_caches'

type Component = RulesApi.component
type RulesConfig = RulesApi.rulesConfig
type Settings = RulesApi.settings
type Options = RulesApi.options
type Pull = Record<string, Component | Component[]>

let rules = {} as RulesConfig
let virtual: VirtualApi = {} as VirtualApi

export const ready = new Set<string>()

const createSetting: Settings = {
  compile<T extends RulesConfig>(state?: T) {
    // Compile to default | html | jsx
    console.log(state)
  },

  define(options: Options) {
    const { clone, connect, define, remove, reset, spawn, sort, use } = options

    if (!define) {
      isWarn('Please set define in defineConfig.', options)
    }

    const components = setFlat(define.components)

    if (!ready.has('created') || !define?.__aidomx__) {
      rules = defineRules({
        ...define,
        components,
      })

      virtual = createVirtual(rules)

      ready.add('created')
    }

    if (!rules.components && ready.has('created')) {
      ready.delete('created')

      isWarn('Create components is failed.', ready)

      return ready.has('created')
    }

    if (isArr(rules.components) && rules.components.length === 0) {
      virtual.createGhost({ entries: components, autoCompile: true })
    }

    if (clone) virtual.cloneGhost(clone)
    if (connect) virtual.connect(connect)
    if (remove) virtual.removeGhost(remove)
    if (reset) virtual.resetGhost()
    if (spawn) virtual.spawnGhosts(spawn.id, spawn.config)
    if (sort) virtual.sortGhost(sort)
    if (use) reactive(use)

    return ready.has('created')
  },

  pull(key: string): Pull {
    const names = !isArr(key) ? key.split(' ') : key
    rules = flow.rules() as RulesConfig

    if (!rules.root || !rules.components) {
      isWarn('Invalid rules, please setup properly.', rules)
    }

    const components = rules.components

    if (isArr(components) && isArr(names) && names.length > 0) {
      const filtered = names.map((name) =>
        components.find((c) => is(c.name, name) || is(c.id, name))
      )

      return aro(filtered.filter(Boolean) as Component[], 'name') as Pull
    }

    return aro(toArr(components), 'name') as Pull
  },

  push(): RulesConfig {
    return flow.rules() as RulesConfig
  },

  refresh(mounted): boolean {
    if (mounted && ready.has('created')) {
      ready.delete('created')

      setTimeout(() => reCreateTasks(), 100)
      setTimeout(() => ready.add('created'), 150)
      return ready.has('created')
    }

    return ready.has('created')
  },
}

const reCreateTasks = () => {
  if (tasks.has('define')) {
    const def = tasks.read('define')

    tasks.delete('define')
    tasks.create('define', def)
  }

  for (const key of keys) {
    if (key === 'define') continue

    if (tasks.has(key)) {
      const val = tasks.read(key)

      tasks.delete(key)
      tasks.create(key, val)
    }
  }
}

const setFlat = <T extends Component>(input: T | T[] | undefined): T[] => {
  if (!input) return []
  if (!isArr(input)) {
    return Object.values(input).flat() as T[]
  }
  return input as T[]
}

export const pull = (key: string) => settings.pull?.(key)

export const push = (): RulesConfig => settings.push?.() as RulesConfig

export const refresh = (mounted: false | true = false) =>
  settings.refresh(mounted)

export { createSetting as settings }
