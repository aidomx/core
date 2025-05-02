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
  //routes?:
  //| Record<string, string[]>
  //| {
  //pathname: string
  //name: string[]
  //}[]

  /** Mode development */
  //debug?: false | true
  skeleton?: Skeleton
  colorScheme?: 'default' | 'light' | 'dark'
  __aidomx__?: string
}

/**
 * Rules Based
 *
 * Sebuah aturan untuk mendefinisikan berbagai komponen.
 *
 * @type object
 */
export type Rules = DeepReadonly<Base>

/**
 * Rules based cache
 *
 * Digunakan untuk kebutuhan membaca dan menulis pada rules.
 *
 * @type object
 */

export type RulesConfig = Base & RuleComponent

export type * from './Api'
