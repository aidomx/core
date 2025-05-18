import type { RulesApi } from '@/types'
import { getMerged } from '../reactive'
import { is, isWarn } from '@/utils'

/**
 * RuleEvent alias
 */
type RuleEvent = Omit<RulesApi.event, keyof Event>

/**
 * Payload dasar untuk inject manipulasi desain komponen
 */
export const payload: RuleEvent = {
  find(key) {
    const component = getMerged().find((c) => is(c.id, key) || is(c.name, key))
    if (!component) {
      isWarn(`Component ${String(key)} is not found.`)
      return {}
    }

    if (!component.scope) return component

    const scope = component.scope.find((s) => is(s.id, key) || is(s.name, key))
    if (!scope) {
      isWarn(`Component scope ${String(key)} is not found.`)
      return {}
    }

    return scope
  },

  findAll() {
    return getMerged()
  },

  pick(key) {
    const component = getMerged().find((c) => is(c.id, key) || is(c.name, key))
    if (!component) {
      isWarn(`Component ${String(key)} is not found.`)
      return {}
    }

    return component
  },

  read(key) {
    const component = getMerged().find((c) => is(c.id, key) || is(c.name, key))
    if (!component) {
      isWarn(`Component ${String(key)} is not found.`)
      return {}
    }

    if (!component.scope) return component

    const scope = component.scope.find((s) => is(s.id, key) || is(s.name, key))
    if (!scope) {
      isWarn(`Component scope ${String(key)} is not found.`)
      return {}
    }

    return scope
  },

  create(key, value) {
    const existing = getMerged().find((c) => is(c.id, key) || is(c.name, key))

    if (existing) {
      isWarn(`Component ${String(key)} already exists.`)
      return {}
    }

    const base = {
      id: typeof key === 'string' ? key : '',
      name: typeof key === 'string' ? key : '',
      design: {},
      ...value,
    }

    return base
  },

  update(key, value) {
    const component = payload.pick(key ?? '')
    if (!component) return {}

    return Object.assign(component, value)
  },

  delete(component, key) {
    if (!component) return false

    switch (key) {
      case 'id':
        if (!component.id) return false
        component.id = ''
        return true
      case 'name':
        if (!component.name) return false
        component.name = ''
        return true
      case 'design':
        if (!component.design) return false
        component.design = {}
        return true
      default:
        return false
    }
  },

  reset() {
    const all = getMerged()

    for (const component of all) {
      const same = component.id === component.name

      if (same) {
        component.id = ''
        // name tetap disimpan
      } else {
        component.id = ''
        component.name = ''
      }

      component.design = {}
    }

    return true
  },
}
