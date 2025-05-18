import { getMerged } from '@/rules/reactive'
import type { RulesApi } from '@/types'
import { net } from '@/utils'
// import EventEmitter from 'events'

type Component = RulesApi.component

// Is not ready used.
// export const ghostEvents = new EventEmitter().setMaxListeners(Infinity)

/**
 * Memicu event pada komponen berdasarkan nama atau ID.
 *
 * @param options Parameter pemicu event
 * - name: nama komponen
 * - id: id komponen (opsional)
 * - event: nama event (misal: "click")
 * - scope: apakah memicu di scope juga (default: false)
 * - payload: data tambahan untuk handler
 * @returns True jika event berhasil dipicu, false jika tidak ditemukan
 */
export const triggerEvent = (options: {
  id?: string
  name: string
  event: string
  scope?: boolean
  payload?: any
}): boolean => {
  const { id, name, event, scope = false, payload } = options
  const key = net(event)
  const list = getMerged()

  const findMatch = (c: Component) =>
    (id && c.id === id) || (name && c.name === name)

  const component = list.find(findMatch)
  if (!component) return false

  const tryTrigger = (target?: Component): boolean => {
    const handler = target?.listeners?.[key as keyof typeof target.listeners]
    if (typeof handler === 'function') {
      handler(payload)
      return true
    }
    return false
  }

  const triggeredMain = tryTrigger(component)

  if (!scope || !component.scope) return triggeredMain

  const triggeredScope = component.scope
    .map((s) => tryTrigger(s))
    .some((v) => v)

  return triggeredMain || triggeredScope
}
