import { RuleComponent, RulesConfig } from '@/types'
import { ghostMap, rulesMap } from './Initializer'

export const setGhostMap = (key: string, value: RuleComponent[]) => {
  ghostMap.set(key, value)
}

export const setRulesMap = (key: string, value: RulesConfig) => {
  rulesMap.set(key, value)
}
