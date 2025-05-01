import { RULES_SECRET_KEY } from '@/constants/rulesKey'
import { secureRules } from '@/security'
import type { Rules } from '@/types'

/**
 * API publik untuk membuat schema rules.
 *
 * @param rules Schema rules yang ingin digunakan.
 * @returns Hasil dari secureRules (frozen rules atau inisialisasi).
 */
export const defineRules = (rules: Rules): ReturnType<typeof secureRules> => {
  if (!RULES_SECRET_KEY) {
    throw new Error('RULES_SECRET_KEY is not defined. Cannot define rules.')
  }

  return secureRules(rules)
}
