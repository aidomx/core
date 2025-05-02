import type { DbStore, RuleComponent, RulesConfig } from '@/types'

/**
 * rulesMap
 *
 * Digunakan untuk memperbarui seluruh rules.
 */
export const rulesMap = new Map<string, RulesConfig | any>()

/**
 * ghostMap
 *
 * Spesifik untuk memperbarui rules.compnents
 */
export const ghostMap = new Map<string, RuleComponent[]>()

/**
 * storeMap
 *
 * Spesifik untuk memperbarui rules.data
 */
export const storeMap = new Map<string, DbStore[]>()
