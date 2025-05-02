import { CACHE_KEY_RULES } from '@/constants/cacheKey'
import { logWarning, resolvedPath } from '@/utils'
import type { RulesConfig, RupaCallback, RupaStore } from '@/types'
import { rupaActions } from './actions'
import { rulesMap } from '@/_caches'

/**
 * Memanipulasi komponen tertentu di dalam `rules.components`,
 * dengan memberikan akses ke context `RupaStore`.
 *
 * @param path - Nama komponen yang ingin dimanipulasi (harus sesuai dengan `component.name` di rules).
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
class Rupa {
  private rules: RulesConfig = rulesMap.get(CACHE_KEY_RULES)

  private path: string
  private isRulesValid: boolean = false
  private callback: RupaCallback

  constructor(path: string, callback: RupaCallback) {
    this.path = path
    this.callback = callback
    this.isRulesValid = this.validateRules()
    if (this.isRulesValid) {
      this.initialize()
    }
  }

  /**
   * Prepare for database connection.
   */
  public connect(env: any) {
    console.log('Connecting to environment:', env)
    return this
  }

  /**
   * Initialize and execute callback if validation passed.
   */
  private async initialize() {
    this.guardPathAccess()

    const rupaStore: RupaStore = rupaActions(this.path, this.rules)
    return await this.callback(rupaStore)
  }

  /**
   * Guard access by path.
   */
  private guardPathAccess() {
    const isAllowed = resolvedPath(this.path, this.rules)
    if (!isAllowed) {
      throw new Error(`Access to '${this.path}' is not allowed on this route.`)
    }
  }

  /**
   * Validate the loaded rules.
   */
  private validateRules(): boolean {
    if (!this.rules) {
      logWarning('Rules not initialized. Please defineRules first.')
      return false
    }

    if (!this.rules.root || !this.rules.components) {
      logWarning('Please, set your components rules.')
      return false
    }

    if (!this.rules?.components) {
      logWarning('Ghost components not ready used.')
      return false
    }

    const hasComponent = this.rules.components.some((c) => c.name === this.path)

    if (!hasComponent) {
      logWarning(`[Rupa] Component '${this.path}' not found.`)
      return false
    }

    return true
  }
}

export const rupa = (componentId: string, cb: RupaCallback) =>
  new Rupa(componentId, cb)
