# Aidomx Core

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

### Contoh Penggunaan

```ts
import { defineConfig } from '@aidomx/core'

export const rules = defineConfig({
  define: {
    root: 'container',
    components: { dashboard },
    design: {
      type: 'div',
      className: 'p-4 w-full h-screen',
    },
    skeleton: {
      name: 'container',
      className:
        'flex flex-col gap-3 items-center justify-center h-[100vh] text-lg',
      status: true,
      delay: 150,
      content: 'Preparing ghost components...',
    },
  },
  use: {
    name: 'refreshButton',
    maps: () => alert('Hi aidomx'),
  },
  autoCompile: true,
  devMode: false,
})
```

Sekarang hot reload tidak lagi menjadi masalah dalam sistem berbasis rules. Berikut penjelasan dari masing-masing opsi dalam `defineConfig`:

- **define**
  Digunakan untuk mendefinisikan komponen. `root` dan `components` adalah properti wajib.

- **use**
  Memberikan fleksibilitas untuk menambahkan event handler eksternal.

- **autoCompile**
  Secara default bernilai `true`. Jika disetel ke `false`, kamu dapat melakukan perbaikan atau pengujian manual. Saat ini belum mendukung mode maintenance otomatis, tetapi bisa saja hadir di versi mendatang jika `autoCompile` = `false`.

- **devMode**
  Fitur yang sangat berguna untuk pengembang karena membuka akses penuh ke seluruh fitur `defineConfig`.

- **clone**
  Melakukan cloning terhadap komponen berdasarkan `id`, contoh: `clone: "title"`.

- **spawn**
  Membuat beberapa komponen secara dinamis. Contoh:

```ts
spawn: {
  id: "buttonGroups",
  config: {
    count: 5,
    design: {
      type: 'button',
    },
    randomId: false,
    contents: ['one', 'two', 'three', 'four', 'five'],
    map(el, index) {
      return {
        ...el,
        design: {
          ...el.design,
          className: index === 0 ? 'btn-blue-500' : 'btn-green-500',
        },
      }
    }
  }
}
```

- **connect**
  Setiap komponen memiliki `components[name].data`, yang bisa kamu kontrol melalui fungsi ini. Contoh:

```ts
connect: (rupa) => {
  rupa('test', async (db) => {
    await db.add({ name: 'Alex' })
  })
},
```

`connect` menggunakan format `rupa(id, callback)`, di mana `id` adalah nama komponen dan `callback` memberikan akses ke fungsi `add`, `update`, `remove`, `get`, dan `reset`.

- **remove**
  Menghapus komponen tertentu berdasarkan namanya. Contoh: `remove: "test"`

- **sort**
  Mengatur ulang urutan komponen. Contoh:

```ts
sort: {
  from: "title",
  to: "description"
}
```

---

# Lisensi

MIT © 2025 @aidomx

---

> Aidomx dikembangkan untuk memberikan struktur yang terpisah antara logika dan UI, membantu developer membangun antarmuka kompleks tanpa boilerplate yang berat.
