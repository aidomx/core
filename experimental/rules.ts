import { createVirtual, defineRules } from '@/rules'

const rules = defineRules({
  root: 'container',
  components: [],
  routes: {
    '/': ['products'],
  },
  debug: true,
})

const vr = createVirtual(rules)
vr.createGhost({
  entries: [
    {
      name: 'brand',
      design: {
        type: 'h1',
        content: 'Aidomx',
      },
    },
    {
      name: 'products',
      design: {
        type: 'div',
      },
    },
    {
      name: 'button',
      design: {
        type: 'button',
      },
      listeners: {
        test: () => {},
      },
    },
  ],
  autoCompile: true,
})

vr.connect((rupa) => {
  rupa('products', async (ctx) => {
    await ctx.add([{ name: 'kaos pendek' }, { name: 'kaos panjang' }])
    //await ctx.update('products.1', () => {
    //return {
    //size: 'xl',
    //}
    //})
    // await ctx.remove('products.2')
    // await ctx.reset()
    // console.log(JSON.stringify(await ctx.get(), null, 2))
  })
})

vr.spawnGhosts('buttonGroups', {
  count: 5,
  design: {
    type: 'button',
  },
  randomId: false,
  contents: ['one', 'two', 'three', 'four', 'five'],
  map(ghost, index) {
    return {
      ...ghost,
      design: {
        ...ghost.design,
        className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
      },
    }
  },
})

vr.cloneGhost('products')
vr.sortGhost({
  from: 'products',
  to: 'brand',
})
// console.log(rules)
// const summon = vr.summonGhost('products')
// const remove = vr.removeGhost('products')
// vr.resetGhost()
// vr.pushGhost()

const ghost = vr.pullGhost()
// console.log(JSON.stringify(ghost, null, 2))

// console.log(ghost)
// console.log(JSON.stringify(spawn, null, 2))
