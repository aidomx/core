# createStore

`createStore` adalah fungsi utama untuk mengelola state atau data dinamis pada sistem rules-based. Fungsinya mirip dengan store pada library modern (seperti Zustand atau Redux), namun dioptimalkan untuk ekosistem Aidomx dan pendekatan virtual-layer-nya.

## Fitur Utama

- Inisialisasi store dari `rules.components`
- Operasi utama: `add`, `get`, `update`, `remove`, dan `reset`
- Mendukung operasi berdasarkan `component.name`
- Terintegrasi penuh dengan sistem virtual layer dan compiler

## Instalasi

Fungsi ini sudah tersedia di dalam paket Aidomx secara default.

```ts
import { createStore } from '@/src/rules/store'
```

# Penggunaan Dasar

```ts
const store = createStore(rules)

store.add('header', { title: 'Aidomx Rules-Based' })
store.update('header', { title: 'Updated Title' })
const data = store.get('header')
store.remove('header')
store.reset()
```

# API

`add(path: string, value: any): void`

Menambahkan data ke dalam store berdasarkan nama komponen.

`get(path: string): any`

Mengambil data dari store.

`update(path: string, value: any): void`

Mengubah data yang ada dalam store.

`remove(path: string): void`

Menghapus entri dalam store.

`reset(): void`

Mereset seluruh isi store ke nilai awal.

# Catatan

Semua data di store ditautkan berdasarkan component.name, bukan tag atau id.

Untuk menjaga integritas data, store tidak langsung menulis ke rules, melainkan menggunakan cache terkontrol.

Store ini bekerja optimal jika defineRules sudah dipanggil sebelumnya dan rules.components sudah tersedia.

# Lisensi

MIT
