import type { RulesConfig } from '@/types'

export function encodeData(data: RulesConfig) {
  try {
    const json = JSON.stringify(data)
    return btoa(encodeURIComponent(json))
  } catch (error) {
    console.warn('Failed to encode data:', error)
    return ''
  }
}

export function decodeData(encoded: string) {
  try {
    const json = decodeURIComponent(atob(encoded))
    return JSON.parse(json)
  } catch (error) {
    console.warn('Failed to decode data:', error)
    return null
  }
}
