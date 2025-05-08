import type { Rules, RupaManipulator, SpawnConfig, Use } from '@/types'
import { settings, SettingsInstance } from './settings'

type Options = {
  autoCompile?: true | false
  clone?: string
  connect?: (rupa: RupaManipulator) => void
  define: Rules
  remove?: string
  reset?: true | false
  spawn?: {
    id: string
    config: SpawnConfig
  }
  // summon?: string
  sort?: { from: string; to: string }
  devMode?: true | false
  use?: Use
}

/**
 * defineConfig
 *
 * Digunakan untuk publik dengan versi yang aman dan siap pakai.
 *
 * @author Aidomx
 * @since version 0.1.1
 */
export const defineConfig = (
  options: Options
): Rules | SettingsInstance | void => {
  const {
    define,
    connect,
    autoCompile,
    clone,
    remove,
    reset,
    spawn,
    // summon,
    sort,
    use,
    devMode,
  } = options

  // 1. Define and connect come first
  if (define) settings.define(define)

  // 2. Compile if necessary
  if (autoCompile) settings.compile(autoCompile)

  // 3. Follow-up operations
  if (connect) settings.connect(connect)
  if (clone) settings.clone(clone)
  if (remove) settings.remove(remove)
  if (reset) settings.reset()
  // if (summon) settings.summon(summon)
  if (spawn) settings.spawn(spawn.id, spawn.config)
  if (sort) settings.sort(sort)
  if (use) settings.use(use)

  // 4. Return based on mode
  if (settings.getCompiled() && !devMode) {
    return settings.push()
  }

  if (devMode) {
    return settings
  }
}
