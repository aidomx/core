export type DbStore = {
  // Identitas Umum
  id?: string
  uuid?: string
  slug?: string
  code?: string

  // Timestamp
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  publishedAt?: Date
  startTime?: Date
  endTime?: Date

  // Informasi Umum
  title?: string
  name?: string
  description?: string
  content?: string
  excerpt?: string
  imageUrl?: string
  avatarUrl?: string
  bannerUrl?: string

  // Lokasi
  location?: string
  address?: string
  city?: string
  province?: string
  region?: string
  country?: string
  postalCode?: string
  latitude?: string
  longitude?: string

  // Pengguna / Auth
  username?: string
  email?: string
  phone?: number
  password?: string
  isActive?: boolean
  isVerified?: boolean
  isAdmin?: boolean
  role?: string
  token?: string

  // Produk / Inventori
  price?: number
  discount?: number
  stock?: number
  currency?: string
  tags?: string[]
  sku?: string
  barcode?: string
  weight?: number
  dimensions?: {
    width?: number
    height?: number
    depth?: number
  }

  // Hubungan / Relasi
  userId?: string
  categoryId?: number
  parentId?: number
  ownerId?: number
  relatedIds?: string[]

  // Transaksi / Status
  status?: string | boolean
  type?: string
  paymentStatus?: string
  orderStatus?: string
  transactionId?: string
  invoiceId?: string

  // Metadata fleksibel
  options?: Record<string, any>
  metadata?: Record<string, any>
  config?: Record<string, any>

  // Custom field
  [key: string]: any
}
