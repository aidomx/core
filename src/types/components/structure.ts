import type { DbStore } from '../store'
import type { ComponentVariant } from './variant'
import type { HTMLElementType } from './type'
import type { EventSources, EventType } from '../events'
// import type { RuleEvent } from '../events'

export type Design = {
  type?: HTMLElementType
  className?: string
  variant?: ComponentVariant
  style?: Record<string, any>
}

export type RuleComponent = {
  id?: string
  name?: string
  data?: DbStore[]
  design?: Design
  scope?: RuleComponent[]
  listeners?: Record<EventType, EventSources>
  content?: any
}
