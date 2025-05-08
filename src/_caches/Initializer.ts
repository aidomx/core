import type { DbStore, RuleComponent, RuleEvent, RulesConfig } from '@/types'

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
 * listenerMap
 *
 * Spesifik untuk menangani events
 */
export const listenerMap = new Map<string, (e?: RuleEvent) => void>()

/**
 * storeMap
 *
 * Spesifik untuk memperbarui rules.data
 */
export const storeMap = new Map<string, DbStore[]>()
