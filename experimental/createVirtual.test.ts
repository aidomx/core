import { expect, it } from 'vitest'
import { rulesConfig } from './rules.config'
import { createVirtual } from '@/rules'
import type { VirtualApi } from '@/types'

let vr = {} as VirtualApi

it('Inisiasi createVirtual', () => {
  vr = createVirtual(rulesConfig)

  expect(vr).toHaveProperty('createGhost')
})

it('[Method] createGhost', () => {
  vr.createGhost({
    entries: [
      {
        name: 'products',
      },
    ],
    autoCompile: true,
  })

  expect(vr).toMatchObject({})
})
