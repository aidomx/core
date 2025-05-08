import type {
  Rules,
  RulesConfig,
  RuleComponent,
  VirtualApi,
  SpawnConfig,
  RupaManipulator,
  Use,
} from '@/types'
import { defineRules } from './define'
import { createVirtual } from './virtual'
import { logWarning } from '@/utils'
import { rulesMap } from '@/_caches'
import { CACHE_KEY_RULES } from '@/constants'
import { useRules } from './hooks'

export type PullResponse = Record<string, RuleComponent | RuleComponent[]>
const virtualMap = new Map<string, VirtualApi>()

/**
 * Kelas Settings untuk mengelola konfigurasi rules.
 * Konfigurasi hanya dapat diinisialisasi satu kali.
 */
class Settings {
  private components: RuleComponent | RuleComponent[] = []
  private config: RulesConfig = {} as RulesConfig
  private virtual: VirtualApi = virtualMap.get('__vr__') as VirtualApi
  private defined = false
  private isCompiled = false
  private __rules__: Rules = {} as Rules

  private lastModified = 0

  //@define
  define(config: RulesConfig): void {
    const { root, components, ...rest } = config

    if (!root || !components) {
      logWarning('Invalid rules, please setup rules root and components.')
      return
    }

    if (this.defined) {
      throw new Error(`Settings telah didefinisikan: ${JSON.stringify(config)}`)
    }

    this.components = this.flattenComponents(components)
    this.config = { root, components, ...rest }
    this.defined = true
    this.__rules__ = this.rules()
  }

  //@compile
  protected compile(autoCompile: boolean = true) {
    const virtual = createVirtual(this.__rules__)
    const entries = Array.isArray(this.components)
      ? this.components
      : [this.components]

    virtual.createGhost({ entries, autoCompile })

    this.isCompiled = rulesMap.has(CACHE_KEY_RULES)
    this.virtual = virtual
    this.lastModified = Date.now()
    virtualMap.set('__vr__', virtual)
  }

  //@push
  push(): Rules {
    return this.virtual.pushGhost()
  }

  //@pull
  pull(scope: string[] = []): PullResponse {
    return this.virtual.pullGhost(scope)
  }

  //@clone
  clone(name: string = '') {
    return this.virtual.cloneGhost(name)
  }

  //@connect
  connect(fn: (rupa: RupaManipulator) => void): void {
    return this.virtual.connect(fn)
  }

  //@remove
  remove(id: string) {
    return this.virtual.removeGhost(id)
  }

  //@reset
  reset() {
    return this.virtual.resetGhost()
  }

  //@summon
  /**
   * Akses masih terbatas karena dalam tahap pengembangan.
   *
   * @example
   * ```
   * defineConfig({
   *   summon: "test"
   * })
   * ```
   * Ini akan menghasilkan popup atau modal popup.
   */
  summon(id: string) {
    return this.virtual.summonGhost(id)
  }

  //@sort
  sort(options: { from: string; to: string }) {
    return this.virtual.sortGhost(options)
  }

  //@spawn
  spawn(id: string, config: SpawnConfig) {
    return this.virtual.spawnGhosts(id, config)
  }

  //@getCompiled
  protected getCompiled() {
    return this.isCompiled
  }

  //@getDefined
  protected getDefined() {
    return this.defined
  }

  //@getModified
  protected getModified() {
    return this.lastModified
  }

  //@skeleton
  protected skeleton(name: string) {
    const rules = this.__rules__

    return name === rules.skeleton?.name
      ? rules.skeleton
      : { name, status: false, delay: 0, content: '' }
  }

  //@rules
  private rules(): Rules {
    return defineRules({
      ...this.config,
      components: [],
    })
  }

  getComponent(name: string): RuleComponent | undefined {
    return this.__rules__?.components?.find(
      (c: RuleComponent) => c.name === name
    )
  }

  use({ name, maps }: Use) {
    const names = Array.isArray(name) ? name : [name]

    for (const n of names) {
      const component = this.getComponent(n)

      if (!component) {
        logWarning(`Component "${n}" is not found.`)
        continue
      }

      useRules(component, { name: n, maps })
    }
  }

  //@flatten
  private flattenComponents(
    input?: Record<string, RuleComponent[]> | RuleComponent[]
  ): RuleComponent[] {
    if (!input) return []
    return Array.isArray(input) ? input : Object.values(input).flat()
  }
}

// Kelas turunan Settings dengan akses publik untuk beberapa method
export class SettingsInstance extends Settings {
  //@compile
  compile(autoCompile?: boolean) {
    super.compile(autoCompile)
    return super.getCompiled()
  }

  //@getCompiled
  getCompiled() {
    return super.getCompiled()
  }

  //@getDefined
  getDefined() {
    return super.getDefined()
  }

  getSkeleton(name: string) {
    return super.skeleton(name)
  }
}

export const settings = new SettingsInstance()
