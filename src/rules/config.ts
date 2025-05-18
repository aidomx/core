import { createConfig, isRules, tasks } from '@/_caches'
import type { RulesApi } from '@/types'
import { isWarn } from '@/utils'
import { flow } from './flow'

type Options = RulesApi.options
type Key = keyof Options

/**
 * createTasks
 *
 * Menginisialisasi task awal dari konfigurasi `options` sebelum `flow` dijalankan.
 * Fungsi ini mencatat setiap key yang sah ke dalam `tasks` untuk digunakan dalam proses flow selanjutnya.
 *
 * @param {RulesApi.options} options - Konfigurasi awal yang diberikan pengguna
 * @returns {boolean} `true` jika setidaknya satu task berhasil dicatat, `false` jika tidak ada yang valid
 *
 * @example
 * const success = createTasks({
 *   define: { root: 'container', components: [...] },
 *   use: ...
 * })
 */
const createTasks = (options: RulesApi.options): boolean => {
  const entries = Object.entries(options)

  if (entries.length > 0) {
    for (const [key, value] of entries) {
      if (tasks.has(key as Key)) continue

      tasks.create(key as Key, value)
    }

    return true
  }

  isWarn('Please set you config in defineConfig.', options)

  return false
}

/**
 * defineConfig
 *
 * Fungsi utama untuk mendefinisikan konfigurasi awal dalam format yang aman dan terkontrol.
 * Berfungsi sebagai pintu masuk untuk inisialisasi `flow`, penyusunan `tasks`, serta pembentukan snapshot rules.
 *
 * ### Fitur Utama:
 * - Mendukung mode pengembangan (`devMode`) untuk update reaktif terhadap konfigurasi.
 * - Menjaga konsistensi dan integritas data saat `flow` sudah selesai (`flow.done`).
 * - Mengembalikan proxy dari `rules` atau `config` tergantung pada konteks (dev vs prod).
 *
 * ### Catatan:
 * - Pada mode production, perubahan setelah `flow.done` akan ditolak untuk mencegah efek samping.
 * - Jika digunakan saat `flow.done`, hanya `key` tertentu yang dapat diubah, dan hanya jika `devMode` aktif.
 * - Untuk penggunaan internal yang lebih stabil, gunakan `createConfig` secara langsung.
 *
 * @template T - Tipe dari konfigurasi input
 * @param {T} options - Obyek konfigurasi awal, bisa berupa opsi mentah atau hasil snapshot rules
 * @returns {T} Proxy dari konfigurasi yang telah diatur, sesuai dengan mode dan state aplikasi
 *
 * @example
 * const config = defineConfig({
 *   define: {
 *     root: 'container',
 *     components: { button: [...] },
 *   },
 *   devMode: true,
 *   use: ...
 * })
 *
 * @author Aidomx
 * @since version 0.1.2
 */
export const defineConfig = <T extends Options>(options: T): T => {
  const isDev = !!options.devMode

  if (isRules(options) && flow.done) {
    return isDev
      ? (createConfig(options, isDev) as T) // proxy mode
      : (flow.rules() as T) // snapshot final
  }
  const created = createTasks(options)
  if (!created) {
    isWarn('Create config is failed.', options)
    return options
  }

  const done = flow.setState(options)
  if (!done) return createConfig(options) as T

  return isDev ? (createConfig(options, isDev) as T) : (flow.rules() as T)
}
