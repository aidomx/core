import type { LayerApi, RulesApi } from '..'

type Component = RulesApi.component
type RulesConfig = RulesApi.rulesConfig
type Rupa = RulesApi.rupa
type Spawn = RulesApi.spawn
type Use = RulesApi.use
type Store = RulesApi.store

export type Options = {
  compile?: 'default' | 'html' | 'jsx'
  clone?: string
  connect?: (rupa: Rupa) => void
  define: RulesConfig
  remove?: string
  reset?: true | false
  spawn?: Spawn
  // summon?: string
  sort?: { from: string; to: string }
  devMode?: true | false
  use?: Use
  store?: Store
}

export type Settings = {
  compile?(state?: RulesConfig): void
  define?(state: Options): boolean
  push?(): RulesConfig
  pull?(key: string[]): Record<string, Component | Component[]>
}
