import { rulesMap } from '@/_caches'
import { CACHE_KEY_RULES } from '@/constants'
import { RULES_SECRET_KEY } from '@/constants/rulesKey'
import type { Rules, RulesConfig } from '@/types'
import { logWarning } from '@/utils'

/**
 * Membekukan dan menyimpan rules ke cacheMap,
 * lalu menginisialisasi jika autorun diaktifkan.
 */
export const secureRules = (rules: Rules): Rules => {
  const secretKey = RULES_SECRET_KEY

  if (!secretKey) {
    logWarning('RULES_SECRET_KEY is not defined. Rules were not secured.')
    return {} as Rules
  }

  const secured = {
    ...rules,
    __aidomx__: secretKey,
  }

  rulesMap.set(CACHE_KEY_RULES, secured)
  const cached: RulesConfig = rulesMap.get(CACHE_KEY_RULES)

  if (process.env.NODE_ENV === 'production') {
    return Object.freeze(cached)
  }

  return cached
}
