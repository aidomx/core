import type { RulesApi } from '..'

type Key = keyof RulesApi.options

type InferReturn<T, Fallback = void> = T extends (...args: unknown[]) => infer R
  ? R
  : Fallback

type TaskRunner = {
  create<K extends Key>(
    key: K,
    value: RulesApi.options[K]
  ): InferReturn<RulesApi.options[K]>

  read<K extends Key>(
    key: K
  ): InferReturn<RulesApi.options[K], RulesApi.options[K]>

  update<K extends Key>(
    key: K,
    value: RulesApi.options[K]
  ): InferReturn<RulesApi.options[K], RulesApi.options[K]>

  delete<K extends Key>(
    key: K
  ): InferReturn<RulesApi.options[K], RulesApi.options[K]>

  run<K extends Key>(
    key: K,
    value: RulesApi.options[K]
  ): InferReturn<RulesApi.options[K]>
}

export type Tasks = {
  create<K extends Key>(key: K, value: RulesApi.options[K]): void
  read<K extends Key>(key: K): RulesApi.options[K]
  update<K extends Key>(key: K, value: RulesApi.options[K]): void
  delete<K extends Key>(key: K): void
  has<K extends Key>(key: K): boolean
  run<K extends Key>(key: K, value: RulesApi.options[K]): void
  // Optional chaining for run
  // Example: tasks.auto?.run(key, value)
  auto?: TaskRunner
}
