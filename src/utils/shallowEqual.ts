/**
 * Membandingkan dua objek untuk menentukan apakah mereka memiliki nilai yang sama pada properti yang sama.
 * Perbandingan dilakukan hanya pada properti pertama dan tidak menyeluruh ke dalam objek atau array yang lebih dalam.
 *
 * @param prev Objek pertama yang akan dibandingkan
 * @param current Objek kedua yang akan dibandingkan
 * @returns true jika objek `prev` dan `current` memiliki properti yang sama dengan nilai yang sama, false jika tidak
 */
export const shallowEqual = <T extends Record<string, any> | null>(
  prev: T,
  current: T
): boolean => {
  // Jika objek sama persis, return true
  if (prev === current) return true
  // Jika salah satu objek null atau undefined, return false
  if (!prev || !current) return false

  // Ambil daftar kunci dari kedua objek
  const prevKeys = Object.keys(prev)
  const currentKeys = Object.keys(current)

  // Jika jumlah kunci berbeda, objek tidak sama
  if (prevKeys.length !== currentKeys.length) return false

  // Bandingkan nilai untuk setiap kunci
  for (let key of prevKeys) {
    if (prev[key] !== current[key]) return false
  }

  // Semua perbandingan cocok, return true
  return true
}
