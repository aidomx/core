import { Arr, benchmark, createObj, isArr, isWarn } from '@/utils'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { ast } from './ast'
import { isRules, tasks } from '@/_caches'
import { defineConfig, push } from '@/rules'
import { defineModule, Modules, modules } from './modules'

type CompilerType = 'index' | 'routes' | 'config' | string

type CompilerContent = string | null | undefined

type CompilerPayload<
  K extends CompilerType = CompilerType,
  T extends CompilerFiles = CompilerFiles,
> = {
  getFrom(key: K): CompilerContent | void
  set(value: T): void
} & Record<K, T | Function | object>

type CompilerFiles = {
  type: CompilerType
  content: CompilerContent
}

type CompilerProps = Array<CompilerFiles | never> | null

const compilerMap = new Map<CompilerType, CompilerContent>()
const ErrorMap = new Map<CompilerType, string>()
const io = new Map()
const store = new Map()
const CC = 'current:components'
const CCL = 'current:components.line'

const compilerPayload: CompilerPayload = {
  getFrom(key) {
    if (ErrorMap.has(key)) {
      return isWarn(ErrorMap.get(key)!)
    }

    if (!compilerMap.has(key)) {
      return isWarn(`${key} is not found.`)
    }

    const response = io.get(key)
    if (!response) {
      return isWarn(`Invalid get ${key}`)
    }

    return response
  },

  set(value) {
    if (compilerMap.has(value.type)) {
      return ErrorMap.set(value.type, `${value.type} already exists.`)
    }

    compilerMap.set(value.type, value.content)
    return interpret(value.type)
  },
}

const interpret = (key: CompilerType) => {
  const content = compilerMap.get(key)
  parse.lines = Arr(content ?? '', {
    from: 'string',
    split: /\r?\n/,
  })

  switch (key) {
    case 'index':
      const response = parse.setIndexed(key)
      if (!response) {
        return isWarn(`Error when set ${key}`)
      }

      parse.buildIndexed()
      break

    case 'routes':
      parse.setRoutes(key)
      break
  }
}

const parse = {
  buildIndexed() {
    const define = tasks.read('define')

    if (isRules(define) && io.has('index')) {
      return io.get('index')
    }

    defineConfig({ define })
    io.set('index', push())
  },

  components(name: string, buffer: Array<string>) {
    let origin = createObj(buffer.join(' '))
    let diff = JSON.parse(origin)
    let define = tasks.read('define')

    try {
      define.components = {
        ...define.components,
        [name]: {
          name,
          ...diff,
        },
      }

      tasks.update('define', define)
      return define
    } catch (err) {
      return ErrorMap.set(
        'index',
        `Invalid JSON structure in component "${name}"`
      )
    }
  },

  lines: [] as Array<string>,

  newLine: [] as Array<string | never>,

  root(line: string) {
    let origin = '{' + line.split(' ').join(':') + '}'
    let diff = JSON.parse(createObj(origin))
    tasks.update('define', diff)
  },

  setIndexed(key: CompilerType) {
    const root = this.lines.filter((l) => ast.root.test(l))

    if (root.length > 1) {
      return ErrorMap.set(key, 'Root only one is allowed.')
    }

    benchmark.start('Compare ast')

    for (const line of this.lines) {
      if (ast.root.test(line)) {
        this.root(line)
        continue
      }

      this.newLine.push(line)
    }

    for (const line of this.newLine) {
      const match = line.match(ast.components)

      if (match) {
        let key = match[1]
        let value = match[2]

        if (store.has(CC)) {
          this.components(store.get(CC), store.get(CCL))
        }

        store.set(CC, key)
        store.set(CCL, [value])
      } else {
        const ccl = store.get(CCL)
        const value = ccl.push(line)
        store.set(CCL, value)
      }
    }

    benchmark.end('Compare ast')

    if (store.has(CC)) {
      this.components(store.get(CC), store.get(CCL))
      return true
    }

    return false
  },

  setRoutes(key: CompilerType) {
    for (const line of this.lines) {
      if (ast.directive.test(line)) {
        directive(line)
      }
    }
  },
}

const directive = (line: string) => {
  let match = line.match(ast.directive)
  if (match) {
    let name = match[1]
    let prop = match[2]

    defineModule({
      name,
      scope: prop ? [prop] : [],
    })
  }
}

/**
 * Compiler
 *
 */
export function Compiler(files: CompilerProps = null): CompilerPayload {
  tasks.create('define', {
    root: '',
    components: [],
  })

  if (isArr(files)) {
    for (const raw of files) {
      compilerMap.set(raw.type, raw.content)
    }
  }

  return { ...compilerPayload }
}

benchmark.start('Compiler')
const compiler = Compiler()

compiler.set({
  type: 'index',
  content: `
  root "app"
  components.hello {}
  `,
})

compiler.set({
  type: 'routes',
  content: readFileSync(resolve('routes.ai'), 'utf-8'),
})

compiler.getFrom('index')
compiler.getFrom('routes')

benchmark.end('Compiler')
benchmark.report(true)
