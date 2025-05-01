export type DbProps = {
  // Umum
  id?: boolean
  uuid?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  deletedAt?: boolean

  // Pengguna
  username?: boolean
  email?: boolean
  password?: boolean
  name?: boolean
  phone?: boolean
  avatarUrl?: boolean

  // Status & Kontrol
  status?: boolean
  isActive?: boolean
  isVerified?: boolean
  role?: boolean
  type?: boolean

  // Relasi
  userId?: boolean
  categoryId?: boolean
  parentId?: boolean
  ownerId?: boolean

  // Konten
  title?: boolean
  slug?: boolean
  description?: boolean
  content?: boolean
  imageUrl?: boolean

  // Lokasi & Waktu
  location?: boolean
  address?: boolean
  city?: boolean
  country?: boolean
  latitude?: boolean
  longituda?: boolean
  startTime?: boolean
  endTime?: boolean
}
