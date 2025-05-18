import { tasks } from '@/_caches'
import { getRules } from '@/rules/actions'
import { getEqualComponent, getMerged } from '@/rules/reactive'
import type {
  AddStore,
  DbProps,
  GetStore,
  GetStoreProps,
  RemoveStore,
  ResetStore,
  UpdateStore,
  UpdateStoreProps,
  DataObject,
  DbStore,
  RulesApi,
} from '@/types'
import { is, isArr, isWarn, logWarning, toArr } from '@/utils'

type RulesConfig = RulesApi.rulesConfig

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
   * Ensures that the storeMap entry exists and returns its current state.
   * Throws error if rules are not available.
   *
   * @returns DataStore[] The current data array from the storeMap.
   */
  const before = () => {
    if (!rules) {
      throw new Error('No rules found in cache.')
    }

    if (!tasks.has('store')) {
      tasks.create('store', [])
    }

    return tasks.read('store')
  }

  /**
   * Syncs the current storeMap data into rulesMap and the component definition.
   * Skips if the component is not found.
   *
   * @setRulesMap
   */
  const setRulesMap = async () => {
    const rules = getRules()
    const components = getMerged()

    if (!isArr(components)) return isWarn('Component is not found.', components)

    const component = components.find((c) =>
      getEqualComponent(c, pathId, pathId)
    )

    if (!component) {
      return isWarn(`Component with pathId ${pathId} not found.`)
    }

    if (!Array.isArray(component.data)) {
      component.data = getStoreMap()
    }

    tasks.update('define', rules)

    return component
  }

  /**
   * Retrieves the current storeMap data for the encrypted key.
   *
   * @returns DataStore[] The array of current data.
   */
  const getStoreMap = () => {
    const current = tasks.read('store')

    if (!Array.isArray(current)) {
      tasks.create('store', [])
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

    tasks.update('store', lastModified)
    await setRulesMap()

    return lastModified
  }

  /**
   * Menambahkan data baru ke komponen tertentu.
   * Secara otomatis menambahkan ID berdasarkan urutan data terakhir.
   *
   * @param data - Objek data yang akan ditambahkan.
   */
  const add: AddStore = async (data: DbStore): Promise<DbStore> => {
    const store = before()
    const normalized = toArr(data)
    const prevId = store?.length ?? 0
    const newData = normalized.map((item, index) => ({
      id: `${pathId}.${prevId + index + 1}`,
      ...item,
    }))

    const filtered = newData.filter(
      (item) => !store?.some((old: any) => is(old.id, item.id))
    )

    if (filtered.length === 0) {
      isWarn(`No new data added; all entries already exist.`, filtered)
      return []
    }

    return await next(filtered)
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
        tasks.delete('store')

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
