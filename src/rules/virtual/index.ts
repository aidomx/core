import { tasks } from '@/_caches'
import type { Rules, VirtualApi } from '@/types'
import { logWarning } from '@/utils'
import {
  cloneGhost,
  connect,
  createGhost,
  maintenance,
  pullGhost,
  pushGhost,
  removeGhost,
  resetGhost,
  sortGhost,
  spawnGhosts,
  summonGhost,
} from '../actions'

const generateVirtual = (): VirtualApi => {
  return {
    createGhost,
    connect,
    cloneGhost,
    //sealGhost,
    summonGhost,
    spawnGhosts,
    maintenance,
    removeGhost,
    resetGhost,
    pullGhost,
    pushGhost,
    sortGhost,
  }
}

export const createVirtual = (
  rules: Rules
): ReturnType<typeof generateVirtual> => {
  const isValidRules = validateRules(rules)

  if (!isValidRules) {
    return {} as VirtualApi
  }

  return generateVirtual()
}

const validateRules = (rules: Rules): boolean => {
  const isReadyRules = tasks.has('define')

  if (!isReadyRules) {
    logWarning(
      'Please, initialize with defineRules before calling createStore.'
    )
    return false
  }

  if (!('__aidomx__' in rules)) {
    logWarning(
      'Rules signature is missing. Please use defineRules to initialize rules.'
    )
    return false
  }

  if (!rules.root || !Array.isArray(rules.components)) {
    logWarning(
      'Rules structure is invalid. Expected root and components fields.'
    )
    return false
  }

  const cached = tasks.read('define')

  if (!cached || cached.__aidomx__ !== rules.__aidomx__) {
    logWarning('[Virtual] Provided rules do not match the cached rules.')
    return false
  }

  return true
}
