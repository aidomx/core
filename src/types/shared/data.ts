import type { Rules } from '../rules'
import type { DbStore } from '../store'

/**
 * Digunakan untuk fungsi yang membutuhkan data.
 *
 * @type object | Record<string, string>
 */
export type Data = Rules | Record<string, string>

/**
 * Berbeda dengan `Data` yang ditujukan untuk parameter sebuah fungsi `DataObject` digunakan untuk properti pada `Rules`
 * untuk mengatur data dari external.
 *
 * @type Record<string, any>
 */
export type DataObject = Partial<DbStore>

/**
 * Alias `DataBounds` dari `DataObject`
 *
 * Digunakan untuk mendeteksi {} atau {}[]
 *
 * @type Record<string, any> | Record<string, any>[]
 */
export type DataBounds = DataObject | DataObject[]
