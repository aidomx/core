//type State = Record<string, any> | Record<string, any>[]
//let finalState: Record<string, any> = {}

//const setStateWithFunction = (
//stateFn: (prev: Record<string, any>) => Record<string, any>
//) => {
//finalState = stateFn(finalState)
//}

//const setStateWithObject = (
//stateObj: Record<string, any> | Record<string, any>[]
//) => {
//if (Array.isArray(stateObj)) {
//stateObj.forEach((obj) => {
//if (typeof obj !== 'object' || obj === null) {
//throw new Error('Each item in array must be a valid object.')
//}
//Object.assign(finalState, obj)
//})
//} else {
//if (typeof stateObj !== 'object' || stateObj === null) {
//throw new Error('State must be a valid object.')
//}
//Object.assign(finalState, stateObj)
//}
//}

//export function setState(...args: any[]): void {
//if (args.length === 2 && typeof args[0] === 'string') {
//// Shorthand: setState('key', 'value')
//setStateWithObject({ [args[0]]: args[1] })
//} else if (args.length === 1) {
//const [input] = args
//if (typeof input === 'function') {
//setStateWithFunction(input)
//} else {
//setStateWithObject(input)
//}
//} else {
//throw new Error('Invalid arguments passed to setState.')
//}
//}

type Data = Record<string, any>

interface Component {
  name: string
  data: Data[]
}

interface Root {
  components: Component[]
}

type ActionPayload = Data
type ActionKey = 'add' | 'remove' | 'update'

type ActionMap = {
  add: (prev: Data[], payload: ActionPayload) => Data[]
  remove: (prev: Data[], payload: ActionPayload) => Data[]
  update: (prev: Data[], payload: ActionPayload) => Data[]
}

let target: Root = {
  components: [],
}

// Action implementations
const actionMap: ActionMap = {
  add: (prev, payload) => [...prev, payload],

  remove: (prev, payload) => {
    return prev.filter((item) => {
      return Object.entries(payload).some(([key, val]) => item[key] !== val)
    })
  },

  update: (prev, payload) => {
    return prev.map((item) => {
      return item.id === payload.id ? { ...item, ...payload } : item
    })
  },
}

const withFunc = <T>(cb: T) => {
  if (typeof cb === 'function') {
    const input = cb((data: Data) => {
      return data ?? target
    })

    const { id, ...rest } = input
    const name = id?.split('.').pop()
    if (!name) return

    const existing = target.components.find((c) => c.name === name)
    if (!existing) return

    Object.entries(rest).forEach(([key, payload]) => {
      if (key in actionMap && typeof payload === 'object') {
        const action = key as ActionKey
        const prevData = existing.data ?? []
        existing.data = actionMap[action](prevData, payload as ActionPayload)
      }
    })
  }
}

const withObj = (source: Data | Data[]) => {
  const items = Array.isArray(source) ? source : [source]

  for (const item of items) {
    const { id, ...rest } = item
    if (!id || !rest || Object.keys(rest).length === 0) continue

    const existing = target.components.find((c) => c.name === id)
    if (existing) {
      existing.data.push(rest)
    } else {
      target.components.push({ name: id, data: [rest] })
    }
  }
}

const setState = (source: Data | Data[] | ((prev: Data) => Data)) => {
  if (typeof source === 'function') {
    withFunc(source)
  } else {
    withObj(source)
  }
}

setState({ id: 'products', name: 'sepatu' })

setState((prev) => ({
  id: 'state.products',
  add: {
    ...prev,
    name: 'books',
    version: 'v1.0.0',
  },
}))

setState((prev) => ({
  id: 'state.products',
  remove: {
    ...prev,
    name: 'sepatu',
  },
}))

setState((prev) => ({
  id: 'state.products',
  update: {
    ...prev,
    id: 1, // pastikan `id` match untuk update
    version: 'v1.0.2',
  },
}))

console.log(JSON.stringify(target, null, 2))
