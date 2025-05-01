import { rulesMap, storeMap } from '@/_caches'
import { CACHE_KEY_RULES } from '@/constants/cacheKey'
import { encodeData } from '@/security'
import type {
  AddStore,
  RulesConfig,
  DataStore,
  DbProps,
  GetStore,
  GetStoreProps,
  RemoveStore,
  ResetStore,
  UpdateStore,
  UpdateStoreProps,
  DataObject,
  DbStore,
} from '@/types'
import { deepClone, logWarning } from '@/utils'

/**
 * Membuat kumpulan fungsi aksi untuk mengelola data store berdasarkan pathId dan rules yang diberikan.
 * Digunakan sebagai bagian dari hasil `generateStore()` untuk melakukan operasi seperti add, get, update, remove, dan reset.
 *
 * @param pathId - ID path dari komponen yang akan dimanipulasi.
 * @param rules - Struktur rules yang diambil dari rulesMap, berisi daftar komponen dan datanya.
 * @returns Objek berisi fungsi-fungsi manipulasi data store.
 */
export const rupaActions = (pathId: string, rules: RulesConfig) => {
  /**
   * Encoded store key based on pathId for isolation and mapping.
   */
  const encrypted = encodeData({ id: pathId })

  /**
   * Ensures that the storeMap entry exists and returns its current state.
   * Throws error if rules are not available.
   *
   * @returns DataStore[] The current data array from the storeMap.
   */
  const before = () => {
    if (!rules) {
      throw new Error('No rules found in cache.')
    }

    if (!storeMap.has(encrypted)) {
      storeMap.set(encrypted, [])
    }

    return getStoreMap()
  }

  /**
   * Syncs the current storeMap data into rulesMap and the component definition.
   * Skips if the component is not found.
   */
  const setRulesMap = async () => {
    const component = rules.components?.find((c) => c.name === pathId)

    if (!component) {
      return logWarning(`Component with pathId ${pathId} not found.`)
    }

    if (!Array.isArray(component.data)) {
      component.data = []
    }

    const cloned = getStoreMap()
    const rules_ = rules.debug ? rules : encodeData(cloned)
    cloned.map((item) => component.data?.push(deepClone(item)))
    // component.data.push(cloned)
    rulesMap.set(CACHE_KEY_RULES, rules_)
  }

  /**
   * Retrieves the current storeMap data for the encrypted key.
   *
   * @returns DataStore[] The array of current data.
   */
  const getStoreMap = () => {
    const current = storeMap.get(encrypted)

    if (!Array.isArray(current)) {
      storeMap.set(encrypted, [])
      return []
    }

    return current
  }

  /**
   * Updates the storeMap with the new data and synchronizes it into rulesMap.
   *
   * @param {DataStore[]} lastModified - The array of updated data.
   * @returns DataStore[] The same updated data after persistence.
   */
  const next = async (lastModified: DataStore) => {
    if (!Array.isArray(lastModified)) {
      logWarning('next() expects an array of data')
      return []
    }

    storeMap.set(encrypted, lastModified)
    await setRulesMap()

    return lastModified
  }

  /**
   * Menambahkan data baru ke komponen tertentu.
   * Secara otomatis menambahkan ID berdasarkan urutan data terakhir.
   *
   * @param data - Objek data yang akan ditambahkan.
   */
  const add: AddStore = async (data: DataStore) => {
    try {
      const store = before()

      if (!Array.isArray(data)) {
        return logWarning('Data must be an array when using ctx.add')
      }

      const prevId = store?.length ?? 0
      const newData = data.map((item, index) => {
        let nextId = `${pathId}.${prevId + index + 1}`

        return {
          id: nextId,
          ...item,
        }
      })

      // Cek dan filter duplikat berdasarkan id
      const filteredData = newData.filter((item) => {
        return !store.some((oldData: any) => {
          return oldData.id === item.id
        })
      })

      if (filteredData.length === 0) {
        return logWarning(`No new data added; all entries already exist.`)
      }

      return await next(filteredData)
    } catch (e) {
      return logWarning(`Failed add data with error : ${(e as Error).message}`)
    }
  }
  /**
   * Mengambil data dari komponen, dapat difilter berdasarkan kunci tertentu.
   *
   * @param props.select - Objek dengan nama properti sebagai kunci dan boolean sebagai penanda apakah properti tersebut diambil.
   * @returns Data yang difilter sesuai properti yang dipilih atau seluruh rules jika tidak ada `select`.
   */
  const get: GetStore = async (options?: GetStoreProps) => {
    try {
      const store = before()

      if (!options?.select || Object.keys(options?.select).length === 0) {
        return getStoreMap() as DataStore
      }

      const currentData = Array.isArray(store) ? store : []

      const selected = currentData.map((item: DataObject) => {
        const filtered: Record<string, any> = {}
        const select: Record<string, boolean> = options.select as DbProps

        for (const key in select) {
          if (select[key] && key in item) {
            filtered[key] = item[key]
          }
        }

        return filtered
      })

      return selected
    } catch (e) {
      logWarning(`Error getting rules: ${(e as Error).message}`)
    }
  }

  /**
   * Memperbarui data dalam komponen berdasarkan ID dan callback untuk memodifikasi data lama.
   *
   * @param id - ID data yang ingin diperbarui.
   * @param cb - Fungsi callback untuk memodifikasi data sebelumnya.
   * @returns Promise yang menyelesaikan proses update.
   */
  const update: UpdateStore = async (id: string, cb: UpdateStoreProps) => {
    try {
      const store = before()
      const currentData = Array.isArray(store) ? [...store] : []
      const currentIndex = currentData.findIndex(
        (item: DbStore) => item.id === id
      )

      if (currentIndex === -1) {
        return logWarning(`No data found to update in component ${pathId}.`)
      }

      const prev = currentData[currentIndex]
      const next_ = cb(prev)

      currentData[currentIndex] = {
        ...prev,
        ...next_,
      }

      return await next(currentData)
    } catch (e) {
      return logWarning(`Update failed with error: ${(e as Error).message}`)
    }
  }

  /**
   * Menghapus data berdasarkan ID dari komponen.
   * Setelah penghapusan, ID akan diurut ulang secara otomatis.
   *
   * @param id - ID data yang ingin dihapus.
   * @returns Promise yang menyelesaikan proses penghapusan.
   */
  const remove: RemoveStore = async (id: string) => {
    try {
      const store = before()
      const currentData = Array.isArray(store) ? [...store] : []
      const currentIndex = currentData.findIndex(
        (item: DbStore) => item.id === id
      )

      currentData.splice(currentIndex, 1)
      const resetId = currentData.map((item, idx) => {
        return {
          ...item,
          id: `${pathId}.${idx + 1}`,
        }
      })

      return await next(resetId)
    } catch (e) {
      return logWarning(`Remove item failed because ${(e as Error).message}`)
    }
  }

  /**
   * Mereset semua data dalam komponen ke kondisi kosong.
   *
   * @returns Promise yang menyelesaikan proses reset.
   */
  const reset: ResetStore = async () => {
    try {
      const store = before()
      if (Array.isArray(store)) {
        storeMap.clear()

        return store
      }

      return store
    } catch (e) {
      return logWarning(`Reset failed with error: ${(e as Error).message}`)
    }
  }

  return {
    add,
    get,
    update,
    remove,
    reset,
  }
}
