import type { Design, RuleComponent } from './components'
import type { Options, Settings } from './config'
import type {
  EventSources,
  EventType,
  HandlerMap,
  ReactiveEvent,
  RuleEvent,
  Use,
} from './events'
import type { DeepReadonly } from './helpers'
import type { Skeleton } from './shared'
import type { DbStore, RupaCallback, RupaManipulator, RupaStore } from './store'
import type { Tasks } from './tasks'
import type { SpawnConfig } from './virtual'

type Components<T extends RuleComponent = RuleComponent> =
  | {
      [name: string]: T[]
    }
  | RuleComponent
  | RuleComponent[]

/**
 * Base rules
 *
 * Bersifat lokal sebagai bagian dari Rules
 *
 * @type object
 */
type Base = {
  /** Daftar komponen untuk dirender */
  components?: Components

  /** Selector root utama, contoh: #app atau body */
  root: string

  design?: Design

  /** Routes */
  //routes?:
  //| Record<string, string[]>
  //| {
  //pathname: string
  //name: string[]
  //}[]

  /** Mode development */
  //debug?: false | true
  skeleton?: Skeleton
  colorScheme?: 'default' | 'light' | 'dark'
  __aidomx__?: string
}

/**
 * Rules Api
 *
 * Adalah semua kumpulan fungsi yang bisa digunakan sesuai kebutuhan.
 *
 * Notes: Upcoming
 * @type reference
 */
export namespace RulesApi {
  export type component = RuleComponent
  export type config = Options | Base
  export type design = Design
  export type event = RuleEvent
  export type eventSource = EventSources
  export type eventType = EventType
  export type handlerMap = HandlerMap
  export type options = Options
  export type reactive = ReactiveEvent
  export type rules = DeepReadonly<Base>
  export type rulesConfig = Base
  export type rupa = RupaManipulator
  export type rupaCallback = RupaCallback
  export type rupaStore = RupaStore
  export type settings = Settings
  export type spawn = {
    id: string
    config: SpawnConfig
  }
  export type store = DbStore
  export type tasks = Tasks
  export type use = Use | Use[]
}

export type * from './events'
export type * from './helpers'
export type * from './shared'
export type * from './store'
export type * from './virtual'
