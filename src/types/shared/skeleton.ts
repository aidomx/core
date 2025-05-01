/**
 * Fallback untuk menunggu respon dari data.
 *
 * @type object
 */
export type Skeleton = {
  /** ClassName CSS custom untuk skeleton */
  // className?: string

  /** Aktifkan skeleton UI */
  // enable: boolean

  /** Nama skeleton component (optional) */
  // name?: string

  /** Inline style untuk skeleton */
  // style?: Record<string, any>
  select: SkeletonSelect
  delay: {
    start: number
    end: number
  }
}

export type SkeletonSelect = {
  name: string
  status: boolean
}
