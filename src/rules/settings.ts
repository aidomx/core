import { RulesApi, VirtualApi } from '@/types'
import { isArr, isWarn, logWarning } from '@/utils'
import { defineRules } from './define'
import { createVirtual } from './virtual'
import { reactive } from './reactive'

type Component = RulesApi.component
type RulesConfig = RulesApi.rulesConfig
type Settings = RulesApi.settings
type Options = RulesApi.options

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
      logWarning('Please set define in defineConfig.')
    }

    const components = setFlat(define.components)

    if (!ready.has('created') && !define?.__aidomx__) {
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
}

const setFlat = <T extends Component>(input: T | T[] | undefined): T[] => {
  if (!input) return []
  if (!isArr(input)) {
    return Object.values(input).flat() as T[]
  }
  return input as T[]
}

export { createSetting as settings }
