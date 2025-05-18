import { tasks } from '@/_caches'
import { RULES_SECRET_KEY } from '@/constants/rulesKey'
import type { RulesApi } from '@/types'
import { isWarn } from '@/utils'

type Rules = RulesApi.rules
type RulesConfig = RulesApi.rulesConfig

/**
 * Membekukan dan menyimpan rules ke cacheMap,
 * lalu menginisialisasi jika autorun diaktifkan.
 */
export const secureRules = (rules: Rules): Rules => {
  const secretKey = RULES_SECRET_KEY

  if (!secretKey) {
    isWarn('RULES_SECRET_KEY is not defined. Rules were not secured.')
    return {} as Rules
  }

  const secured = {
    ...rules,
    __aidomx__: secretKey,
  }

  tasks.update('define', secured)
  const cached: RulesConfig = tasks.read('define')

  if (process.env.NODE_ENV === 'production') {
    return Object.freeze(cached)
  }

  return cached
}
