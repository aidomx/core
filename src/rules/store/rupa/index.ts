import { isWarn } from '@/utils'
import type { RulesApi } from '@/types'
import { rupaActions } from './actions'
import { findById, getRules } from '@/rules/actions'

type RupaCallback = RulesApi.rupaCallback
type RupaStore = RulesApi.rupaStore

async function createConnection(name: string, cb: RupaCallback) {
  const rupaStore: RupaStore = rupaActions(name, getRules())

  return await cb(rupaStore)
}

/**
 * Validate the loaded rules.
 */
const validateRules = (id: string): boolean => {
  const rules = getRules()

  if (!rules) {
    isWarn('Rules not initialized. Please defineRules first.', rules)
    return false
  }

  if (!rules.root || !rules.components) {
    isWarn('Please, set your components rules.', rules)
    return false
  }

  const component = findById(id)

  if (!component) {
    isWarn(`[Rupa] Component '${id}' not found.`, component)
    return false
  }

  return true
}

/**
 * Memanipulasi komponen tertentu di dalam `rules.components`,
 * dengan memberikan akses ke context `RupaStore`.
 *
 * @param name - Nama komponen yang ingin dimanipulasi (harus sesuai dengan `component.name` di rules).
 * @param callback - Fungsi async/sync yang menerima `ctx` sebagai context manipulasi.
 *
 * @example
 * ```ts
 * await rupa("HeroSection", (ctx) => {
 *   ctx.update({ props: { className: "bg-black" } })
 * })
 * ```
 *
 * @returns Promise<void>
 *
 * @throws Console warning jika `rules` belum diinisialisasi atau `component` tidak ditemukan.
 */
export async function rupa(name: string, cb: RupaCallback) {
  const valid = validateRules(name)

  if (!valid) {
    isWarn('Failed connecting to rupa...', { valid })
    return false
  }

  await createConnection(name, cb)

  return {
    connect(_env: any) {
      console.log('Connecting to database...')
    },
  }
}
