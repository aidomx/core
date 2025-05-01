import { encodeData } from '@/security'
import { GHOST_ELEMENT_ID } from './cacheKey'

export const getGhostId = (id: string = 'components') =>
  encodeData({
    id: GHOST_ELEMENT_ID + id,
  })
