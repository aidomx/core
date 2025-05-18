import { flow, processFlow } from '@/rules/flow'
import type { RulesApi } from '@/types'
import { isWarn } from '@/utils'

type Config = RulesApi.config
type Options = RulesApi.options
type Key = keyof Options
type Rules = RulesApi.rulesConfig
type RuleMap = Map<Key, Options[Key]>

const rulesMap: RuleMap = new Map()

/**
 * List of allowed keys for mutation in `defineState`.
 */
const keys: Key[] = [
  'clone',
  'compile',
  'connect',
  'define',
  'devMode',
  'remove',
  'reset',
  'spawn',
  'sort',
  'store',
  'use',
]

/**
 * Check if a key is allowed to be mutated.
 * @param key - The configuration key
 * @returns `true` if allowed, otherwise `false`
 */
export const allowed = (key: Key) => keys.includes(key)

/**
 * Reducer used for `Proxy` set trap in production mode.
 * Prevents mutation after flow is done unless in devMode.
 */
export const reducer = (target: object, key: Key, value: Options) => {
  if (flow.done && !tasks.read('devMode') && allowed(key)) {
    isWarn(
      `[defineState] Cannot mutate "${key}" after flow is done and devMode is false.`,
      target
    )
    return true
  }

  return Reflect.set(target, key, value)
}

/**
 * Proxy handler for production mode.
 */
const defineState: ProxyHandler<Config> = {
  get: Reflect.get,
  has: Reflect.has,
  set: reducer,
}

/**
 * Proxy handler for development mode.
 * It updates `tasks` on mutation.
 */
const defineStateDev: ProxyHandler<Config> = {
  set(target, key, value, receiver) {
    if (flow.done && !tasks.read('devMode') && allowed(key as Key)) {
      isWarn(
        `[defineState] Cannot mutate "${key as Key}" after flow is done and devMode is false.`,
        target
      )
      return true
    }

    tasks.update(key as Key, value)
    return Reflect.set(target, key, value, receiver)
  },
  get: Reflect.get,
  has: Reflect.has,
}

/**
 * Create a reactive config object wrapped in a Proxy.
 * @param target - The original config object
 * @param devMode - If true, enables development mode with full mutation logging
 * @returns A proxied configuration object
 */
export const createConfig = <T extends Config>(target: T, devMode?: boolean) =>
  new Proxy(target, devMode ? defineStateDev : defineState)

/**
 * Check whether a value is a valid Rules config.
 * @param val - The value to check
 * @returns `true` if the value is a rulesConfig object
 */
export const isRules = (val: any): val is Rules =>
  typeof val === 'object' && '__aidomx__' in val

/**
 * Task manager for handling rule operations like create, read, update, delete, etc.
 */
export const tasks: RulesApi.tasks = {
  /**
   * Create a new task if it does not exist.
   * @param key - The task key
   * @param value - The task value
   */
  create(key, value) {
    if (!tasks.has(key)) {
      rulesMap.set(key, value)
      processFlow(key)
    } else {
      isWarn(`[tasks.create] Key "${key}" already exists.`, tasks)
    }
  },

  /**
   * Read a task by key.
   * @param key - The task key
   * @returns The stored task value
   */
  read: <K extends Key>(key: K): Options[K] => {
    if (!tasks.has(key)) {
      isWarn(`[tasks.read] Key "${key}" not found.`, tasks)
      return {} as Options[K]
    }

    return rulesMap.get(key) as Options[K]
  },

  /**
   * Update an existing task.
   * @param key - The task key
   * @param value - The new value
   */
  update(key, value) {
    if (tasks.has(key)) {
      rulesMap.set(key, value)
    } else {
      isWarn(`[tasks.update] Key "${key}" not found.`, tasks)
    }
  },

  /**
   * Delete a task by key.
   * @param key - The task key
   */
  delete(key) {
    if (tasks.has(key)) {
      rulesMap.delete(key)
    } else {
      isWarn(`[tasks.delete] Key "${key}" not found.`, tasks)
    }
  },

  /**
   * Execute a task with optional arguments.
   * @param key - The task key
   * @param value - A function whose arguments will be passed to the task
   * @returns The result of the task execution
   */
  run(key, value) {
    const task = tasks.read(key)

    if (!tasks.has(key)) {
      return isWarn(`[tasks.run] Key "${key}" not found.`, tasks)
    }

    if (typeof task === 'function' && typeof value === 'function') {
      return task(value.arguments)
    }

    return task
  },

  /**
   * Check if a task exists.
   * @param key - The task key
   * @returns `true` if the task exists
   */
  has(key) {
    return rulesMap.has(key)
  },
}
