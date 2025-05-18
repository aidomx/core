import type { EventMaps } from '@/_maps'
import type { RulesApi } from '..'

export type EventType = EventMaps
type HandlerFn<T extends RuleEvent = RuleEvent> = (e?: RuleEvent) => T | void
export type HandlerMap<T extends HandlerFn = HandlerFn> = Record<EventType, T>
type RuleComponent = RulesApi.component
export type PickComponent = Pick<RuleComponent, 'id' | 'name' | 'design'>

export type RuleEvent = {
  pick(key: string): PickComponent
  find(key: string): PickComponent
  findAll(): PickComponent[]
  create(key: string, value: PickComponent): void
  read(key: string): Readonly<PickComponent>
  update(key: string, value: PickComponent): void
  delete(component: PickComponent, key: keyof PickComponent): boolean
  reset(): boolean
} & Event

export type ReactiveEvent<T extends Event = Event> = T & RuleEvent

export type EventSources =
  | HandlerFn
  | HandlerMap
  | HandlerMap[]
  | (() => HandlerFn)
  | null
  | undefined

export type Use = {
  id?: string
  name?: string
  type?: keyof GlobalEventHandlersEventMap | string
  maps?: EventSources
}
