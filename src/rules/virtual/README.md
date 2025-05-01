# createVirtual

`createVirtual` adalah sistem manajemen virtual layer dalam arsitektur rules-based Aidomx. Fungsinya adalah mengelola representasi struktur UI dalam bentuk virtual node sebelum dirender ke UI utama. Cocok untuk pendekatan deklaratif, modular, dan scalable.

## Fitur Utama

- Mendukung pembuatan `ghost` komponen HTML secara deklaratif
- Menyimpan dan mengelola data virtual sebelum proses kompilasi atau render
- Otomatis integrasi dengan `compile()` dan `render()` (jika diaktifkan)
- Dapat digunakan untuk dynamic component registry berbasis entry-name

## Instalasi

```ts
import { createVirtual } from '@/src/rules/virtual'
```

# Contoh Penggunaan
```
const vr = createVirtual(rules)

vr.createGhost({
  entries: [
    {
      name: 'tutorial',
      tag: 'ul',
      children: [
        {
          tag: 'li',
          text: 'Membuat mini-framework',
        },
      ],
    },
    {
      name: 'products',
      tag: 'ol',
      children: [
        {
          tag: 'li',
          text: 'Baju lebaran',
        },
      ],
    },
  ],
  autoCompile: true,
  })
```
# API

`createGhost(options: CreateGhostProps): GhostElements[]`

Membuat satu atau lebih virtual komponen (ghost) yang disimpan sementara dalam ghostMap.

## Parameter:

entries: Array dari objek virtual, struktur mirip JSON.

autoCompile: (opsional) Jika true, otomatis memanggil compile() setelah ghost selesai dibuat.


```
Contoh Entry:

{
  name: "button",
  tag: "button",
  props: { className: "btn-primary" },
  onClick: handleClick,
  children: [{ text: "Click Me" }],
}
```

# Catatan

Komponen ghost tidak langsung dirender ke UI, tapi diproses lebih lanjut oleh compiler.

