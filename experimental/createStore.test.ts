import { expect, it } from 'vitest'
import { rulesConfig } from './rules.config'
import { createStore } from '@/rules'
import { GenStore } from '@/types'

let store = {} as GenStore

it('createStore inisiasi...', () => {
  store = createStore(rulesConfig)

  expect(store).toHaveProperty('rupa')
})

it('[Method] createStore', () => {
  store.rupa('products', async (ctx) => {
    await ctx.add({ name: 'Kaos kaki', props: {} })

    const data = await ctx.get({
      select: {
        name: true,
      },
    })

    expect(data).toMatchObject([
      {
        name: 'baju',
      },
      {
        name: 'baju lebaran',
      },
    ])
  })
})
