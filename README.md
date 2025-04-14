# @aidomx/core

**Versi stabil awal: `0.0.5`**

`@aidomx/core` adalah inti dari ekosistem **AIDOMX** — sebuah pendekatan baru untuk membuat UI yang bersih, deklaratif, dan fleksibel. Package ini menjadi tempat utama untuk mendefinisikan *rules*, *bindings*, dan logika yang dapat diintegrasikan ke berbagai platform seperti React, Vue, HTML biasa, atau bahkan server.

---

## Fitur Utama

- Deklaratif dengan sintaks `v-ai="..."` untuk pengikatan logika ke elemen UI.
- Menyederhanakan `useState`, `useEffect`, dan handler lainnya di React.
- Mendukung berbagai environment: HTML, React, dan ke depannya Vue & Server.
- Kompatibel dengan `rupalang` sebagai DSL opsional untuk konfigurasi yang lebih ekspresif.
- Fleksibel: bebas digunakan secara ringan atau ketat tergantung mode (strict vs loose).

---

## Instalasi

```bash
npm install @aidomx/core
```

Jika digunakan secara lokal (sebelum publish ke npm):

```bash
npm install ../aidomx/core
```

---

## Konsep Dasar

### 1. Pengikatan via `v-ai`

```html
<!-- HTML -->
<div v-ai="navbar"></div>
```

```tsx
// React (tanpa useState atau useEffect!)
return (
  <div v-ai="navbar">
    <div v-ai="section left"></div>
    <div v-ai="section right"></div>
  </div>
)
```

### 2. Konfigurasi Rule

```ts
const rules = {
  components: [
    {
      name: "navbar",
      className: "bg-transparent",
      onScroll(e) {
        this.className = e.height >= 300 ? "bg-blue-500" : "bg-transparent"
      },
      onState(prev) {
        // React to state changes
      }
    }
  ]
}
```

---

## Dukungan Platform

| Platform | Status        |
|----------|---------------|
| HTML     | Coming soon   |
| React    | Rilis awal    |
| Vue      | Coming soon   |
| Vite     | Coming soon   |
| Server   | Dalam riset   |
| Rupalang | Eksperimental |

---

## Rupalang (Opsional)

Jika Anda menyukai deklarasi seperti CSS:

```ts
navbar {
  class: "bg-transparent"

  onScroll(e) => {
    class = e.height >= 300 ? "bg-blue-500" : "bg-transparent"
  }
}
```

---

## Strict Mode

Aktifkan `strictMode: true` untuk validasi type di deklarasi komponen seperti:

```rpl
Navbar<class> {}
```

Mode ini bersifat opsional dan ditujukan untuk proyek besar atau production.

---

## Roadmap

- [x] Versi dasar HTML dan React
- [ ] Parser runtime untuk konfigurasi terpisah
- [ ] Komunikasi antar komponen
- [ ] Integrasi penuh dengan `@aidomx/server`
- [ ] CLI Tools untuk scaffolding dan validasi
- [ ] Dukungan dokumentasi otomatis (rpl-docgen)

---

## Lisensi

MIT

---

## Kontribusi

Aidomx adalah proyek terbuka dan sangat menerima kontribusi. Jangan ragu untuk membuat PR, diskusi, atau issue.

---

## Catatan

AIDOMX lahir dari kebutuhan untuk menyederhanakan UI dan logika dalam satu sistem yang fleksibel namun tetap scalable.


