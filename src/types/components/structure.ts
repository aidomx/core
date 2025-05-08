import { DbStore } from '../store'
import { ComponentVariant } from './variant'
import { HTMLElementType } from './type'
import type { RuleEvent } from '../events'

export type Design = {
  type: HTMLElementType
  className?: string
  variant?: ComponentVariant
  content?: string
}

export type RuleComponent = {
  name?: string
  data?: DbStore[]
  design?: Design
  scope?: RuleComponent[]
  sealed?: false | true
  target?: string
  listeners?: {
    [events: string]: (event: RuleEvent) => void
  }
  [key: string]: any
}
