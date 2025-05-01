import { defineRules } from '@/rules'

export const rulesConfig = defineRules({
  root: 'container',
  components: [],
  routes: {
    '/': ['products'],
  },
  debug: true,
})
