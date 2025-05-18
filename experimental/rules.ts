/**
 * File ini memang terlihat tidak biasa — karena memang sengaja dibuat
 * untuk uji coba eksploratif: menemukan bug, fitur baru, atau eksperimen logika.
 *
 * Cukup jalankan:
 * @example
 * ```bash
 * tsx experimental/[name].ts
 * ```
 *
 * Kenapa tidak pakai vitest?
 *
 * Karena tujuan utamanya bukan validasi, tapi eksplorasi cepat dan langsung.
 *
 * 1. Vitest bagus untuk testing formal, tapi eksplorasi sering terbentur kebutuhan mock.
 * 2. Assertion seperti `toBeDefined()` kadang terasa membatasi saat hanya ingin lihat hasil mentah.
 *
 * # Kesimpulan
 * Untuk eksplorasi cepat, `tsx file.ts` lebih praktis daripada vitest.
 *
 * @author Aidomx
 */

//import { setRegistry } from '@/_caches'
//import { createVirtual, defineRules } from '@/rules'
//import { useGhostRider, useRules } from '@/rules/hooks'
//import { GhostRiderEvents } from '@/types'

import { defineConfig } from '@/rules/config'
import { triggerEvent } from '@/_events'
import { payload } from '@/rules/payload'
import { RulesApi } from '@/types'

//const rules = defineRules({
//root: 'container',
//components: [],
//})

//const vr = createVirtual(rules)
//vr.createGhost({
//entries: [
//{
//name: 'brand',
//design: {
//type: 'h1',
//className: 'hidden',
//content: 'Aidomx',
//},
//},
//{
//name: 'products',
//design: {
//type: 'div',
//},
//},
//{
//name: 'button',
//design: {
//type: 'button',
//className: 'bg-green-500 hidden',
//},
//target: 'brand',
//},
//],
//autoCompile: true,
//})

//vr.connect((rupa) => {
//rupa('products', async (ctx) => {
//await ctx.add([{ name: 'Kemeja' }])
//})
//})

//vr.connect((rupa) => {
//rupa('products', async (ctx) => {
//await ctx.add([{ name: 'kaos pendek' }, { name: 'kaos panjang' }])
//await ctx.update('products.1', () => {
//return {
//size: 'xl',
//}
//})
//await ctx.remove('products.2')
//await ctx.reset()
//console.log(JSON.stringify(await ctx.get(), null, 2))
//})
//})

//vr.spawnGhosts('buttonGroups', {
//count: 5,
//design: {
//type: 'button',
//},
//randomId: false,
//contents: ['one', 'two', 'three', 'four', 'five'],
//map(ghost, index) {
//return {
//...ghost,
//design: {
//...ghost.design,
//className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
//},
//}
//},
//})

//vr.cloneGhost('products')
//vr.sortGhost({
//from: 'products',
//to: 'brand',
//})
// console.log(rules)
// const summon = vr.summonGhost('products')
// const remove = vr.removeGhost('products')
// vr.resetGhost()

// vr.pushGhost()

//export const button = useRules('button', {
//onClick(event) {
//const target = event?.get('brand')

//if (target?.has('hidden')) {
//target.remove('hidden')
//target.add('font-bold')
//}
//},
//onScroll() {},
//})

//const ghosts = vr.pullGhost()
// console.log(JSON.stringify(ghost, null, 2))
// console.log(JSON.stringify(spawn, null, 2))
//

// invalid listeners
//export const brand = useRules('brand', {
//listener: {
//onClick(event) {
//const target = event?.get('brand')

//if (target?.has('hidden')) {
//target.remove('hidden')
//target.add('font-bold')
//}

//console.log(event)
//// emited = 'ghost-' + emited
//},
//onScroll() {},
//},
//})

//button?.listeners?.onClick({} as GhostRiderEvents)

//vr.registryGhost({
//button,
//})

// ghost?.listeners?.onClick()

// ghosts?.button?.listeners?.onClick({} as GhostRiderEvents)

// console.log(ghosts)

console.time('rules')
/**
 * Struktur baru defineRules untuk mendukung fleksibel
 * dalam memisahkan logic dan UI.
 *
 */
const test = [
  {
    name: 'test',
    design: {
      type: 'h1',
      className: '',
    },
  },
  {
    name: 'testHandler',
    design: {
      type: 'button',
    },
  },
] as RulesApi.component[]

const test2 = [
  {
    name: 'test2',
    design: {
      type: 'h1',
      className: '',
    },
  },
] as RulesApi.component[]

const test3 = [
  {
    name: 'test3',
    design: {
      type: 'h1',
      className: '',
    },
  },
] as RulesApi.component[]

//settings.define({
//root: 'container',
//components: { test, test2 },
//})

//settings.compile(true)

//const pull = settings.pull(['test'])

//const handlers = {
//onClick() {
//console.log('You click me.')
//},
//}

//settings.use({ ...handlers })
//settings.trigger('onClick')

// Configuration components dengan akses terbatas untuk publik.
export const app = defineConfig({
  //remove: 'test2',
  //clone: 'test3',
  //connect: (rupa) => {
  //rupa('test', async (db) => {
  //await db.add({ name: 'Kaos panjang' })
  //})
  //},
  define: {
    root: 'container',
    components: { test, test2, test3 },
  },
  use: {
    name: 'testHandler',
    type: 'click',
    maps: (e) => {
      const tick = e?.pick('test3')
      console.log('Before delete: ', tick)
      e?.delete(tick ?? {}, 'design')
      console.log('after delete: ', tick)
    },
  },
  //spawn: {
  //id: 'buttonGroups',
  //config: {
  //count: 5,
  //design: {
  //type: 'button',
  //},
  //randomId: false,
  //contents: ['one', 'two', 'three', 'four', 'five'],
  //map(ghost: RulesApi.component, index) {
  //return {
  //...ghost,
  //design: {
  //...ghost.design,
  //className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
  //},
  //}
  //},
  //},
  //},
  //sort: {
  //from: 'test3',
  //to: 'test2',
  //},
  devMode: false,
})

// devMode bisa menggunakan semua fungsi dari luar termasuk compile
//app.connect((rupa) => {
//rupa('test', async (ctx) => {
//await ctx.add({ name: 'kaos' })
//})
//})

//app.remove('test2')

//console.log(app.push())

//const hooks = useRules('test', {
//onClick(event) {
//console.log(event)
//},
//})
//app.define = {
//root: 'changed',
//}

//console.log('before: ', app)
//app.remove = ''
//app.define = {
//root: 'changed',
//components: [],
//}
//app.clone = ''
//app.connect = (rupa) =>
//rupa('test', async () => {
//console.log('Connection by rupa')
//})

//console.log('after: ', app)

triggerEvent({
  name: 'testHandler',
  scope: false,
  event: 'click',
  payload,
})
console.log(app)
console.timeEnd('rules')
