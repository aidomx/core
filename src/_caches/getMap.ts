import { CACHE_KEY_RULES, GHOST_KEY_RULES, STORE_KEY_RULES } from '@/constants'
import { ghostMap, listenerMap, rulesMap, storeMap } from './Initializer'
import { getGhostId } from '@/constants/ghostId'
import { logWarning } from '@/utils'
import type { RuleComponent, RulesConfig } from '@/types'

export const getGhostMap = () => {
  if (ghostMap.has(GHOST_KEY_RULES)) {
    return ghostMap.get(GHOST_KEY_RULES)
  }

  return []
}

export const getGhostMapById = (id: string): RuleComponent => {
  const idx = getGhostId(id)

  if (!idx) {
    logWarning(`Componenent with ${idx} is not found.`)
    return {}
  }

  const ghost = ghostMap.get(idx)

  if (Array.isArray(ghost)) {
    const component = ghost.find((g) => g.name === id)

    if (!component) {
      logWarning(`Component with ${idx} is not found.`)
      return {}
    }

    return component
  }

  if (!ghost) {
    logWarning(`Component with ${idx} is not found.`)
    return {}
  }

  return ghost
}

export const getListenerMap = (id: string) => {
  if (listenerMap.has(id)) {
    return listenerMap.get(id)
  }

  return {}
}

export const getRulesMap = (): RulesConfig => {
  let cache = rulesMap.has(CACHE_KEY_RULES)

  if (!cache) {
    throw new Error('[getMap] No rules found in cache.')
  }
  return rulesMap.get(CACHE_KEY_RULES)
}

export const getStoreMap = () => {
  if (storeMap.has(STORE_KEY_RULES)) {
    return storeMap.get(STORE_KEY_RULES)
  }

  return {}
}
