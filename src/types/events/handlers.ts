import type { RuleComponent } from '../components'

type HandlerFn = (event: RuleEvent) => void
type HandlerMap = {
  [event: string]: HandlerFn
}

type HandlerMapFn = () => HandlerMap

type _Event = Omit<Event, 'currentTarget'>

export type RuleEvent = _Event &
  RuleComponent &
  HTMLElement & {
    get: (id: string) => RuleEvent
    has: (cls: string) => boolean
    add: (cls: string) => void
    remove: (cls: string) => void
    update: (cls: string[]) => void
    reset: () => void
  }

export type Use = {
  name: string | string[]
  maps?: HandlerMapFn | Array<HandlerFn | HandlerMap>
}
