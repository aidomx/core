# Rules Engine

Folder `src/rules` merupakan inti dari sistem rule-based yang digunakan untuk mengelola logika dinamis, kontrol data, dan virtualisasi komponen dalam framework ini.

## Struktur
```
src/rules/
├── define.ts # Mendefinisikan rules secara deklarati
├── index.ts # Entry point dan re-export
├── manage/ # Handler untuk eksekusi rules, context, dan lifecycle
├── store/ # Sistem penyimpanan state rules-based (createStore)
├── virtual/ # Sistem ghost/virtual layer UI (createVirtual)
└── README.md # Dokumentasi folder ini
```

## Modul Utama

### `define.ts`

Digunakan untuk membuat dan mendefinisikan rules yang akan digunakan di seluruh aplikasi. Rules di sini bersifat declarative dan digunakan sebagai acuan bagi `store` maupun `virtual`.

### `manage/`

Berisi logika untuk menjalankan dan mengelola rules. Di dalamnya termasuk eksekusi context, lifecycle per component, dan routing berbasis rules.

### `store/`

Berfungsi seperti `useState`, namun dengan kontrol penuh terhadap setiap perubahan data berdasarkan component ID. Fungsi utama seperti `add`, `remove`, `update`, dan `reset` disediakan melalui `createStore`.

### `virtual/`

Modul untuk membangun dan mengelola komponen virtual (ghost layer) berbasis struktur HTML. Mendukung `createGhost`, `ghostModifier`, dan sistem render UI tanpa harus bergantung pada framework UI.

## Fitur

- Struktur rules-based yang modular dan scalable
- Dukungan untuk data state dan component secara independen
- Sistem virtual UI untuk menyusun layout dan interaksi tanpa overhead dari library UI tradisional
- Mendukung mode `dev`, `build`, dan `secure` melalui rules routing

## Contoh Penggunaan

```ts
import { defineRules } from './define'
import { createStore } from './store'
import { createVirtual } from './virtual'

const rules = defineRules({
  routes: {
    '/': ['products', 'settings'],
  },
})

const store = createStore(rules)
const virtual = createVirtual(rules)

// Store usage
store.rupa('products', async (ctx) => {
  await ctx.add({ name: 'baju' })
})

// Virtual usage
virtual.createGhost({
  entries: [
    {
      name: 'products',
      tag: 'ul',
      children: [{ tag: 'li', text: 'Baju Lebaran' }],
    },
  ],
})
```

---

> Dokumentasi ini akan diperluas di versi berikutnya seiring bertambahnya fitur dan optimisasi sistem rules.
