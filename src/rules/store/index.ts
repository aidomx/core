import { tasks } from '@/_caches'
import type { GenStore, RulesApi } from '@/types'
import { logWarning } from '@/utils'
import { rupa } from './rupa'

type Rules = RulesApi.rules

/**
 * Menghasilkan objek store dasar yang berisi aksi manipulasi store.
 * Store ini bersifat generik dan bertanggung jawab atas add, get, update, remove, dan reset.
 *
 * @returns {GenStore} Store dasar dengan fungsi manipulasi data.
 */
const generateStore = (): GenStore => {
  return { ...{ rupa } }
}

/**
 * Membuat store jika rules yang diberikan valid dan cocok dengan cache.
 * Digunakan dalam lingkungan runtime setelah rules diamankan.
 *
 * @param {Rules} rules - Rules yang diberikan untuk validasi dan inisialisasi.
 * @returns {GenStore} Store hasil generate jika valid, jika tidak, objek kosong.
 */
export const createStore = <T extends GenStore>(rules: Rules): T => {
  const isValidRules = validateRules(rules)

  if (!isValidRules) {
    return {} as T
  }

  return generateStore() as T
}

/**
 * Memvalidasi apakah rules cocok dengan yang disimpan dalam cache.
 * Ini memastikan bahwa hanya rules yang diinisialisasi dengan benar yang akan digunakan untuk store.
 *
 * @param {Rules} rules - Rules yang akan divalidasi terhadap cache.
 * @returns {boolean} True jika valid dan cocok, false jika tidak.
 */
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
    logWarning('[Store] Provided rules do not match the cached rules.')
    return false
  }

  return true
}
