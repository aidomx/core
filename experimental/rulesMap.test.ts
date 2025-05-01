import { beforeEach, expect, it } from 'vitest'
import { CACHE_KEY_RULES } from '@/constants/cacheKey'
import { rulesMap } from '@/_caches'

beforeEach(() => {
  rulesMap.set(CACHE_KEY_RULES, {})
})

it('[GET] Test global cache', () => {
  const cached = rulesMap.get(CACHE_KEY_RULES)

  expect(cached).toMatchObject({})
})
