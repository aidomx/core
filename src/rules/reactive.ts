import type { RulesApi } from '@/types'
import { is, isArr, isFunc, isObj, isWarn, net, toArr } from '@/utils'
import { getComponents } from './actions'
import { payload } from './payload'

/**
 * Event Sources
 */
type EventSources = RulesApi.eventSource

/**
 * Event Type
 */
type EventType = RulesApi.eventType

/**
 * Handler Map
 */
type HandlerMap = RulesApi.handlerMap

/**
 * Use alias
 *
 * @type array | object
 */
type UseConfig = RulesApi.use

/**
 * Tipe untuk Source tunggal dari konfigurasi `use`
 */
type Source = Exclude<RulesApi.use, RulesApi.use[]>

/**
 * Type untuk component tunggal atau alias.
 */
type Component = RulesApi.component

/**
 * Tipe untuk event listeners yang sudah dinormalisasi
 */
type Events = Record<EventType, EventSources>

/**
 * Injected Reactive Component
 */
type IRConfig = {
  component: Component
  events: Events
  source: Source
}

/**
 * ReactiveEvent alias
 */
type ReactiveEvent = RulesApi.reactive

/**
 * Gabungkan komponen utama dan semua scope-nya ke dalam satu array
 */
export const merged = (components: Component[]) => [
  ...components,
  ...components.flatMap((c) => c.scope ?? []),
]

/**
 * Ambil semua komponen dari cache dan gabungkan
 */
export const getMerged = () => {
  const components = getComponents()
  return isArr(components) ? merged(components) : merged([components])
}

/**
 * Normalisasi maps event dari source menjadi array HandlerMap
 */
export const normalizeEventMaps = ({ type, maps }: Source): HandlerMap[] => {
  if (isFunc(maps)) {
    return toArr({
      [net(type) as EventType]: (e?: Event) =>
        maps(Object.assign({}, e ?? {}, payload) as ReactiveEvent),
    } as EventSources) as HandlerMap[]
  }
  if (isArr(maps)) return maps
  if (isObj(maps)) return [maps]
  return []
}

/**
 * Ambil komponen target berdasarkan id atau name (termasuk scope-nya)
 */
export const getEqualComponent = (
  component: Component,
  id?: string,
  name?: string
): Component | undefined => {
  if (!component && !id && !name) {
    isWarn('Get component with equal id or name is failed.', component)
    return {}
  }
  return component.id === id || component.name === name
    ? component
    : component.scope?.find((s) => s.id === id || s.name === name)
}

/**
 * Injected Reactive Component
 *
 * @param component Component
 * @param source Source
 * @returns Component
 */
export const irc = ({ component, events, source }: IRConfig): Component => {
  if (!component && !events && !source) {
    isWarn(`[irc] Injected is failed.`, component)
    return {}
  }

  const id = is(component.id, source.id)
  const name = is(component.name, source.name)

  if (!id || !name) return component

  if (!component?.listeners) {
    component.listeners = events

    return component
  }

  return component
}

/**
 * Mendaftarkan event handler ke komponen yang sesuai berdasarkan source
 */
export const registerReactive = (
  component: Component,
  source: Source
): Component => {
  let events = {} as Events

  if (!component || !source) {
    isWarn('Injected is failed.', component)
    return component
  }

  const handlers: HandlerMap[] = normalizeEventMaps(source)
  const target = getEqualComponent(component, source.id, source.name)

  if (!target) {
    isWarn('[reg] Component is not found.', component)
    return {} as Component
  }

  if (handlers.length === 0) {
    isWarn('Injected is failed.')
    return target as Component
  }

  for (const map of handlers) {
    for (const [event, handler] of Object.entries(map)) {
      const key = event as EventType
      const fn = (e?: Event) =>
        handler(Object.assign({}, e ?? {}, payload) as ReactiveEvent)
      events[key] = fn
    }
  }

  return irc({
    component: target,
    events,
    source,
  })
}

/**
 * Membuat event handler reaktif berdasarkan satu source config
 */
export const createReactive = (source: Source) => {
  const components = getMerged()

  if (!components) {
    return isWarn('[create] Components is not found.', components)
  }

  for (const component of components) {
    if (!component) {
      isWarn('[create] Component is not found!', component)
      continue
    }

    registerReactive(component, source)
  }
}

/**
 * Fungsi utama untuk men-inject konfigurasi event maps ke komponen
 */
export const reactive = (sources?: UseConfig) => {
  if (!sources) {
    return isWarn('Use is called but no configuration for injected.', sources)
  }

  if (isArr(sources)) {
    for (const source of sources) {
      createReactive(source)
    }
  } else if (isObj(sources)) {
    createReactive(sources)
  } else {
    isWarn('No completed injected.', sources)
  }
}
