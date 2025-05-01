export type DbStore = {
  // Umum
  id?: string
  uuid?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date

  // Pengguna
  username?: string
  email?: string
  password?: string
  name?: string
  phone?: number
  avatarUrl?: string

  // Status & Kontrol
  status?: boolean
  isActive?: boolean
  isVerified?: boolean
  role?: string
  type?: string

  // Relasi
  userId?: string
  categoryId?: number
  parentId?: number
  ownerId?: number

  // Konten
  title?: string
  slug?: string
  description?: string
  content?: string
  imageUrl?: string

  // Lokasi & Waktu
  location?: string
  address?: string
  city?: string
  country?: string
  latitude?: string
  longituda?: string
  startTime?: Date
  endTime?: Date
  [key: string]: any
}
