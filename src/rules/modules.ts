/**
 * Modules system
 *
 * Kerangka interaktif dalam memproses permintaan
 * dari bahasa baru .ai atau .aix
 *
 * @since version 0.1.7
 */
type Request = {
  type: 'directive' | 'router' | 'variable' | 'function'
  name: string
  args?: any
  body?: any
}

type ModuleKey = string // "type:name", misalnya "router:login"

const mod = new Map<ModuleKey, Request>()

type ModuleTasks = {
  create(request: Request): void
  has(type: Request['type'], name: string): boolean
  get(type: Request['type'], name: string): Request | undefined
  entries(): IterableIterator<[ModuleKey, Request]>
}

export const moduleTasks: ModuleTasks = {
  create(request) {
    const key = `${request.type}:${request.name}`
    mod.set(key, request)
  },

  has(type, name) {
    return mod.has(`${type}:${name}`)
  },

  get(type, name) {
    return mod.get(`${type}:${name}`)
  },

  entries() {
    return mod.entries()
  },
}

export const getModules = (
  type?: Request['type'],
  name?: string
): Request[] => {
  const results: Request[] = []
  for (const [key, request] of moduleTasks.entries()) {
    if ((type && request.type !== type) || (name && request.name !== name))
      continue
    results.push(request)
  }
  return results
}

export const modulePayload = (type: Request['type'], name: string) => {
  const mod = moduleTasks.get(type, name)
  if (!mod) return null

  switch (type) {
    case 'directive':
      return { import: mod.name, options: mod.args }
    case 'router':
      return {
        route: mod.name,
        targets: (mod.args || '').split('|').map((x: string) => x.trim()),
      }
    case 'variable':
      return { key: mod.name, value: mod.args }
    case 'function':
      return { name: mod.name, params: mod.args, body: mod.body }
    default:
      return null
  }
}

export const defineModules = (request: Request[]): void => {
  for (const req of request) {
    moduleTasks.create(req)
  }
}

// Misal, dari file routes.ai kamu sudah memproses baris-baris menjadi Request.
// Berikut adalah contoh simulasi:
const sampleLines: Request[] = [
  { type: 'directive', name: 'View' },
  { type: 'directive', name: 'Core<warn>' },
  { type: 'router', name: 'login', args: 'View.login | 404' },
  { type: 'router', name: 'root', args: '"title", "description"' },
  {
    type: 'variable',
    name: 'db',
    args: 'Database({ hostname: "", port: "" })',
  },
  { type: 'variable', name: 'var', args: '"variabel"' },
  {
    type: 'function',
    name: 'login',
    args: 'form',
    body: `
    username = form.usename
    password = form.password
    res = db.find(username) -> db.user
    if (res.nil) return warn("No data")
    valid = res.validate(password)
    if (!valid) return warn("Password wrong")
    return :auth
  `,
  },
]

defineModules(sampleLines)
