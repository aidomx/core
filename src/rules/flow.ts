import { createConfig, tasks } from '@/_caches'
import { ready, settings } from '@/rules/settings'
import type { RulesApi } from '@/types'

type Config = RulesApi.config
type Options = RulesApi.options

export type Key = keyof Options

/**
 * Configuration for a rule flow scheduling execution.
 */
type RuleFlowConfig = {
  /**
   * The key to wait before executing.
   */
  init: Key
  /**
   * A function to run once the condition is met.
   * Should return `true` if flow is ready.
   */
  onState: () => boolean
  /**
   * Callback executed when the state is determined ready.
   */
  done: (ready: boolean) => void
  /**
   * Optional logging callback for errors.
   */
  log?: (msg: string) => void
}

type ScheduleMap = Map<Key, RuleFlowConfig[]>

const schedule: ScheduleMap = new Map()

/**
 * The main flow controller for rule initialization.
 */
export const flow = {
  /**
   * Whether the flow has finished initializing.
   */
  done: false,

  /**
   * Sets the flow state with a given options object.
   * Will trigger `tasks.run()` for each defined key after initialization.
   * @param state - The rules configuration object to initialize
   * @returns `true` if the flow was created successfully
   */
  setState(state: Options) {
    flow.done = flowSchedule({
      init: 'define',
      onState: () => settings.define(state),
      done(ready) {
        if (ready) {
          for (const [key, value] of Object.entries(state)) {
            tasks.run(key as Key, value)
          }
        }
      },
    })

    flow.origin = tasks.read('define')
    return flow.done
  },

  /**
   * Returns the current rules object.
   * If flow is not done, a proxied config is returned to prevent mutation.
   */
  rules: () => (flow.done ? flow.origin : createConfig(flow.origin)),

  /**
   * The original rules configuration.
   */
  origin: {} as Config,
}

/**
 * Schedule a flow execution dependent on a specific key.
 * If the key is already available in `tasks`, it executes immediately.
 * Otherwise, it queues the execution until `processFlow()` is called for that key.
 * @param cfg - The configuration for the scheduled flow
 * @returns `true` if the flow was considered ready (based on `ready.has('created')`)
 */
export const flowSchedule = (cfg: RuleFlowConfig) => {
  const { init, onState, done, log } = cfg

  const exec = () => {
    try {
      const isReady = onState()
      done(isReady)
    } catch (e) {
      log?.(`[flow] ${init} error: ${e}`)
    }
  }

  if (!tasks.has(init)) {
    if (!schedule.has(init)) {
      schedule.set(init, [])
    }
    schedule.get(init)!.push(cfg)
  } else {
    exec()
  }

  return ready.has('created')
}

/**
 * Process and execute all scheduled flows waiting for the specified key.
 * @param key - The key whose flows should be processed
 */
export const processFlow = (key: Key) => {
  const list = schedule.get(key)
  if (!list) return

  for (const cfg of list) {
    try {
      const isReady = cfg.onState()
      cfg.done(isReady)
    } catch (e) {
      cfg.log?.(`[flow] ${key} error: ${e}`)
    }
  }

  schedule.delete(key)
}
