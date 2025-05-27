import { reactive } from '@/rules'

type Modules = {
  import: null
}

type ModuleInternal = {
  reactive: typeof reactive
}

type ModuleKey = keyof ModuleInternal

const fnMap = new WeakMap()
const moduleInternal: ModuleInternal = {
  reactive,
}

const moduleExternal = () =>
  new Proxy({} as typeof Function, {
    get(_, prop, value) {
      let ref = Reflect.get(_, prop, value)

      return ref
    },
  })

const payload: ProxyHandler<any> = {
  get: Reflect.get,
  set(t, prop, value) {
    const ref = Reflect.set(t, prop, value)
    let fn = {} as Record<string, Function>

    if (prop === 'import') {
      if (typeof moduleInternal[value.name as ModuleKey] === 'function') {
        fnMap.set(value, moduleInternal[value.name as ModuleKey])
      } else {
        fn[value.name] = moduleExternal
        fnMap.set(value, fn[value.name])
      }
    }

    return ref
  },
}

const modules: Modules = {
  import: null,
}

type Packages = {
  name: string
  scope: Array<string>
}

export const defineModule = (packages: Packages) => {
  const mod = new Proxy(modules, payload)
  mod.import = packages

  console.log(fnMap.get(packages))
}
