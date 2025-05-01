import type { DeepReadonly } from '../helpers/deepReadOnly'
import type { RuleComponent } from '../components'
import type { Skeleton } from '../shared'

/**
 * Base rules
 *
 * Bersifat lokal sebagai bagian dari Rules
 *
 * @type object
 */
export type Base = {
  /** Daftar komponen untuk dirender */
  components?: RuleComponent[]

  /** Selector root utama, contoh: #app atau body */
  root: string | string[]

  /** Routes */
  routes?:
    | Record<string, string[]>
    | {
        pathname: string
        name: string[]
      }[]

  /** Mode development */
  debug?: false | true
  skeleton?: Skeleton
}

/**
 * Rules Based
 *
 * Sebuah aturan untuk mendefinisikan berbagai komponen.
 *
 * @type object
 */
export type Rules = DeepReadonly<Base & RuleComponent>

/**
 * Rules based cache
 *
 * Digunakan untuk kebetuhan membaca dan menulis pada rules.
 *
 * @type object
 */
export type CacheRules = Base & RuleComponent

/**
 * Rules based cache
 *
 * Digunakan untuk kebetuhan membaca dan menulis pada rules.
 *
 * @type object
 */

export type RulesConfig = Base & RuleComponent

export type * from './Api'
