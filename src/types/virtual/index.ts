// ===============================
// Core Interface & Types
// ===============================

import type { Design, RuleComponent } from '../components'
import { RulesConfig } from '../rules'
import type { RupaManipulator } from '../store'

export interface GhostElement extends RuleComponent {
  scope?: RuleComponent[]
}

export type CreateGhostProps = {
  entries: GhostElement[]
  autoCompile?: boolean
}

export type GhostElements = GhostElement | GhostElement[]

export type SpawnMapCallback = (g: GhostElement, i: number) => void

export type SpawnConfig = {
  count: number
  design: Design
  contents?: string[]
  randomId?: false | true
  map?: SpawnMapCallback
}

// API Types
// ===============================

export type CreateGhostLayer = (options: CreateGhostProps) => GhostElements

export type SpawnGhostsLayer = (
  id: string,
  config: SpawnConfig
) => Record<string, any> | void

export type CompileLayer = (ghost: GhostElement) => void
// @PullGhostLayer
export type PullGhostLayer = (
  scope: string[]
) => Record<string, RuleComponent | RuleComponent[]>
export type PushGhostLayer = () => RulesConfig

export type SealGhostLayer = (id?: string) => void

export type RemoveLayer = (id: string) => boolean

export type ResetLayer = () => boolean

export type CloneGhostLayer = (id: string) => GhostElement | void

export type SummonGhostLayer = (id: string) => GhostElement

export type SortGhostLayer = (config: { from?: string; to?: string }) => void

export type ConnectGhostLayer = (
  fn: (rupa: RupaManipulator) => Promise<void> | void
) => void

export type MaintenanceLayer = boolean

// ===============================
// Virtual API
// ===============================

export type VirtualApi = {
  /** createGhost */
  createGhost: CreateGhostLayer
  connect: ConnectGhostLayer
  cloneGhost: CloneGhostLayer
  //sealGhost: SealGhostLayer
  maintenance: MaintenanceLayer
  removeGhost: RemoveLayer
  resetGhost: ResetLayer
  spawnGhosts: SpawnGhostsLayer
  summonGhost: SummonGhostLayer
  sortGhost: SortGhostLayer
  pullGhost: PullGhostLayer
  pushGhost: PushGhostLayer
}
