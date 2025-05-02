/**
 * Deeply clones an object while preserving function references and handling circular structures.
 *
 * Unlike JSON-based cloning, this function retains methods, callbacks, and event handlers,
 * making it suitable for complex runtime objects like UI components or virtual rule elements.
 *
 * @template T The type of the input and cloned output.
 * @param input The value to clone. Can be an object, array, function, or primitive.
 * @returns A deep clone of the input, preserving all function properties.
 */
export function clonePreserve<T>(input: T): T {
  const seen = new WeakMap()

  function clone<T>(value: T): T {
    if (value === null || typeof value !== 'object') return value
    if (typeof value === 'function') return value
    if (seen.has(value)) return seen.get(value)

    const output: any = Array.isArray(value) ? [] : {}
    seen.set(value, output)

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        output[key] = clone((value as any)[key])
      }
    }

    return output
  }

  return clone(input)
}
