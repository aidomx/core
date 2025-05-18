type Filter =
  | { select: string } // ambil properti secara rekursif
  | { key: string; equals: string | number | boolean } // filter by value
  | { key: string; find: string | number | boolean }

type FrozenOptions = {
  [key: string]: boolean
}

type MatchBy<T> = Partial<Pick<T, keyof T>>

type ToArr = <T>(source: T | T[] | null | undefined, filter?: Filter) => T[]

/**
 * Mengubah array menjadi objek dengan key tertentu sebagai index.
 * @example aro([{ id: 1, name: 'A' }], 'id') => { 1: { id: 1, name: 'A' } }
 */
export const aro = <T, K extends keyof T & (string | number)>(
  arr: T[],
  key: K
): Record<T[K] & (string | number), T> => {
  return arr.reduce(
    (acc, item) => {
      const k = item[key]
      if (typeof k === 'string' || typeof k === 'number') {
        acc[k] = item
      }
      return acc
    },
    {} as Record<T[K] & (string | number), T>
  )
}

/**
 * Membersihkan nilai `null` dan `undefined` dari array.
 */
export const compact = <T>(arr: (T | null | undefined)[]): T[] =>
  arr.filter((v): v is T => v != null)

/**
 * Menghapus item dari array berdasarkan kecocokan field, dan bisa menyimpan field tertentu ke dalam objek frozen.
 */
export const frozenDel = <T extends object>(
  items: T[],
  match: MatchBy<T>,
  options?: { frozen?: FrozenOptions }
): { updated: T[]; frozen?: Partial<T> } => {
  const index = items.findIndex((item) =>
    Object.entries(match).every(([k, v]) => item[k as keyof T] === v)
  )

  if (index === -1) return { updated: items }

  const target = items[index]
  const frozen = options?.frozen
    ? (Object.fromEntries(
        Object.entries(target).filter(([k]) => options.frozen?.[k])
      ) as Partial<T>)
    : undefined

  const updated = [...items.slice(0, index), ...items.slice(index + 1)]

  return { updated, frozen }
}

/**
 * Mengecek apakah semua key terdapat dalam sebuah object.
 */
export const hasKeys = (obj: object, ...keys: string[]): boolean =>
  keys.every((key) => key in obj)

/**
 * Membandingkan dua nilai dengan logika pembalik jika prefer=true.
 */
export const is = (
  x?: string | number,
  y?: string | number,
  prefer: false | true = false
): boolean => (prefer ? x !== y : x === y)

/**
 * Mengecek apakah sumber adalah array.
 */
export const isArr = <T>(source: T | T[] | null | undefined): source is T[] =>
  Array.isArray(source)

/**
 * Mengecek apakah value adalah fungsi.
 */
export const isFunc = <T = any>(fn: unknown): fn is (...args: any[]) => T =>
  typeof fn === 'function'

/**
 * Mengecek apakah salah satu value adalah null atau undefined.
 */
export const isNil = <T>(...args: T[]): boolean =>
  args.some((value) => value === null || value === undefined)

/**
 * Mengecek apakah value adalah object, tetapi bukan array.
 */
export const isObj = (val: unknown): val is Record<string, any> =>
  typeof val === 'object' && val !== null && !isArr(val)

/**
 * Mengekstrak nilai tertentu secara rekursif dari object dan array.
 */
function extractDeepValues<T>(input: unknown, key: string): T[] {
  const result: T[] = []

  const search = (obj: any) => {
    if (Array.isArray(obj)) {
      for (const item of obj) search(item)
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [k, v] of Object.entries(obj)) {
        if (k === key) result.push(v as T)
        if (typeof v === 'object') search(v)
      }
    }
  }

  search(input)
  return result
}

/**
 * Normalisasi nama event menjadi bentuk onX (misal: "click" => "onClick")
 */
export const net = (type?: string) => {
  if (!type) return type
  return 'on' + type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Mengubah sumber ke dalam bentuk array, dengan filter opsional:
 * - select: ambil properti secara rekursif
 * - equals: cocokkan nilai field
 * - find: temukan 1 item berdasarkan nilai field
 */
export const toArr: ToArr = <T>(
  source: T | T[] | null | undefined,
  filter?: Filter
): T[] => {
  if (!source) return []

  const res = Array.isArray(source) ? source : [source]

  if (!filter) return res as T[]

  if ('select' in filter) {
    return extractDeepValues<T>(res, filter.select).flat() as T[]
  }

  if ('key' in filter && 'equals' in filter) {
    return res.filter((item) => {
      if (typeof item !== 'object' || item == null) return false
      return (item as any)[filter.key] === filter.equals
    }) as T[]
  }

  if ('key' in filter && 'find' in filter) {
    return res.find((item) => {
      if (typeof item !== 'object' || item == null) return false
      return (item as any)[filter.key] === filter.find
    }) as T[]
  }

  return res as T[]
}
