import { GHOST_ELEMENT_ID } from './cacheKey'

export const getGhostId = (id: string = '') => GHOST_ELEMENT_ID + id
