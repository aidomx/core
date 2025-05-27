import { Arr } from '@/utils'
import { ERROR_CODE, Main, patterns } from './main'
import type { RulesApi } from '@/types'

type Err = {
  code: number
  message: string
}

type RulesConfig = RulesApi.rulesConfig

/**
 * Input and Output
 *
 * Penghubung antara API dan Core system.
 */
export class IO {
  currComp: string = ''
  currCompLines: string[] = []
  newLine: Array<never> = []
  lines: Array<string | never> = []
  err: Err = {} as Err
  rules: RulesConfig = {} as RulesConfig

  constructor(raw: string | null) {
    if (!raw) {
      this.err.code = ERROR_CODE.NO_CONTENT
      this.err.message = 'No content is readable.'

      return
    }

    this.lines = Arr(raw, {
      from: 'string',
      split: /\r?\n/,
    })
  }

  getIndex() {
    const rootCheck = this.rootCheck()

    if (!rootCheck) {
      this.err.code = ERROR_CODE.MULTIPLE_ROOT
      this.err.message = 'Only one root is allowed!'

      return
    }
  }

  rootCheck(): boolean {
    const root = this.lines!.filter((line) => patterns.root.test(line))

    return root!.length > 1 ? false : true
  }

  start() {
    for (const lines of this.lines) {
      this.rules = Main(lines)
    }
  }
}

new IO(`
Hello,
World
`)
