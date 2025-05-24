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

import { defineConfig } from '@/rules/config'
import { triggerEvent } from '@/_events'
import { payload } from '@/rules/payload'
import { RulesApi } from '@/types'
import { benchmark } from '@/utils/benchmark'
import { settings } from '@/rules'

benchmark.start('defineConfig')
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

const contents = Array.from({ length: 1000000 }, (_, i) => i + 1)

export const app = defineConfig({
  remove: 'test2',
  clone: 'test3',
  connect: (rupa) => {
    rupa('test', async (db) => {
      await db.add({ name: 'Kaos panjang' })
    })
  },
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
  spawn: {
    id: 'buttonGroups',
    config: {
      count: 1000000,
      design: {
        type: 'button',
      },
      randomId: false,
      contents,
      map(ghost: RulesApi.component, index) {
        return {
          ...ghost,
          design: {
            ...ghost.design,
            className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
          },
        }
      },
    },
  },
  sort: {
    from: 'test3',
    to: 'test2',
  },
  devMode: false,
})

benchmark.end('defineConfig')

benchmark.start('flow rules')
console.log(app)
benchmark.end('flow rules')

benchmark.start('reactive use')
triggerEvent({
  name: 'testHandler',
  scope: false,
  event: 'click',
  payload,
})
benchmark.end('reactive use')

settings.refresh?.(false)

benchmark.report()
