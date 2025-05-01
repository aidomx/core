export const generateId = (tag: string, index?: number) => {
  const rand = Math.random().toString(36).substring(2, 5)
  if (index) {
    return tag + '_' + index
  }
  return tag + '_' + rand
}
