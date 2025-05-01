import { expect, it } from 'vitest'
import { rulesConfig } from './rules.config'

it('Inisiasi rules', () => {
  expect(rulesConfig).toBeDefined()
})

//const store = createStore(rules)

//store.rupa('product', async (ctx) => {
//// Menambahkan data baru
//await ctx.add({ name: 'Kaos Oversize', price: 79000 })

//// Mengambil data yang sudah ditambahkan
//const data = await ctx.get({ select: { name: true } })
//console.log('Selected data:', data)

////// Memperbarui data pertama (id: product.1)
////const first = data[0]

//const update = await ctx.update('product.2', (prev) => ({
//...prev,
//name: 'Kaos Oversize Lengan Panjang',
//}))

//console.log('Updated: ', JSON.stringify(update, null, 2))

//const remove = await ctx.remove('product.1')

//console.log('Removed: ', JSON.stringify(remove, null, 2))

//const reset = await ctx.reset()

//console.log('Reset: ', JSON.stringify(reset, null, 2))
//})

//const vr = createVirtual(rules)

//vr.createGhost({
//entries: [
//{
//name: 'tutorial',
//tag: 'ul',
//children: [
//{
//tag: 'li',
//text: 'Membuat mini-framework',
//},
//],
//},
//{
//name: 'products',
//tag: 'ol',
//children: [
//{
//tag: 'li',
//text: 'Baju lebaran',
//},
//],
//},
//],
//autoCompile: true,
//})
