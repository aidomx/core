import { rulesMap, storeMap } from '@/_caches'
import { CACHE_KEY_RULES } from '@/constants/cacheKey'
import { encodeData } from '@/security'
import type {
  AddStore,
  RulesConfig,
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
import { logWarning } from '@/utils'

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
   *
   * @setRulesMap
   */
  const setRulesMap = async () => {
    const component = rules.components?.find((c) => c.name === pathId)

    if (!component) {
      return logWarning(`Component with pathId ${pathId} not found.`)
    }

    if (!Array.isArray(component.data)) {
      component.data = getStoreMap()
    }

    const rules_ = rules.debug ? rules : encodeData(component.data)
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
  const next = async (lastModified: DbStore) => {
    if (!Array.isArray(lastModified)) {
      logWarning('next() expects an array of data')
      return []
    }

    storeMap.set(encrypted, lastModified)
    await setRulesMap()

    return lastModified
  }

  const normalizeToArray = <T>(data: T | T[]): T[] =>
    Array.isArray(data) ? data : [data]

  /**
   * Menambahkan data baru ke komponen tertentu.
   * Secara otomatis menambahkan ID berdasarkan urutan data terakhir.
   *
   * @param data - Objek data yang akan ditambahkan.
   */
  const add: AddStore = async (data: DbStore): Promise<DbStore> => {
    try {
      const store = before()

      const normalized = normalizeToArray(data)

      const prevId = store?.length ?? 0
      const newData = normalized.map((item, index) => {
        const nextId = `${pathId}.${prevId + index + 1}`
        return {
          id: nextId,
          ...item,
        }
      })

      const filteredData = newData.filter((item) => {
        return !store.some((oldData: any) => oldData.id === item.id)
      })

      if (filteredData.length === 0) {
        logWarning(`No new data added; all entries already exist.`)
        return []
      }

      return await next(filteredData)
    } catch (e) {
      logWarning(`Failed add data with error : ${(e as Error).message}`)
      return []
    }
  }
  /**
   * Mengambil data dari komponen, dapat difilter berdasarkan kunci tertentu.
   *
   * @param props.select - Objek dengan nama properti sebagai kunci dan boolean sebagai penanda apakah properti tersebut diambil.
   * @returns Data yang difilter sesuai properti yang dipilih atau seluruh rules jika tidak ada `select`.
   */
  const get: GetStore = async (options?: GetStoreProps): Promise<DbStore> => {
    try {
      const store = before()

      if (!options?.select || Object.keys(options?.select).length === 0) {
        return getStoreMap() as DbStore
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
      return []
    }
  }

  /**
   * Memperbarui data dalam komponen berdasarkan ID dan callback untuk memodifikasi data lama.
   *
   * @param id - ID data yang ingin diperbarui.
   * @param cb - Fungsi callback untuk memodifikasi data sebelumnya.
   * @returns Promise yang menyelesaikan proses update.
   */
  const update: UpdateStore = async (
    id: string,
    cb: UpdateStoreProps
  ): Promise<DbStore> => {
    try {
      const store = before()
      const currentData = Array.isArray(store) ? store : []
      const currentIndex = currentData.findIndex(
        (item: DbStore) => item.id === id
      )

      if (currentIndex === -1) {
        logWarning(`No data found to update in component ${pathId}.`)
        return []
      }

      const prev = currentData[currentIndex]
      const next_ = cb(prev)

      currentData[currentIndex] = {
        ...prev,
        ...next_,
      }

      return await next(currentData)
    } catch (e) {
      logWarning(`Update failed with error: ${(e as Error).message}`)
      return []
    }
  }

  /**
   * Menghapus data berdasarkan ID dari komponen.
   * Setelah penghapusan, ID akan diurut ulang secara otomatis.
   *
   * @param id - ID data yang ingin dihapus.
   * @returns Promise yang menyelesaikan proses penghapusan.
   */
  const remove: RemoveStore = async (id: string): Promise<DbStore> => {
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
      logWarning(`Remove item failed because ${(e as Error).message}`)
      return []
    }
  }

  /**
   * Mereset semua data dalam komponen ke kondisi kosong.
   *
   * @returns Promise yang menyelesaikan proses reset.
   */
  const reset: ResetStore = async (): Promise<DbStore> => {
    try {
      const store = before()
      if (Array.isArray(store)) {
        storeMap.clear()

        return store
      }

      return store
    } catch (e) {
      logWarning(`Reset failed with error: ${(e as Error).message}`)
      return []
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
