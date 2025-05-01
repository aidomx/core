# Aidomx Core

[![npm version](https://img.shields.io/npm/v/@aidomx/core?color=blue&label=npm)](https://www.npmjs.com/package/@aidomx/core)
[![license](https://img.shields.io/npm/l/@aidomx/core?cacheSeconds=60)](LICENSE)
[![Build status](https://github.com/aidomx/core/actions/workflows/ci.yml/badge.svg)](#)
[![NPM Downloads](https://img.shields.io/npm/dw/%40aidomx%2Fcore)](#)

**Modular, reactive, identity-driven UI logic core**

**Aidomx Core** adalah inti dari sistem Aidomx, berfokus pada manipulasi elemen virtual, komposisi logika komponen, serta pengelolaan struktur UI berbasis identitas — tanpa tergantung framework UI seperti React atau Vue.

---

## Fitur Utama

- Definisi aturan UI berbasis `rules` yang ringan dan eksplisit
- Sistem `ghost` dan `virtual` untuk pengelolaan elemen virtual secara efisien
- Manipulasi dinamis melalui `createStore` dan `createVirtual`
- Dukungan `scope`, `group`, dan `routes` sebagai struktur UI kontekstual
- Tidak bergantung pada React — dapat diintegrasikan ke berbagai renderer

---

## Instalasi

```bash
npm install @aidomx/core
```

---

# Contoh Penggunaan

```ts
import { createVirtual, defineRules } from '@aidomx/core'

const rules = defineRules({
  root: 'container',
  components: [],
  routes: {
    '/': [],
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
      design: { type: 'div' },
    },
    {
      name: 'button',
      design: { type: 'button' },
    },
  ],
  autoCompile: true,
})

vr.connect((rupa) => {
  rupa('products', async (ctx) => {
    await ctx.add([{ name: 'kaos pendek' }, { name: 'kaos panjang' }])
  })
})

vr.spawnGhosts('buttonGroups', {
  count: 5,
  design: { type: 'button' },
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

vr.pushGhost()
const ghost = vr.pullGhost()
console.log(ghost)
```

---

# API Utama

## defineRules

Mendefinisikan struktur awal komponen dan rute.

```ts
defineRules({
  root: 'container',
  components: [],
  routes: { '/': [] },
})
```

## createVirtual

Menciptakan virtual environment yang dapat dimodifikasi tanpa mengubah rules asli secara langsung.

## createGhost

Menambahkan elemen virtual secara dinamis berdasarkan konfigurasi.

## connect

Menghubungkan nama elemen dengan fungsi manipulasi data berbasis identitas (ctx).

## spawnGhosts

Membuat banyak elemen virtual sekaligus berdasarkan count dan contents.

## sortGhost

Mengatur ulang posisi antar elemen berdasarkan identitas (from, to).

---

# Roadmap

[x] Rilis awal @aidomx/core

[x] Dukungan createStore, createVirtual, connect

[x] Fungsi spawnGhosts, cloneGhost, sortGhost

[ ] Plugin renderer (React, Vue, Solid) sebagai package terpisah

[ ] Dokumentasi lanjutan dan test coverage

---

# Lisensi

MIT © 2025 @aidomx

---

> Aidomx dikembangkan untuk memberikan struktur yang terpisah antara logika dan UI, membantu developer membangun antarmuka kompleks tanpa boilerplate yang berat.
