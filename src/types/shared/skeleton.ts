/**
 * Fallback untuk menunggu respon dari data.
 *
 * @type object
 */
export type Skeleton = {
  /** ClassName CSS custom untuk skeleton */
  className?: string

  /** Nama skeleton component (optional) */
  name?: string

  /** Inline style untuk skeleton */
  style?: Record<string, any>
  status: false | true
  delay: number
  content?: string
}
